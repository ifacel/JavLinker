import { Provider } from "../provider.ts"
import { Ok, Error as ResultError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"
import { SearchData } from "../../models/search_data.ts"

export class NjavProvider extends Provider {
    override name: string = "njav"
    override enable: boolean = true

    getSearchUrl(id: string): string[] {
        return [`https://www.njav.com/zh/search?q=${id}`]
    }

    override async search(info: Info): Promise<Result<SearchData>> {
        const id = info.id?.toLowerCase()
        if (!id) return new ResultError("ID为空")
        
        let urls = this.getSearchUrl(id)
        let url = urls[0]
        let result = await this.fetch(url)
        if (!(result instanceof Ok)) {
            return result
        }
        
        let responseData = result.data as string
        let document = this.parser.parseFromString(responseData, "text/html")
        let details = document.querySelectorAll(".detail")
        console.log(details);

        const items = Array.from(details).filter((t) =>{
            const a = t.querySelector("a") as HTMLAnchorElement | null
            console.log(a);
            
            return a && a.href.toLowerCase().indexOf(id.toLowerCase()) != -1
        })
        .map((t) => {
            const a = t.querySelector("a") as HTMLAnchorElement | null
            console.log(a);
            
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
