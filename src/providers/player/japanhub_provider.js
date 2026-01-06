import { Provider } from "../provider.js"
import { Ok, Error, ImportantError } from "../../tools/result.js"
import { Network } from "../../tools/network.js"

export class JapanHubProvider extends Provider {
    name = "JapanHub"
    enable = true
    searchUrl = "https://japanhub.net/search/videos?search_query="
    /**
     * 
     * @param {string} id 
     * @returns {Promise<Result>}
     */
    async getUrl(id) {
        let url = this.searchUrl + id
        let result = await this.fetch(url)
        if (!(result instanceof Ok)) {
            return result
        }
        let responseData = result.data
        let document = this.parser.parseFromString(responseData, "text/html")
        let items = document.querySelectorAll(".well-sm")
        let item
        for (let t of items) {
            let titleElement = t.querySelector(".video-title")
            if (titleElement && titleElement.innerText.indexOf(id) != -1) {
                item = t
                break
            }
        }
        if (!item) {
            return new Error("该平台找不到" + id)
        }
        let href = item.querySelector("a").href
        if (href) {
            return new Ok(href)
        } else {
            return new Error("获取的连接为空")
        }
    }
}