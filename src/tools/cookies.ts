import browserHolder from "./browser_init.ts"
import { Ok, Error as ResultError, Result } from "../models/result.ts"

export class CookieImpl {
    /**
     * 
     * @param {string} url 
     * @param {string} name
     * @returns {Promise<Result>}
     */
    get(url: string, name: string): Promise<Result> {
        return new Promise((resolve) => {
            browserHolder.runtime.sendMessage(
                {
                    type: "getCookie",
                    url,
                    name
                },
                (response: any) => {
                    if (response) {
                        resolve(new Ok(response.value))
                    } else {
                        resolve(new ResultError("Cookie not found"))
                    }
                }
            )
        })
    }
}

export const Cookie = new CookieImpl()
