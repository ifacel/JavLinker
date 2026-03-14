import { Info } from "../../models/info";
import {
  ImportantError,
  Ok,
  Result,
  Error as ResultError,
} from "../../models/result.ts";
import { SearchData } from "../../models/search_data.ts";
import { SearchItem } from "../../models/search_item.ts";
import { Provider } from "../provider.ts";

export class JavdbVideoProvider extends Provider {
  override enable: boolean = true;
  override name: string = "JavDB";
  baseUrl: string = "https://javdb.com";
  searchUrl: string = this.baseUrl + "/search?q=";

  getSearchUrl(info: Info): string {
    if (!info.id) return "";
    return this.searchUrl + info.id;
  }

  override async search(info: Info): Promise<Result<SearchData>> {
    if (!info.id) return new ResultError("ID为空");
    const url = this.getSearchUrl(info);
    const result = await this.fetch(url);
    if (!(result instanceof Ok)) return result;
    const response = result.data as string;
    const doc = this.parser.parseFromString(response, "text/html");

    if (!doc.querySelector(".container")) {
      const body = doc.querySelector("body");
      if (body) {
        let scripts = body.querySelectorAll("script");
        scripts.forEach((el) => el.remove());
        return new ImportantError(body.innerText);
      }
      return new ImportantError("获取页面内容失败");
    }

    if (!doc.querySelector("base")) {
      const baseElement = doc.createElement("base");
      baseElement.href = this.baseUrl;
      doc.head.appendChild(baseElement);
    }

    const items = doc.querySelectorAll(".movie-list .item");
    let item: Element | undefined;
    for (const t of Array.from(items)) {
      const titleEl = t.querySelector(".video-title") as HTMLElement;
      if (titleEl) {
        const title = titleEl.innerText.toLowerCase();
        const searchId = info.id.toLowerCase();
        if (title.indexOf(searchId) !== -1 || searchId.indexOf(title) !== -1) {
          item = t;
          break;
        }
      }
    }

    if (!item) {
      return new ResultError("该平台找不到" + info.id);
    }

    const a = item.querySelector("a") as HTMLAnchorElement | null;
    if (a) {
      return new Ok<SearchData>({
        items: [{ name: a.innerText.trim(), url: a.href }],
      });
    } else {
      return new ResultError("获取的连接为空");
    }
  }
}
