import { Storage } from "./storage.js";
import { Ok } from "./result.js"
import browserHolder from "./browser_init.js"

const KEY_SUPJAV = "supjav"

var keptCookies = {}
loadKeptCookies()

const MyExtensionId = browserHolder.runtime.id

function loadKeptCookies() {
    Storage.get(KEY_SUPJAV).then(result => {

        if ((result instanceof Ok) && result.data) {
            keptCookies[KEY_SUPJAV] = result.data
        }
    })
}

browserHolder.webRequest.onBeforeSendHeaders.addListener(
    async (details) => {

        if (details.url.indexOf("supjav.com") != -1 && details.type == "main_frame") {
            const cookieHeader = details.requestHeaders.find(
                header => header.name.toLowerCase() === 'cookie'
            );
            let cookie = cookieHeader.value
            console.log(keptCookies[KEY_SUPJAV]);
            console.log(cookie);

            if (keptCookies[KEY_SUPJAV] !== cookie) {
                const RULE_ID = 1001;
                await updateHeaderCookie(RULE_ID, cookie, {
                    urlFilter: "supjav.com",
                    initiatorDomains: [MyExtensionId],
                    resourceTypes: ['xmlhttprequest']
                })
                keptCookies[KEY_SUPJAV] = cookie
                Storage.set(KEY_SUPJAV, cookie)
                console.log(details);
                console.log("设置supjav的cookie " + cookie);
            }
        }

        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["*://*.supjav.com/*"] }, 
    ["requestHeaders", "extraHeaders"] 
);

async function updateHeaderCookie(id, newCookie, condition) {
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id],
        addRules: [{
            id: id,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                requestHeaders: [
                    { header: 'cookie', operation: 'set', value: newCookie },
                ]
            },
            condition: condition
        }]
    });
}

