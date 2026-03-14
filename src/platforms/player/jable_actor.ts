import { Platform } from "../platform.ts";
import { dbProviers } from "../../providers.ts";
import { ImportantError, Result } from "../../models/result.ts";
import { Info } from "../../models/info.ts";
import { PlatformType } from "../../models/platform_type.ts";

export class JableActor extends Platform {
  override name: string = "Jable Actor";
  hosts: string[] = ["jable.tv"];
  info: Info = {
    type: PlatformType.Actor,
  };

  override match(): boolean {
    return (
      this.hosts.includes(document.location.host) &&
      document.location.pathname.includes("/models/")
    );
  }

  override getInfo(): boolean {    
    const nameElement = document.querySelector(
      ".title-with-avatar .h3-md",
    ) as HTMLElement | null;
    if (nameElement) {
      this.info.name = nameElement.innerText.trim();
      return true;
    }
    return false;
  }

  override applyPlugin(): void {
    let outerDiv = document.createElement("div");

    let div = document.createElement("div");
    div.setAttribute("class", "panel-block");    

    let value = document.createElement("span");
    value.setAttribute("class", "value");
    div.appendChild(value);

    const infoElement = document.querySelector(
      ".title-with-avatar .title-box",
    );
    if (!infoElement) return;
    infoElement.appendChild(div);

    let btnsContainer = document.createElement("p");
    value.appendChild(btnsContainer);

    dbProviers.forEach(async (provider) => {
      console.log(provider);
      
      let a = document.createElement("a");
      a.target = "_blank";
      let btn = document.createElement("button");
      btn.innerText = provider.name;
      btn.disabled = true;
      btn.className = "btnJav";
      btn.style.marginBottom = "0px";

      let spinner = document.createElement("div");
      spinner.className = "spinner";
      spinner.style.cssText = "margin:0 0 0 5px";
      btn.append(spinner);
      a.appendChild(btn);
      btnsContainer.appendChild(a);

      let result: Result;
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
