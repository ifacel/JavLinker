class NetworkImpl {
    /**
     * 
     * @param {*} url 
     * @returns {Promise<FetchResult>}
     */
    fetch(url) {
        return new Promise((resolve, reject) => {
            browserHolder.runtime.sendMessage(
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

const Network = new NetworkImpl();
