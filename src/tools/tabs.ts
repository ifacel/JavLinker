import browserHolder from "./browser_init.ts";
import { Ok, Result } from "../models/result.ts";
import { Setting } from "./setting.ts";


export class TabsImpl {
    async newTab(url: string | any): Promise<any> {
        let back = await Setting.getOpenInBackend()
        let openInBackend: boolean
        if (back instanceof Ok) {
            openInBackend = back.data
        } else {
            openInBackend = false
        }
        return new Promise((resolve) => {
            browserHolder.runtime.sendMessage(
                {
                    type: "newTab",
                    url,
                    active: !openInBackend,
                },
                (response: any) => {
                    resolve(response)
                }
            )
        })
    }
}

export const Tabs = new TabsImpl();
