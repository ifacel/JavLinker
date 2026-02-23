import { Storage } from "./storage.js"

const KEY_OPEN_IN_BACKEND = 'openInBackend'
const KEY_USE_NEW_TAB = 'useNewTab'

class SettingImpl {
    async setUseNewTab(value) {
        return Storage.set(KEY_USE_NEW_TAB, value)
    }

    async getUseNewTab() {
        return Storage.get(KEY_USE_NEW_TAB)
    }

    /**
     * 
     * @param {boolean} value 
     * @returns {Promise<Result>}
     */
    async setOpenInBackend(value) {
        return Storage.set(KEY_OPEN_IN_BACKEND, value)
    }

    /**
     * 
     * @returns {Promise<Result<boolean>>}
     */
    async getOpenInBackend() {
        return Storage.get(KEY_OPEN_IN_BACKEND)
    }
}

export const Setting = new SettingImpl()