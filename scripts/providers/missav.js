missavUUID = null


class Missav extends ProviderPlatform {
    name = "MissAV"
    enable = false
    inited = false
    baseUrl = "https://missav.ws"
    reuquestData = {
        scenario: 'search',
        returnProperties: true,
        includedProperties: [
            `title_cn`,
            'duration',
            'has_chinese_subtitle',
            'has_english_subtitle',
            'is_uncensored_leak',
            'dm',
        ],
    }
    async getUrl(id) {
        if (!this.inited) {
            await this.initCookie()
        }
        if (!missavUUID) {
            return new Error(`请先进入一次${this.name}`)
        }
        try {
            let result
            try {
                result = await MissavApp.recombeeClient.send(new MissavApp.SearchItems(missavUUID, id, 24, this.reuquestData))
            } catch (error) {
                console.info("missav：获取视频失败", error)
            }
            let item = result.recomms.find((item) => {
                return item.id.toUpperCase().indexOf(id.toUpperCase()) != -1 && item.values.dm != null
            })
            if (!item) {
                console.info(this.name + "：没有找到" + id);
                return new Error(`该平台找不到${id}`)
            }
            let url = this.baseUrl
            if (item.values.dm == 0) {
                url += `/cn/${item.id}`
            } else {
                url += `/dm${item.values.dm}/cn/${item.id}`
            }
            return new Ok(url)
        } catch (error) {
            console.info("missav：获取视频失败", error)
            return new Error(error.message)
        }
    }

    async initCookie() {
        let result = await Cookie.get("https://missav.ws", "user_uuid")
        if (result instanceof Ok) {
            missavUUID = result.data
        }
        this.inited = true
    }
}