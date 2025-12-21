const parser = new DOMParser()

class ProviderPlatform {
    name
    enable

    /**
     * 
     * @param {string} id 
     * @returns {Promise<Result>}
     */
    async getUrl(id) {
        let urls = this.getSearchUrl(id)
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
}

