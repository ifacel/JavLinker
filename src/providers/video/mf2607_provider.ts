import { Provider } from "../provider.ts"
import { Ok, Error as ResultError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"
import { SearchData } from "../../models/search_data.ts"
import { SearchItem } from "../../models/search_item.ts"

interface Mf2607Movie {
    movie_number?: string
    title?: string
    identification?: string
}

interface Mf2607Response {
    code?: number
    data?: {
        list?: Mf2607Movie[]
    }
}

export class Mf2607Provider extends Provider {
    override name: string = "mf2607"
    override enable: boolean = true
    searchUrl: string = "https://la4bbjzm.mf2607.com/api/v1/movie/list?&page=1&page_size=20&search="

    override async search(info: Info): Promise<Result<SearchData>> {
        const id = info.id
        if (!id) return new ResultError("ID为空")

        let url = this.searchUrl + id +
            "&tag=&free=&actor=&issuer=&is_vip=&subtitle=&recommend=&top=&type=&create_date=&create_month="
        let result = await this.fetch(url)
        if (!(result instanceof Ok)) {
            return result
        }

        let data: Mf2607Response
        try {
            data = JSON.parse(result.data as string)
        } catch (e) {
            return new ResultError("解析响应失败")
        }

        const list = data?.data?.list || []
        const items: SearchItem[] = list
            .filter((m) => m.movie_number && m.movie_number.toLowerCase().indexOf(id.toLowerCase()) != -1)
            .map((m) => ({
                name: m.title?.trim() || m.movie_number || id,
                url: m.identification ? `https://mf2607.com/movie/${m.identification}` : ""
            }))
            .filter((t) => t.url)

        if (!items.length) {
            return new ResultError("该平台找不到" + id)
        }
        return new Ok<SearchData>({ items })
    }
}