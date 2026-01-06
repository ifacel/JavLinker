import { Ok, Error, ImportantError } from "../tools/result.js"
import { Network } from "../tools/network.js"
let parser = new DOMParser()

export class Provider {
    name
    enable
    parser = parser
    /**
     * 
     * @param {string} id 
     * @returns {Promise<Result>}
     */
    async getUrl(id) {
        let urls = this.getSearchUrl(id)
        for (const url of urls) {
            let result
            try {
                result = await this.checkValidStatus(id, url)
            } catch (error) {
                return new Error("网络错误：" + error.message)
            }
            if (result) {
                return new Ok(url)
            }
        }
        return new Error("该平台找不到" + id)
    }

    async fetch(url) {
        try {
            let response = (await Network.fetch(url))
            switch (true) {
                case response instanceof Ok:
                    return response
                case response instanceof Error:
                    return new ImportantError(response.message)
                default:
                    return new ImportantError("未知错误：" + responseData.message)
            }
        } catch (error) {
            return new ImportantError("网络错误：" + error.message)
        }
    }
}

