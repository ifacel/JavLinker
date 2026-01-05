import { Provider } from "../provider.js"
import { Ok, Error } from "../../tools/result.js"
import { Network } from "../../tools/network.js"

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
        let response
        try {
            response = (await Network.fetch(url)).text
        } catch (error) {
            return new Error("网络错误：" + error.message)
        }
        let document = this.parser.parseFromString(response, "text/html")
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
            console.info(this.name + "：没有找到" + id);
            return new Error("该平台找不到" + id)
        }
        return new Ok(href)
    }
}