
if (navigator.userAgent.includes('Chrome')) {
    var browserHolder = chrome
} else if (navigator.userAgent.includes('Firefox')) {
    var browserHolder = browser
}
browserHolder.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case "fetch":
                fetch(request.url,request.requestInit)
                    .then(async response => ({ status: response.status, text: await response.text() }))
                    .then(res => {
                        sendResponse({ status: res.status, text: res.text })
                    })
                    .catch(error => {
                        console.info(error + ": " + request.url);
                        sendResponse({ error })
                    })
                break;
            case "getCookie":
                new Promise((resolve, reject) => {
                    browserHolder.cookies.get({ url: request.url, name: request.name }, function name(cookie) {
                        resolve(cookie)
                    })
                }).then(res => {
                    sendResponse(res)
                })
                break;
            case "newTab":
                browserHolder.tabs.create({
                    url: request.url,
                    active: request.active
                }, (newTab) => {
                    sendResponse(newTab)
                })
            default:
                break;
        }
        return true // 必须返回true，表示消息处理结束

    }
)