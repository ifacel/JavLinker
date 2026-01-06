import { Platform } from "../platform.js"
import { playerProviders } from "../../providers.js"
import { ImportantError } from "../../tools/result.js";
export class JavBus extends Platform {
    hosts = ["www.javbus.com", "www.seejav.me"]
    infoElement = document.querySelector('.info');
    videoInfo = {};

    match = function () {
        return this.hosts.includes(document.location.host)
    }

    getInfo() {
        const p = this.infoElement.firstElementChild;
        if (p.firstElementChild.textContent.includes("識別碼")) {
            this.videoInfo.id = p.lastElementChild.textContent.trim();
        }
    }

    applyPlugin() {
        let header = document.createElement('p');
        header.innerHTML = "播放链接:"
        header.setAttribute("class", "header")
        this.infoElement.appendChild(header);
        let btnsContainer = document.createElement('p');
        this.infoElement.appendChild(btnsContainer);
        playerProviders.forEach(async (provider, index) => {
            let a = document.createElement('a');
            a.target = "_blank"
            a.rel = "noopener noreferrer"
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
                console.error(error);
                result = new ImportantError(error)
            }
            spinner.remove()
            super.handleApplyPluginResult(result, a, btn)
        })
    }
}