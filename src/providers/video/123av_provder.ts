import { Provider } from "../provider.ts";
import { Ok, Error as ResultError, Result } from "../../models/result.ts";
import { Info } from "../../models/info.ts";
import { SearchData } from "../../models/search_data.ts";
import { SearchItem } from "../../models/search_item.ts";

export class P123avProvider extends Provider {
  override name: string = "123av";
  override enable: boolean = true;

  getSearchUrl(id: string): string[] {
    return [`https://123av.com/zh/search?keyword=${id}`];
  }

  override async search(info: Info): Promise<Result<SearchData>> {
    const id = info.id;
    if (!id) return new ResultError("ID为空");

    let urls = this.getSearchUrl(id);
    let url = urls[0];
    let result = await this.fetch(url);
    if (!(result instanceof Ok)) {
      return result;
    }

    let responseData = result.data as string;
    let document = this.parser.parseFromString(responseData, "text/html");
    let thumbsEle = document.querySelectorAll(".thumb");

    //filter thumbs t.querySelector("a") is not null
    const thumbs = Array.from(thumbsEle)
      .filter((t) => {
        const a = t.querySelector("a");
        return a && a.title.toLowerCase().indexOf(id.toLowerCase()) != -1;
      })
      .map((t) => {
        const a = t.querySelector("a");
        if (!a) return null;
        const item: SearchItem = { name: a.title || id, url: a.href || "" };

        return item;
      })
      .filter((t) => t != null);

    if (!thumbs.length) {
      return new ResultError("该平台找不到" + id);
    }
    thumbs;
    if (thumbs.length == 0) return new ResultError("获取的连接为空");
    return new Ok<SearchData>({ items: thumbs });
  }
}
