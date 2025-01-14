class PlayerPlatform {
    name
    enable
    formatUrl(id) {
        throw new Error("formatUrl must be implemented")
    }
    async getUrl(id) {
        let urls = this.formatUrl(id)
        for (const url of urls) {
            let result = await this.checkValidStatus(id, url)
            if (result) {
                return url
            }
        }
        return false
    }

    async checkValidStatus(id, url) {
        let response = await Network.fetch(url)
        return this.statusValid(response)
    }

    /**
     * 
     * @returns {boolean}
     */
    statusValid(result) {
        return result.status == 200
    }
}

class Jable extends PlayerPlatform {
    name = "Jable"
    enable = true
    formatUrl(id) {
        return [`https://jable.tv/videos/${id}/`, `https://jable.tv/videos/${id}-c/`]
    }
}

class P123av extends PlayerPlatform {
    name = "123av"
    enable = true
    parser = new DOMParser()
    formatUrl(id) {
        return [`https://123av.com/zh/search?keyword=${id}`]
    }
    async getUrl(id) {
        let urls = this.formatUrl(id)
        let url = urls[0]
        let response = (await Network.fetch(url)).text
        let document = this.parser.parseFromString(response, "text/html")
        let thumbs = document.querySelectorAll(".thumb")
        let thumb
        for (let t of thumbs) {
            if (t.querySelector('a').title.indexOf(id)!=-1) {
                thumb = t
                break
            }
        }
        if (!thumb) {
            return null
        }
        let href = thumb.querySelector('a').href
        let page = (await Network.fetch(href)).text
        if (page.indexOf("Click here to continue")==-1) {
            return href
        }else{
            let detailDoc = this.parser.parseFromString(page, "text/html")
            return detailDoc.querySelector('.btn-primary').href
        }
    }
}

class Missav extends PlayerPlatform {
    name = "Missav"
    enable = true
    formatUrl(id) {
        return [`https://missav.com/${id}`]
    }
}



playerPlatforms = [
    new Jable(),
    new P123av(),
    new Missav(),
]