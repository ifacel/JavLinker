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

class Njav extends PlayerPlatform {
    name = "Njav"
    enable = true
    formatUrl(id) {
        return [`https://njav.tv/zh/v/${id}`]
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
    new Njav(),
    new Missav(),
]