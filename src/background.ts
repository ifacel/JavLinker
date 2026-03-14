import "./tools/requerst_modifier.ts"
import browserHolder from "./tools/browser_init.ts"

browserHolder.runtime.onMessage.addListener(
    // @ts-ignore
    (request, sender, sendResponse) => {
        switch (request.type) {
            case "fetch":
                fetch(request.url, request.data)
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
                new Promise((resolve) => {
                    // @ts-ignore
                    browserHolder.cookies.get({ url: request.url, name: request.name }, (cookie) => {
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
                    // @ts-ignore
                }, (newTab) => {
                    sendResponse(newTab)
                })
                break;
            default:
                break;
        }
        return true // 必须返回true，表示异步发送响应
    }
)
