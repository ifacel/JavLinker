import browserHolder from "./browser_init.js"
import { Ok, Error } from "./result.js"
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
                response =>
                    response.status == 200 ? resolve(new Ok(response.text)) : resolve(new Error("status: " + response.status))
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
