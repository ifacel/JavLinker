import { Storage } from "./storage.js"
class SettingImpl {
    async setUseNewTab(value) {
        return Storage.set(Storage.KEY_USE_NEW_TAB, value)
    }

    async getUseNewTab() {
        return Storage.get(Storage.KEY_USE_NEW_TAB)
    }

    /**
     * 
     * @param {boolean} value 
     * @returns {Promise<Result>}
     */
    async setOpenInBackend(value) {
        return Storage.set(Storage.KEY_OPEN_IN_BACKEND, value)
    }

    /**
     * 
     * @returns {Promise<Result<boolean>>}
     */
    async getOpenInBackend() {
        return Storage.get(Storage.KEY_OPEN_IN_BACKEND)
    }
}

export const Setting = new SettingImpl()