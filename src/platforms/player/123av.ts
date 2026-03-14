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
        let div = document.createElement('div');
        div.setAttribute("class", "panel-block")
        div.style.marginLeft = "7px"
        
        let value = document.createElement('span');
        value.setAttribute("class", "value")
        div.appendChild(value);

        const infoElement = document.querySelector('.col .mt-3 .actions');
        if (!infoElement) return;
        infoElement.appendChild(div);

        let btnsContainer = document.createElement('p');
        btnsContainer.style.marginBottom = "0px"
        value.appendChild(btnsContainer);

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
                result = new ImportantError(error.message || String(error))
            }
            spinner.remove()
            super.handleApplyPluginResult(result, a, btn)
        })
    }
}
