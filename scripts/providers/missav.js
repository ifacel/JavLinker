missavUUID = null


class Missav extends ProviderPlatform {
    name = "MissAV"
    enable = true
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
            let result = await MissavApp.recombeeClient.send(new MissavApp.SearchItems(missavUUID, id, 24, this.reuquestData))
            let item = result.recomms.find((item) => {
                return item.id.toUpperCase().indexOf(id.toUpperCase()) != -1
            })
            let url = this.baseUrl
            if (item.values.dm == 0) {
                url += `/cn/${item.id}`
            } else {
                url += `/dm${item.values.dm}/cn/${item.id}`
            }
            return new Ok(url)
        } catch (error) {
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