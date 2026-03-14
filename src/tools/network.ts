import browserHolder from "./browser_init.ts"
import { Ok, Error as ResultError, Result } from "../models/result.ts"

export class NetworkImpl {
    /**
     * 
     * @param {string} url 
     * @param {any} data
     * @returns {Promise<Result>}
     */
    fetch(url: string, data?: any): Promise<Result> {
        return new Promise((resolve) => {
            browserHolder.runtime.sendMessage(
                {
                    type: "fetch",
                    url,
                    data
                },
                (response: any) =>
                    response.status == 200 ? resolve(new Ok(response.text)) : resolve(new ResultError("status: " + response.status))
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
