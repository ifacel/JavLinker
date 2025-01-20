class StorageImpl {
    static KEY_OPEN_IN_BACKEND = 'openInBackend'
    static KEY_USE_NEW_TAB = 'useNewTab'
    browser
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
    set(key, value) {
        return new Promise((resolve, reject) => {
            this.browser.storage.local.set({ [key]: value }, (r) => {
                resolve(new Ok(r))
            })
        })
    }

    /**
     * 
     * @param {string} key 
     * @returns {Promise<Result>}
     */
    get(key) {        
        return new Promise((resolve, reject) => {
            this.browser.storage.local.get(key, result => {
                if (result) {
                    resolve(new Ok(result[key]))
                } else {
                    resolve(new Error("没有数据"))
                }
            })
        })
    }


    setUseNewTab(value) {
        return this.set(StorageImpl.KEY_USE_NEW_TAB, value)
    }

    getUseNewTab() {
        return this.get(StorageImpl.KEY_USE_NEW_TAB)
    }

    /**
     * 
     * @param {boolean} value 
     * @returns {Promise<Result>}
     */
    setOpenInBackend(value) {
        return this.set(StorageImpl.KEY_OPEN_IN_BACKEND, value)
    }

    /**
     * 
     * @returns {Promise<Result<boolean>>}
     */
    getOpenInBackend() {
        return this.get(StorageImpl.KEY_OPEN_IN_BACKEND)
    }
}

const Storage = new StorageImpl()