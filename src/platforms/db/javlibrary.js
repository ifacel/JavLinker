import { Platform } from "../platform.js"
import { playerProviders } from "../../providers.js"
import { UnknownError } from "../../tools/result.js";
export class JavLibrary extends Platform {
    hosts = ["www.javlibrary.com", "www.y78k.com"]
    infoElement = document.querySelector('#video_info');
    videoInfo = {};

    match = function () {
        return this.hosts.includes(document.location.host)
    }

    getInfo() {
        const id = this.infoElement.querySelector("#video_id").querySelector(".text").textContent.trim();
        if (id) {
            this.videoInfo.id = id
        }
    }

    applyPlugin() {
        let div = document.createElement('div');
        div.setAttribute("class", "panel-block")
        div.style.display = "inline-flex"

        let value = document.createElement('span');
        value.setAttribute("class", "value")
        div.appendChild(value);
        let infoElement = document.querySelector('.col .mt-3');
        infoElement.appendChild(div);
        let btnsContainer = document.createElement('p');

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
                result = new UnknownError(error)
            }
            spinner.remove()
            super.handleApplyPluginResult(result, a, btn)
        })
    }
}


