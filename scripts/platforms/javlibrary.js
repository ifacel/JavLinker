class JavLibrary {
    hosts = ["www.javlibrary.com","www.y78k.com"]
    infoElement = document.querySelector('#video_info');

    match = function () {
        return this.hosts.includes(document.location.host)
    }

    videoInfo = {};

    getInfo() {
        const id = this.infoElement.querySelector("#video_id").querySelector(".text").textContent.trim();
        if (id) {
            this.videoInfo.id = id
        }
    }

    addButtons() {
        let video_players = document.createElement('div')
        video_players.id = "video_players"
        let table = document.createElement('table')
        let tbody = document.createElement('tbody')
        let tr = document.createElement('tr')
        let header = document.createElement('td')
        header.className = "header"
        header.innerHTML = "播放链接:"
        let btnsContainer = document.createElement('td')
        btnsContainer.className = "text"
        tr.appendChild(header)
        tr.appendChild(btnsContainer)
        tbody.appendChild(tr)
        table.appendChild(tbody)
        video_players.appendChild(table)
        this.infoElement.appendChild(video_players)


        playerProvicers.forEach(async (provider, index) => {
            let a = document.createElement('a');
            a.target = "_blank"
            let btn = document.createElement('button');
            btn.innerText = provider.name;
            btn.style.cssText = index === 0 ? "margin:0 5px 0 0" : "margin:0 5px;"
            btn.disabled = true
            btn.className = "btnJav"
            a.appendChild(btn);
            btnsContainer.appendChild(a);
            let url = await provider.getUrl(this.videoInfo.id)
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


