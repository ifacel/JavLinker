import { Storage } from "./storage.ts"
import { Result } from "../models/result.ts"

const KEY_OPEN_IN_BACKEND = 'openInBackend'
const KEY_USE_NEW_TAB = 'useNewTab'

class SettingImpl {
    async setUseNewTab(value: boolean): Promise<Result> {
        return Storage.set(KEY_USE_NEW_TAB, value)
    }

    async getUseNewTab(): Promise<Result<boolean>> {
        return Storage.get(KEY_USE_NEW_TAB)
    }

    /**
     * 
     * @param {boolean} value 
     * @returns {Promise<Result>}
     */
    async setOpenInBackend(value: boolean): Promise<Result> {
        return Storage.set(KEY_OPEN_IN_BACKEND, value)
    }

    /**
     * 
     * @returns {Promise<Result<boolean>>}
     */
    async getOpenInBackend(): Promise<Result<boolean>> {
        return Storage.get(KEY_OPEN_IN_BACKEND)
    }
}

export const Setting = new SettingImpl()
