import { Provider } from "../provider.js"
import { Ok, Error, ImportantError } from "../../tools/result.js"
export class P123avProvider extends Provider {
    name = "123av"
    enable = true
    getSearchUrl(id) {
        return [`https://123av.com/zh/search?keyword=${id}`]
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
        let thumbs = document.querySelectorAll(".thumb")
        let thumb
        for (let t of thumbs) {
            if (t.querySelector('a').title.indexOf(id) != -1) {
                thumb = t
                break
            }
        }
        if (!thumb) {
            return new Error("该平台找不到" + id)
        }
        let href = thumb.querySelector('a').href

        let page = await this.fetch(url)
        if (!(page instanceof Ok)) {
            return page
        }
        page = page.data
        //可能需要二次跳转
        if (page.indexOf("Click here to continue") == -1) {
            return new Ok(href)
        } else {
            let detailDoc = this.parser.parseFromString(page, "text/html")
            let href = detailDoc.querySelector('.btn-primary').href
            if (href) {
                return new Ok(href)
            } else {
                return new Error("获取的连接为空")
            }
        }
    }
}