chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "fetch") {
            fetch(request.url)
            .then(async response => ({status:response.status, text:await response.text()}))
            .then(res => {
                sendResponse({ status:res.status, text: res.text})
            })
            .catch(error => {
                console.error(error);
                sendResponse({ error })
            })
        }
        return true // 必须返回true，表示消息处理结束
    }
)