import { Storage } from "./storage.ts";
import { Ok } from "../models/result.ts"
import browserHolder from "./browser_init.ts"

const KEY_SUPJAV = "supjav"
const KEY_NJAV = "njav"

interface KeptCookies {
    [key: string]: string | undefined
}

interface ModifyItem {
    host: string
    key: string
    ruleId: number
}

const list: ModifyItem[] = [
    {
        host: "supjav.com",
        key: KEY_SUPJAV,
        ruleId: 1001
    },
    {
        host: "njav.com",
        key: KEY_NJAV,
        ruleId: 1002
    }
]

var keptCookies: KeptCookies = {}
loadKeptCookies()

const MyExtensionId = browserHolder.runtime.id

function loadKeptCookies() {
    Storage.get(KEY_SUPJAV).then(result => {
        if ((result instanceof Ok) && result.data) {
            keptCookies[KEY_SUPJAV] = result.data
        }
    })
    Storage.get(KEY_NJAV).then(result => {
        if ((result instanceof Ok) && result.data) {
            keptCookies[KEY_NJAV] = result.data
        }
    })
}

browserHolder.webRequest.onBeforeSendHeaders.addListener(
    // @ts-ignore
    async (details) => {
        const item = list.find(x => details.url.indexOf(x.host) != -1)
        if (details.url.indexOf(item!.host) != -1 && details.type == "main_frame") {
            const cookieHeader = details.requestHeaders?.find(
                // @ts-ignore
                header => header.name.toLowerCase() === 'cookie'
            );
            let cookie = cookieHeader?.value

            if (cookie && keptCookies[item!.key] !== cookie) {
                const RULE_ID = item!.ruleId;
                await updateHeaderCookie(RULE_ID, cookie, {
                    urlFilter: item!.host,
                    initiatorDomains: [MyExtensionId],
                    resourceTypes: ['xmlhttprequest']
                })
                keptCookies[item!.key] = cookie
                Storage.set(item!.key, cookie)
                console.log("设置" + item!.host + "的cookie " + cookie);
            }
        }

        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["*://*.supjav.com/*", "*://*.njav.com/*"] },
    ["requestHeaders", "extraHeaders"]
);

async function updateHeaderCookie(id: number, newCookie: string, condition: any) {
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id],
        addRules: [{
            id: id,
            priority: 1,
            action: {
                type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
                requestHeaders: [
                    { header: 'cookie', operation: 'set' as chrome.declarativeNetRequest.HeaderOperation, value: newCookie },
                ]
            },
            condition: condition
        }]
    });
}
