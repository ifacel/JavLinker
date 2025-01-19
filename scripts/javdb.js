class JavDb{

    hosts = ["javdb.com"]
    infoElement = document.querySelector('.movie-panel-info');
    videoInfo = {};

    match = function () {
        console.info("hello match")
        return this.hosts.includes(document.location.host)
    }

    getInfo() {
        const title = this.infoElement.firstElementChild.firstElementChild;
        if (title.textContent.includes("番號:")) {
            this.videoInfo.id = this.infoElement.querySelector(".value").textContent.trim();
        }
    }

    addButtons() {
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
            let result = await platform.getUrl(this.videoInfo.id)
            if (result instanceof Ok) {
                btn.disabled = false
                a.href = result.data;
            } else if (result instanceof Error){
                btn.style.color = "red"
                btn.title = result.message
            }else{
                console.log("what type?" + result);
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
