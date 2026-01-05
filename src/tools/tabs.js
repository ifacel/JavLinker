import browserHolder from "./browser_init.js";
import { Ok } from "./result.js"
import { Setting } from "./setting.js";
export class TabsImpl {
    async newTab(url) {
        let back = await Setting.getOpenInBackend()
        let openInBackend
        if (back instanceof Ok) {
            openInBackend = back.data
        } else {
            openInBackend = false
        }
        return new Promise((resolve, reject) => {
            browserHolder.runtime.sendMessage(
                {
                    type: "newTab",
                    url,
                    active: !openInBackend,
                },
                response => {
                    resolve(response)
                }
            )
        })
    }
}

export const Tabs = new TabsImpl();