import { Provider } from "../provider.js"
import { Ok, Error } from "../../tools/result.js"
import { Cookie } from "../../tools/cookies.js"
export class SupJavProvider extends Provider {
    name = "SupJav"
    enable = true
    searchUrl = "https://supjav.com/zh/?s="
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
        let items = document.querySelectorAll(".posts .post")
        let item
        for (let t of items) {
            if (t.querySelector(".con h3 a").innerText.toLowerCase().indexOf(id.toLowerCase()) != -1) {
                item = t
                break
            }
        }
        if (!item) {
            return new Error("该平台找不到" + id)
        }
        let href = item.querySelector(".con h3 a").href
        if (href) {
            return new Ok(href)
        } else {
            return new Error("获取的连接为空")
        }
    }
}