import { Provider } from "../provider.ts"
import { Ok, Error as ResultError, ImportantError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"
import { SearchData } from "../../models/search_data.ts"
import { NetworkError } from "../../models/network_result.ts"

export class SupJavProvider extends Provider {
    override name: string = "SupJav"
    override enable: boolean = true
    searchUrl: string = "https://supjav.com/zh/?s="

    override async search(info: Info): Promise<Result<SearchData>> {
        const id = info.id
        if (!id) return new ResultError("ID为空")

        let url = this.searchUrl + id
        let result = await this.fetch(url)
        if (result instanceof NetworkError && result.code == 403) {
            let document = this.parser.parseFromString(result.data, "text/html")
            let challenge = document.querySelector("#challenge-error-text") as HTMLElement
            if (challenge?.innerText.trim() == "Enable JavaScript and cookies to continue") {
                result.message = `请访问一次${this.name}，通过验证。`
                return result
            }
        }

        let responseData = (result instanceof Ok) ? (result.data as string) : ""
        if (!(result instanceof Ok)) {
            return result
        }
        responseData = result.data as string
        let document = this.parser.parseFromString(responseData, "text/html")

        let itemsEle = document.querySelectorAll(".posts .post")
        const items = Array.from(itemsEle).filter((t) => {
            const a = t.querySelector(".con h3 a") as HTMLElement | null
            return a && a.innerText.toLowerCase().indexOf(id.toLowerCase()) != -1
        })
            .map((t) => {
                const a = t.querySelector(".con h3 a") as HTMLAnchorElement | null
                if (!a) return null
                return { name: a?.innerText.trim() || id, url: a.href || "" }
            })
            .filter((t) => t !== null) as { name: string, url: string }[]

        if (!items.length) {
            return new ResultError("该平台找不到" + id)
        }
        return new Ok<SearchData>({ items })
    }
}
