import { Platform } from "../platform.js"
import { dbProviers } from "../../providers.js"
import { ImportantError } from "../../tools/result.js"
export class P123av extends Platform {
    hosts = ["123av.com"]
    videoInfo = {};
    getInfoError;

    match = function () {
        return this.hosts.includes(document.location.host)
    }

    getInfo() {
        // 使用正则表达式从URL中提取视频ID
        const url = window.location.href;
        const match = url.match(/\/v\/([^\/?#]+)/);
        if (match && match[1]) {
            this.videoInfo.id = match[1];
        } else {
            this.getInfoError = new Error("获取视频ID失败")
        }
    }

    applyPlugin() {
        let div = document.createElement('div');
        div.setAttribute("class", "panel-block")
        div.style.marginLeft = "7px"
        let value = document.createElement('span');
        value.setAttribute("class", "value")
        div.appendChild(value);
        let infoElement = document.querySelector('.col .mt-3 .actions');
        infoElement.appendChild(div);
        let btnsContainer = document.createElement('p');
        btnsContainer.style.marginBottom = "0px"
        value.appendChild(btnsContainer);

        dbProviers.forEach(async (provider, index) => {
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
            let result
            try {
                result = await provider.getUrl(this.videoInfo.id)
            } catch (error) {
                console.error(error);
                result = new ImportantError(error)
            }
            spinner.remove()
            super.handleApplyPluginResult(result, a, btn)
        })
    }
}