import { Platform } from "../platform.ts";
import { playerProviders } from "../../providers.ts";
import { ImportantError, Result } from "../../models/result.ts";
import { Info } from "../../models/info.ts";
import { SearchData } from "../../models/search_data.ts";

export class JavDb extends Platform {
  override name: string = "JavDB";
  hosts: string[] = ["javdb.com"];
  info: Info = new Info();
  infoElement: HTMLElement | null = document.querySelector(".movie-panel-info");

  override match(): boolean {
    return this.hosts.includes(document.location.host);
  }

  override getInfo(): boolean {
    if (!this.infoElement) return false;
    const title = this.infoElement.firstElementChild?.firstElementChild;
    if (title && title.textContent?.includes("番號:")) {
      const value = this.infoElement.querySelector(".value");
      if (value) {
        this.info.id = value.textContent?.trim();
        return true;
      }
    }
    return false;
  }

  override applyPlugin(): void {
    if (!this.infoElement) return;

    let div = document.createElement("div");
    div.setAttribute("class", "panel-block");
    let title = document.createElement("strong");
    title.innerText = "播放链接:";
    let value = document.createElement("span");
    value.setAttribute("class", "value");
    div.appendChild(title);
    div.appendChild(value);
    this.infoElement.appendChild(div);

    let btnsContainer = document.createElement("p");
    value.appendChild(btnsContainer);

    playerProviders.forEach(async (provider) => {
      let a = document.createElement("a");
      a.target = "_blank";
      let btn = document.createElement("button");
      btn.innerText = provider.name;
      btn.disabled = true;
      btn.className = "btnJav";

      let spinner = document.createElement("div");
      spinner.className = "spinner";
      spinner.style.cssText = "margin:0 0 0 5px";
      btn.append(spinner);
      a.appendChild(btn);
      btnsContainer.appendChild(a);

      let result: Result<SearchData>;
      try {
        result = await provider.search(this.info);
      } catch (error: any) {
        console.error(error);
        result = new ImportantError(error.message || String(error));
      }
      spinner.remove();
      super.handleApplyPluginResult(result, a, btn);
    });
  }
}
