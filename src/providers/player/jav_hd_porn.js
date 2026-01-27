import { Provider } from "../provider.js"
import { Ok, Error, ImportantError } from "../../tools/result.js"
export class JavHdPornProvider extends Provider {
    name = "JavHdPorn"
    enable = true
    getSearchUrl(id) {
        return [`https://www4.javhdporn.net/search/${id}/`]
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
        let list = document.querySelectorAll("#content #main div article")
        let item
        for (let t of list) {
            if (t.querySelector('a').title.toLowerCase().indexOf(id.toLowerCase()) != -1) {
                item = t
                break
            }
        }
        if (!item) {
            return new Error("该平台找不到" + id)
        }
        let href = item.querySelector('a').href
        if (href) {
            return new Ok(href)
        } else {
            return new Error("获取的连接为空")
        }
    }
}