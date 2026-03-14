import { Ok, Error as ResultError, Result } from "../models/result.ts"
import browserHolder from "./browser_init.ts"

export class StorageImpl {
    browser: typeof chrome
    constructor() {
        if (typeof browserHolder !== "undefined") {
            this.browser = browserHolder
        } else {
            this.browser = chrome
        }
    }
    /**
     * 
     * @param {string} key 
     * @param {any} value 
     * @returns {Promise<Result>}
     */
    set(key: string, value: any): Promise<Result> {
        return new Promise((resolve) => {
            this.browser.storage.local.set({ [key]: value }, () => {
                // @ts-ignore
                resolve(new Ok(undefined))
            })
        })
    }

    /**
     * 
     * @param {string} key 
     * @returns {Promise<Result>}
     */
    get(key: string): Promise<Result> {        
        return new Promise((resolve) => {
            this.browser.storage.local.get(key, (result: any) => {
                if (result && result[key] !== undefined) {
                    resolve(new Ok(result[key]))
                } else {
                    resolve(new ResultError("没有数据"))
                }
            })
        })
    }
}

export const Storage = new StorageImpl()
