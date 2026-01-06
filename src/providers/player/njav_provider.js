import { Provider } from "../provider.js"
import { Ok, Error } from "../../tools/result.js"

export class NjavProvider extends Provider {
    name = "njav"
    enable = true
    getSearchUrl(id) {
        return [`https://www.njav.com/zh/search?q=${id}`]
    }
    /**
     * 
     * @param {string} id 
     * @returns {Promise<Result>}
     */
    async getUrl(id) {
        let urls = this.getSearchUrl(id)
        let url = urls[0]
        let result = await this.fetch(url)
        if (!(result instanceof Ok)) {
            return result
        }
        let responseData = result.data
        let document = this.parser.parseFromString(responseData, "text/html")
        let details = document.querySelectorAll(".detail")
        let href
        for (let d of details) {
            let a = d.querySelector('a')
            //需要把a.href转小写
            let idLower = id.toLowerCase()
            if (a.href.indexOf(idLower) != -1) {
                href = a.href
                break
            }
        }
        if (!href) {
            return new Error("该平台找不到" + id)
        }
        return new Ok(href)
    }
}