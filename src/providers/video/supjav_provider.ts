import { Provider } from "../provider.ts"
import { Ok, Error as ResultError, ImportantError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"
import { SearchData } from "../../models/search_data.ts"

export class SupJavProvider extends Provider {
    override name: string = "SupJav"
    override enable: boolean = true
    searchUrl: string = "https://supjav.com/zh/?s="

    override async search(info: Info): Promise<Result<SearchData>> {
        const id = info.id
        if (!id) return new ResultError("ID为空")

        let url = this.searchUrl + id
        let result = await this.fetch(url)
        let responseData = (result instanceof Ok) ? (result.data as string) : ""
        if (!(result instanceof Ok)) {
            return result
        }

        responseData = result.data as string
        let document = this.parser.parseFromString(responseData, "text/html")

        let challengeError = document.querySelector("#challenge-error-text")
        if (challengeError) {
            return new ImportantError("请手动访问一次SupJav，通过验证。")
        }

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
