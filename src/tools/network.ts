import browserHolder from "./browser_init.ts"
import { Ok, Error as ResultError, Result } from "../models/result.ts"
import { NetworkError, NetworkOk, NetworkResult } from "../models/network_result.ts"

export class NetworkImpl {
    /**
     * 
     * @param {string} url 
     * @param {any} data
     * @returns {Promise<Result<NetworkResult<string>>>}
     */
    fetch(url: string, data?: any): Promise<NetworkResult> {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(
                {
                    type: "fetch",
                    url,
                    data
                },
                (response: any) =>
                    response.status == 200 ? resolve(new NetworkOk(response.status, response.text)) : resolve(new NetworkError(response.status, "status: " + response.status, response.text))
            )
        })
    }
}

export class FetchResult {
    status: number
    text: string
    error: any
    constructor(status: number, text: string, error: any) {
        this.status = status;
        this.text = text;
        this.error = error;
    }
}

export const Network = new NetworkImpl();
