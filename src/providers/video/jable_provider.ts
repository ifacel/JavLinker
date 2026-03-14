import { Provider } from "../provider.ts"
import { Ok, Error as ResultError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"
import { SearchData } from "../../models/search_data.ts"

export class JableProvider extends Provider {
    override name: string = "Jable"
    override enable: boolean = true
    searchUrl: string = "https://jable.tv/search/"

    override async search(info: Info): Promise<Result<SearchData>> {
        const id = info.id
        if (!id) return new ResultError("ID为空")
        
        let url = this.searchUrl + id + "/"
        let result = await this.fetch(url)
        if (!(result instanceof Ok)) {
            return result
        }
        
        let responseData = result.data as string
        let document = this.parser.parseFromString(responseData, "text/html")
        let itemsEle = document.querySelectorAll(".video-img-box")
        const items = Array.from(itemsEle).filter((t) =>{
            const a = t.querySelector(".title a") as HTMLElement | null
            return a && a.innerText.toLowerCase().indexOf(id.toLowerCase()) != -1
        })
        .map((t) => {
            const a = t.querySelector(".title a") as HTMLAnchorElement | null
            if (!a) return null
            return { name: a?.innerText.trim() || id, url: a.href || "" }
        })
        .filter((t) => t !== null) as { name: string, url: string }[]

        if (!items.length) {
            return new ResultError("该平台找不到" + id)
        }
        return new Ok<SearchData>({ items })
    }

    getSearchUrl(id: string): string[] {
        return [`https://jable.tv/videos/${id}/`, `https://jable.tv/videos/${id}-c/`]
    }
}
