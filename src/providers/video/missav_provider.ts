import { Provider } from "../provider.ts";
import { Ok, Error as ResultError, Result, ActionError, ActionType } from "../../models/result.ts";
import { Info } from "../../models/info.ts";
import { SearchData } from "../../models/search_data.ts";
import { SearchItem } from "../../models/search_item.ts";
import { NetworkError } from "../../models/network_result.ts"

export class MissavProvider extends Provider {
  override name: string = "Missav";
  override enable: boolean = true;
  baseUrl: string = "https://missav.ws/";

  getSearchUrl(id: string): string[] {
    return [`${this.baseUrl}cn/search/${id}`];
  }

  override async search(info: Info): Promise<Result<SearchData>> {
    const id = info.id;
    if (!id) return new ResultError("ID为空");

    let urls = this.getSearchUrl(id);
    let url = urls[0];
    let result = await this.fetch(url);

    if (result instanceof NetworkError && result.code == 403) {
      let document = this.parser.parseFromString(result.data, "text/html")
      let challenge = document.querySelector("#challenge-error-text") as HTMLElement
      if (challenge?.innerText.trim() == "Enable JavaScript and cookies to continue") {
        result.message = `请访问一次${this.name}，通过验证。`
        return new ActionError(result.message, ActionType.Link, "点击访问", url)
      }
    }

    if (!(result instanceof Ok)) {
      return result;
    }

    let responseData = result.data as string;
    let document = this.parser.parseFromString(responseData, "text/html");

    //fix base href
    const base = document.createElement('base')
    base.href = this.baseUrl
    document.head.appendChild(base)

    let thumbsEle = document.querySelectorAll(".thumbnail.group");
    const thumbs = Array.from(thumbsEle)
      .filter((t) => {
        const a = t.querySelector(".text-sm") as HTMLAnchorElement;
        return a && a.innerText?.toLowerCase().indexOf(id.toLowerCase()) != -1;
      })
      .map((t) => {
        const a = t.querySelector(".text-sm") as HTMLAnchorElement;
        if (!a) return null;
        const item: SearchItem = { name: a.innerText?.trim() || id, url: a.href || "" };
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
