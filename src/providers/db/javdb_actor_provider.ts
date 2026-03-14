import { JavdbProvider } from "./javdb_provider.ts"
import { Ok, Error as ResultError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"
import { Provider } from "../provider.ts"
import { SearchData } from "../../models/search_data.ts"

export class JavdbActorProvider extends Provider {
    enable: boolean = true
    override name: string = "JavDB Actor"
    baseUrl: string = "https://javdb.com"
    searchUrl: string = this.baseUrl + "/search?f=actor&q="

    getSearchUrl(info: Info): string {
        if (!info.name) return ""
        return this.searchUrl + info.name + "&f=actor"
    }

    override async search(info: Info): Promise<Result<SearchData>> {
        if (!info.name) return new ResultError("姓名为空")
        const url = this.getSearchUrl(info)
        const result = await this.fetch(url, info)
        if (!(result instanceof Ok)) return result
        const response = result.data as string;
        const doc = this.parser.parseFromString(response, "text/html");
        const base = document.createElement('base')
        base.href = this.baseUrl
        doc.head.appendChild(base)
        const itemsEle = doc.querySelectorAll("#actors .actor-box")

        const items = Array.from(itemsEle).filter((t) => {
            const a = t.querySelector("a") as HTMLElement | null
            return a && a.title.toLowerCase().indexOf(info.name!.toLowerCase()) != -1
        })
            .map((t) => {
                const a = t.querySelector("a") as HTMLAnchorElement | null
                if (!a) return null
                return { name: a?.innerText.trim() || info.name, url: a.href || "" }
            })
            .filter((t) => t !== null) as { name: string, url: string }[]
        console.log(items);

        if (!items.length) {
            return new ResultError("该平台找不到" + info.name)
        }
        return new Ok<SearchData>({ items })
    }
}
