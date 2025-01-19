if (navigator.userAgent.includes('Chrome')) {
    var browserHolder = chrome
} else if (navigator.userAgent.includes('Firefox')) {
    var browserHolder = browser
}
browserHolder.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case "fetch":
                fetch(request.url)
                    .then(async response => ({ status: response.status, text: await response.text() }))
                    .then(res => {
                        sendResponse({ status: res.status, text: res.text })
                    })
                    .catch(error => {
                        console.error(error + ": " + request.url);
                        sendResponse({ error })
                    })
                break;
            case "getCookie":
                new Promise((resolve, reject) => {
                    chrome.cookies.get({ url: request.url, name: request.name }, function name(cookie) {
                        resolve(cookie)
                    })
                }).then(res => {
                    sendResponse(res)
                })

                break
            default:
                break;
        }
        return true // 必须返回true，表示消息处理结束

    }



)