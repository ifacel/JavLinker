import { Platform } from "../platform.ts";
import { playerProviders } from "../../providers.ts";
import { ImportantError, Result } from "../../models/result.ts";
import { Info } from "../../models/info.ts";
import { SearchData } from "../../models/search_data.ts";

export class JavBus extends Platform {
  override name: string = "JavBus";
  hosts: string[] = ["www.javbus.com", "www.seejav.me"];
  info: Info = new Info();
  infoElement: HTMLElement | null = document.querySelector(".info");

  override match(): boolean {
    return this.hosts.includes(document.location.host);
  }

  override getInfo(): boolean {
    if (!this.infoElement) return false;
    const p = this.infoElement.firstElementChild;
    if (
      p &&
      p.firstElementChild &&
      p.firstElementChild.textContent?.includes("識別碼")
    ) {
      this.info.id = p.lastElementChild?.textContent?.trim();
      return true;
    }
    return false;
  }

  override applyPlugin(): void {
    if (!this.infoElement) return;

    let header = document.createElement("p");
    header.innerHTML = "播放链接:";
    header.setAttribute("class", "header");
    this.infoElement.appendChild(header);

    let btnsContainer = document.createElement("p");
    this.infoElement.appendChild(btnsContainer);

    playerProviders.forEach(async (provider) => {
      let a = document.createElement("a");
      a.target = "_blank";
      a.rel = "noopener noreferrer";
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
