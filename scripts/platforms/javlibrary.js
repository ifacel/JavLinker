class JavLibrary extends Platform {
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
        sourceProviders.forEach(async (provider, index) => {
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
            super.handleResult(result, a, btn, spinner)

        })
    }
}


