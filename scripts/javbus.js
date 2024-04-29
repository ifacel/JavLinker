class JavBus {
    constructor() { }
    hosts = ["www.javbus.com", "www.seejav.me"]

    infoElement = document.querySelector('.info');

    match = function () {
        return this.hosts.includes(document.location.host)
    }

    videoInfo = {};

    getInfo() {
        const p = this.infoElement.firstElementChild;
        if (p.firstElementChild.textContent.includes("識別碼")) {
            this.videoInfo.id = p.lastElementChild.textContent.trim();
        }
    }

    addButtons() {
        let header = document.createElement('p');
        header.innerHTML = "播放链接:"
        header.setAttribute("class", "header")
        this.infoElement.appendChild(header);
        let btnsContainer = document.createElement('p');

        this.infoElement.appendChild(btnsContainer);
        let platforms = playerPlatforms.filter(p => p.enable)
        platforms.forEach(async (platform, index) => {
            let a = document.createElement('a');
            a.target = "_blank"
            let btn = document.createElement('button');
            btn.innerText = platform.name;
            btn.style.cssText = index === 0 ? "margin:0 5px 0 0" : "margin:0 5px;"
            btn.disabled = true
            btn.className = "btnJav"
            a.appendChild(btn);
            btnsContainer.appendChild(a);
            let url = await platform.getUrl(this.videoInfo.id)
            if (url) {
                btn.disabled = false
                a.href = url;
            } else {
                btn.style.color = "red"
            }
        })
    }
    execute() {
        if (this.infoElement) {
            this.getInfo();
            if (!this.videoInfo.id) {
                return
            }
            this.addButtons();
        }
    }
}
