import { Provider } from "../provider.ts"
import { Ok, Error as ResultError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"
import { SearchData } from "../../models/search_data.ts"

export class JavHdPornProvider extends Provider {
    override name: string = "JavHdPorn"
    override enable: boolean = true

    getSearchUrl(id: string): string[] {
        return [`https://www4.javhdporn.net/search/${id}/`]
    }

    override async search(info: Info): Promise<Result<SearchData>> {
        const id = info.id
        if (!id) return new ResultError("ID为空")

        let urls = this.getSearchUrl(id)
        let url = urls[0]
        let result = await this.fetch(url)
        if (!(result instanceof Ok)) {
            return result
        }

        let responseData = result.data as string
        let document = this.parser.parseFromString(responseData, "text/html")
        let list = document.querySelectorAll("#content #main div article")
        const items = Array.from(list)
            .filter((t) => {
                const a = t.querySelector("a") as HTMLElement | null
                return a && a.innerText.toLowerCase().indexOf(id.toLowerCase()) != -1
            })
            .map((t) => {
                const a = t.querySelector("a") as HTMLAnchorElement | null
                if (!a) return null
                let name = (a?.querySelector(".entry-header span") as HTMLSpanElement | null)?.outerText.trim()
                return { name, url: a.href || "" }
            })
            .filter((t) => t !== null) as { name: string, url: string }[]

        if (!items.length) {
            return new ResultError("该平台找不到" + id)
        }
        return new Ok<SearchData>({ items })
    }
}
