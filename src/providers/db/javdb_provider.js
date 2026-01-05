import { Provider } from "../provider.js"
import { Ok, Error } from "../../tools/result.js"
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
        try {
            response = (await Network.fetch(url)).text
        } catch (error) {
            return new Error("网络错误：" + error.message)
        }
        let document = this.parser.parseFromString(response, "text/html")
        if (!document.querySelector('base')) {
            const baseElement = document.createElement('base');
            baseElement.href = this.baseUrl;
            document.head.appendChild(baseElement);
        }
        let items = document.querySelectorAll(".movie-list .item")
        let item
        for (let t of items) {
            if (t.querySelector(".video-title").innerText.toLowerCase().indexOf(id.toLowerCase()) != -1) {
                item = t
                break
            }
        }
        if (!item) {
            console.info(this.name + "：没有找到" + id);
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