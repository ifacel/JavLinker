class Supjav extends ProviderPlatform {
    name = "supjav"
    enable = true
    getSearchUrl(id) {
        console.log(`https://supjav.com/?s=${id}`);
        return [`https://supjav.com/?s=${id}`]
    }
    /**
   * 
   * @param {string} id 
   * @returns {Promise<Result>}
   */
    async getUrl(id) {
        let urls = this.getSearchUrl(id)
        let url = urls[0]
        let response
        try {
            response = (await Network.fetch(url, {
                headers: {
                    ":authority": "supjav.com",
                    ":method": "GET",
                    ":path": "/?s=MIKR-026",
                    ":scheme": "https",
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-encoding": "gzip, deflate, br, zstd",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "max-age=0",
                    "cookie": "_ga=GA1.1.1689403218.1753724733; _ga_ZQCDRMKQTF=GS2.1.s1753724732$o1$g0$t1753724732$j60$l0$h0; cf_clearance=Ddhcllh5Utt3ynynceyfZA.h67sbki6MXZ25mgRYJJQ-1753724733-1.2.1.1-I.Mne3ooW84mo2Vp96wOZRuYhcQoJwjFmwtjM7fo4w8lkYsrEpno96VIVO4PrUNLa1ZnaMtginmZitmM9w.IXH.qmILF3EHoEIHogCoTdmKdmEi.4yP6knbe1KtjIwUWLiNC8FD5IumOwzkEL4nXkyWOwNC_NPIVNrF.L38nrnVHe8oFUlIbUWZbzP9nMPTwb32PhIJ6E6Upz24FAZypGV6aVpkw_sjfrBXtiFhAINanIgxxPf.dscyfNcROBwtU; asgfp2=3ab37845e2c4ebbe869e620fc27f61f4",
                    "dnt": "1",
                    "if-modified-since": "Mon, 28 Jul 2025 16:53:04 GMT",
                    "priority": "u=0, i",
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-arch": "\"x86\"",
                    "sec-ch-ua-bitness": "\"64\"",
                    "sec-ch-ua-full-version": "\"138.0.7204.169\"",
                    "sec-ch-ua-full-version-list": "\"Not)A;Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"138.0.7204.169\", \"Google Chrome\";v=\"138.0.7204.169\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-model": "\"\"",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-ch-ua-platform-version": "\"19.0.0\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",

                }
            })).text
        } catch (error) {
            return new Error("网络错误：" + error.message)
        }
        console.log(response);

        let document = parser.parseFromString(response, "text/html")
        let posts = document.querySelectorAll(".post")
        console.log(posts)
        let href
        for (let d of posts) {
            let a = d.querySelector('a')
            let idUpper = id.toUpperCase()
            let title = a.title.toUpperCase()
            console.log(title.indexOf(idUpper), "111")
            if (title.indexOf(idUpper) != -1) {
                href = a.href
                break
            }
        }
        if (!href) {
            console.info(this.name + "：没有找到" + id);
            return new Error("该平台找不到" + id)
        }
        return new Ok(href)
    }
}