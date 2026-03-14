import { Ok, Error as ResultError, ImportantError, Result } from "../models/result.ts"
import { Network } from "../tools/network.ts"
import { Info } from "../models/info.ts"
import { SearchData } from "../models/search_data.ts"

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

    async fetch(url: string, data?: any): Promise<Result> {
        try {
            let response = await Network.fetch(url, data)
            if (response instanceof Ok) {
                return response
            } else if (response instanceof ResultError) {
                return new ImportantError(response.message)
            } else {
                // @ts-ignore
                return new ImportantError("未知错误：" + (response?.message || 'unknown'))
            }
        } catch (error: any) {
            return new ImportantError("网络错误：" + (error.message || String(error)))
        }
    }
}
