import { Provider } from "../provider.js"
import { Ok, Error,ImportantError } from "../../tools/result.js"
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
        let responseData = result.data
        let document = this.parser.parseFromString(responseData, "text/html")

        if (!(result instanceof Ok)) {
            let errorTextElement = document.querySelector("#challenge-error-text")
            if (!errorTextElement) {
                return new ImportantError("请手动访问一次SubJav，通过验证。")
            }else{
                return result
            }
        }


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