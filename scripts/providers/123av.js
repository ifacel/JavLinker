class P123av extends ProviderPlatform {
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