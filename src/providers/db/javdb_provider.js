import { Provider } from "../provider.js"
import { Ok, Error, ImportantError } from "../../tools/result.js"
import { Network } from "../../tools/network.js"

export class JavdbProvider extends Provider {
    name = "JavDB"
    enable = true
    baseUrl = "https://javdb.com"
    searchUrl = this.baseUrl + "/search?q="
    /**
     * 
     * @param {string} id 
     * @returns {Promise<Result>}
     */
    async getUrl(id) {
        let url = this.searchUrl + id
        let response
        let result = await this.fetch(url)
        if (!(result instanceof Ok)) {
            return result
        }
        response = result.data
        let document = this.parser.parseFromString(response, "text/html")

        if (!document.querySelector(".container")) {
            let body = document.querySelector("body")
            let scripts = body.querySelectorAll("script")
            scripts.forEach(el=>el.remove())
            return new ImportantError(body.innerText)
        }

        if (!document.querySelector('base')) {
            const baseElement = document.createElement('base');
            baseElement.href = this.baseUrl;
            document.head.appendChild(baseElement);
        }
        let items = document.querySelectorAll(".movie-list .item")
        let item
        for (let t of items) {
            if (t.querySelector(".video-title").innerText.toLowerCase().indexOf(id.toLowerCase()) != -1 || id.toLowerCase().indexOf(t.querySelector(".video-title").innerText.toLowerCase()) != -1) {
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