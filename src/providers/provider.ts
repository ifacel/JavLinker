import { Ok, Error as ResultError, ImportantError, Result } from "../models/result.ts"
import { Network } from "../tools/network.ts"
import { Info } from "../models/info.ts"
import { SearchData } from "../models/search_data.ts"
import { NetworkError, NetworkOk, NetworkResult } from "../models/network_result.ts"

const parser = new DOMParser()

export abstract class Provider {
    abstract name: string
    abstract enable: boolean
    parser: DOMParser = parser

    /**
     * 
     * @param {Info} info 
     * @returns {Promise<Result>}
     */
    abstract search(info: Info): Promise<Result<SearchData>>

    async fetch(url: string, data?: any): Promise<NetworkResult> {
        try {
            let response = await Network.fetch(url, data)
            return response
        } catch (error: any) {
            return new NetworkError(-1, "network error: " + (error.message || String(error)), "")
        }
    }
}
