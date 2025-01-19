const parser = new DOMParser()

class PlayerPlatform {
    name
    enable
    formatUrl(id) {
        throw new Error("formatUrl must be implemented")
    }
    /**
     * 
     * @param {string} id 
     * @returns {Promise<Result>}
     */
    async getUrl(id) {
        let urls = this.formatUrl(id)
        for (const url of urls) {
            let result
            try {
               result =  await this.checkValidStatus(id, url)
            } catch (error) {
                return new Error("网络错误：" + error.message)
            }
            if (result) {
                return new Ok(url)
            }
        }
        return new Error("该平台找不到"+id)
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
    searchUrl = "https://jable.tv/search/"
    /**
   * 
   * @param {string} id 
   * @returns {Promise<Result>}
   */
    async getUrl(id) {
        let url = this.searchUrl + id + "/"
        let response
        try {
            response = (await Network.fetch(url)).text
        } catch (error) {
            return new Error("网络错误：" + error.message)
        }
        let document = parser.parseFromString(response, "text/html")
        let items = document.querySelectorAll(".video-img-box")
        let item
        for (let t of items) {
            if (t.querySelector(".title").querySelector("a").innerText.indexOf(id) != -1) {
                item = t
                break
            }
        }
        if (!item) {
            return new Error("该平台找不到"+id)
        }
        let href = item.querySelector(".title").querySelector("a").href
        if (href) {
            return new Ok(href)
        }else{
            return new Error("获取的连接为空")
        }

    }
    formatUrl(id) {
        return [`https://jable.tv/videos/${id}/`, `https://jable.tv/videos/${id}-c/`]
    }
}

class P123av extends PlayerPlatform {
    name = "123av"
    enable = true
    formatUrl(id) {
        return [`https://123av.com/zh/search?keyword=${id}`]
    }
    /**
   * 
   * @param {string} id 
   * @returns {Promise<Result>}
   */
    async getUrl(id) {
        let urls = this.formatUrl(id)
        let url = urls[0]
        let response
        try {
            response = (await Network.fetch(url)).text
        } catch (error) {
            return new Error("网络错误：" + error.message)
        }
        let document = parser.parseFromString(response, "text/html")
        let thumbs = document.querySelectorAll(".thumb")
        let thumb
        for (let t of thumbs) {
            if (t.querySelector('a').title.indexOf(id) != -1) {
                thumb = t
                break
            }
        }
        if (!thumb) {
            return new Error("该平台找不到"+id)
        }
        let href = thumb.querySelector('a').href
        let page
        try {
            page = (await Network.fetch(url)).text
        } catch (error) {
            return new Error("网络错误：" + error.message)
        }
        //可能需要二次跳转
        if (page.indexOf("Click here to continue") == -1) {
            return new Ok(href)
        } else {
            let detailDoc = this.parser.parseFromString(page, "text/html")
            let href = detailDoc.querySelector('.btn-primary').href
            if (href) {
                return new Ok(href)
            }else{
                return new Error("获取的连接为空")
            }
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



const playerPlatforms = [
    new Jable(),
    new P123av(),
    new Missav(),
]