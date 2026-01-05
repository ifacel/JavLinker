import browserHolder from "./browser_init.js"

export class NetworkImpl {
    /**
     * 
     * @param {*} url 
     * @returns {Promise<FetchResult>}
     */
    fetch(url, requestInit) {
        return new Promise((resolve, reject) => {
            browserHolder.runtime.sendMessage(
                {
                    type: "fetch",
                    url,
                    requestInit
                },
                response => {
                    resolve(new FetchResult(response.status, response.text, response.error))
                }
            )
        })
    }
}

export class FetchResult {
    status
    text
    error
    constructor(status, text, error) {
        this.status = status;
        this.text = text;
        this.error = error;
    }
}

export const Network = new NetworkImpl();
