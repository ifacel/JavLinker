Network = {
    /**
     * 
     * @param {*} url 
     * @returns {Promise<FetchResult>}
     */
    fetch: function fetchUrl(url) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    type: "fetch",
                    url,
                },
                response => {
                    resolve(new FetchResult(response.status, response.text, response.error))
                }
            )
        })
    }
}

class FetchResult {
    status
    text
    error
    constructor(status, text, error) {
        this.status = status;
        this.text = text;
        this.error = error;
    }
}

