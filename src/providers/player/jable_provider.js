import { Provider } from "../provider.js"
import { Ok, Error } from "../../tools/result.js"
import { Network } from "../../tools/network.js"

export class JableProvider extends Provider {
    name = "Jable"
    enable = true
    searchUrl = "https://jable.tv/search/"
    /**
     * 
     * @param {string} id 
     * @returns {Promise<Result>}
     */
    async getUrl(id) {
        let url = this.searchUrl + id + "/"
        let response
        try {
            response = (await Network.fetch(url)).text
        } catch (error) {
            return new Error("网络错误：" + error.message)
        }
        let document = this.parser.parseFromString(response, "text/html")
        let items = document.querySelectorAll(".video-img-box")
        let item
        for (let t of items) {
            if (t.querySelector(".title").querySelector("a").innerText.indexOf(id) != -1) {
                item = t
                break
            }
        }
        if (!item) {
            console.info(this.name + "：没有找到" + id);
            return new Error("该平台找不到" + id)
        }
        let href = item.querySelector(".title").querySelector("a").href
        if (href) {
            return new Ok(href)
        } else {
            return new Error("获取的连接为空")
        }
    }
    getSearchUrl(id) {
        return [`https://jable.tv/videos/${id}/`, `https://jable.tv/videos/${id}-c/`]
    }
}