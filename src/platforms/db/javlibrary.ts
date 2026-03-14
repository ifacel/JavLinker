import { Platform } from "../platform.ts";
import { playerProviders } from "../../providers.ts";
import { ImportantError, Result } from "../../models/result.ts";
import { Info } from "../../models/info.ts";
import { SearchData } from "../../models/search_data.ts";

export class JavLibrary extends Platform {
  override name: string = "JavLibrary";
  hosts: string[] = ["www.javlibrary.com", "www.y78k.com"];
  info: Info = new Info();
  infoElement: HTMLElement | null = document.querySelector("#video_info");

  override match(): boolean {
    return this.hosts.includes(document.location.host);
  }

  override getInfo(): boolean {
    if (!this.infoElement) return false;
    const videoIdEl = this.infoElement.querySelector("#video_id");
    if (videoIdEl) {
      const textEl = videoIdEl.querySelector(".text");
      if (textEl) {
        this.info.id = textEl.textContent?.trim();
        return true;
      }
    }
    return false;
  }

  override applyPlugin(): void {
    if (!this.infoElement) return;

    let video_players = document.createElement("div");
    video_players.id = "video_players";
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let header = document.createElement("td");
    header.className = "header";
    header.innerHTML = "播放链接:";
    let btnsContainer = document.createElement("td");
    btnsContainer.className = "text";
    tr.appendChild(header);
    tr.appendChild(btnsContainer);
    tbody.appendChild(tr);
    table.appendChild(tbody);
    video_players.appendChild(table);
    this.infoElement.appendChild(video_players);

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
