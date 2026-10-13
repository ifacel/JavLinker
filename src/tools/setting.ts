import { Storage } from "./storage.ts"
import { Result } from "../models/result.ts"

const KEY_OPEN_IN_BACKEND = 'openInBackend'
const KEY_USE_NEW_TAB = 'useNewTab'
const KEY_SELECTION_SEARCH_ENABLED = 'selectionSearchEnabled'

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

    /**
     * 选中文字搜索（所有网站通用）是否开启，默认开启
     * @param {boolean} value 
     * @returns {Promise<Result>}
     */
    async setSelectionSearchEnabled(value: boolean): Promise<Result> {
        return Storage.set(KEY_SELECTION_SEARCH_ENABLED, value)
    }

    /**
     * @returns {Promise<Result<boolean>>}
     */
    async getSelectionSearchEnabled(): Promise<Result<boolean>> {
        return Storage.get(KEY_SELECTION_SEARCH_ENABLED)
    }
}

export const Setting = new SettingImpl()
