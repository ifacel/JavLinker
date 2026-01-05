import { Platform } from "../platform.js"
import { playerProviders } from "../../providers.js"
import { UnknownError } from "../../tools/result.js"

export class JavDb extends Platform {
    hosts = ["javdb.com"]
    infoElement = document.querySelector('.movie-panel-info');
    videoInfo = {};

    match = function () {
        return this.hosts.includes(document.location.host)
    }

    getInfo() {
        const title = this.infoElement.firstElementChild.firstElementChild;
        if (title.textContent.includes("番號:")) {
            this.videoInfo.id = this.infoElement.querySelector(".value").textContent.trim();
        }
    }

    applyPlugin() {
        let div = document.createElement('div');
        div.setAttribute("class", "panel-block")
        let title = document.createElement('strong');
        title.innerText = "播放链接:";
        let value = document.createElement('span');
        value.setAttribute("class", "value")
        div.appendChild(title);
        div.appendChild(value);
        this.infoElement.appendChild(div);
        let btnsContainer = document.createElement('p');
        value.appendChild(btnsContainer);
        playerProviders.forEach(async (provider, index) => {
            let a = document.createElement('a');
            a.target = "_blank"
            let btn = document.createElement('button');
            btn.innerText = provider.name;
            btn.disabled = true
            btn.className = "btnJav"
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
                result = new UnknownError(error)
            }
            spinner.remove()
            super.handleApplyPluginResult(result, a, btn)
        })
    }
}
