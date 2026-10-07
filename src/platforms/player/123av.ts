import { Platform } from "../platform.ts"
import { dbProviers } from "../../providers.ts"
import { ImportantError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"

export class P123av extends Platform {
    override name: string = "123av Video"
    hosts: string[] = ["123av.com"]
    info: Info = new Info()

    override match(): boolean {
        return this.hosts.includes(document.location.host)
    }

    override getInfo(): boolean {
        // 使用正则表达式从URL中提取视频ID
        const url = window.location.href;        
        const match = url.match(/\/v\/([^\/?#]+)/);        
        if (match && match[1]) {
            this.info.id = match[1];
            return true
        }else{
            return false
        }
    }

    override applyPlugin(): void {
        let raw = document.createElement('div');
        raw.setAttribute("class", "watch__info-row")        
        let dt = document.createElement('dt');
        dt.innerText = "DB";

        let dd = document.createElement('dd');
        raw.appendChild(dt);
        raw.appendChild(dd);

        const infoElement = document.querySelector('.watch__info');
        if (!infoElement) return;
        infoElement.appendChild(raw);

        let btnsContainer = document.createElement('p');
        btnsContainer.style.margin = "0px"
        dd.appendChild(btnsContainer);

        dbProviers.forEach(async (provider) => {
            let a = document.createElement('a');
            a.target = "_blank"
            let btn = document.createElement('button');
            btn.innerText = provider.name;
            btn.disabled = true
            btn.className = "btnJav"
            btn.style.marginBottom = "0px"

            let spinner = document.createElement('div')
            spinner.className = "spinner"
            spinner.style.cssText = "margin:0 0 0 5px"
            btn.append(spinner)
            a.appendChild(btn);
            btnsContainer.appendChild(a);

            let result: Result
            try {
                result = await provider.search(this.info)
            } catch (error: any) {
                console.error(error);
                result = error
            }
            spinner.remove()
            super.handleApplyPluginResult(result, a, btn)
        })
    }
}
