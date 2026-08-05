import { Platform } from "../platform.ts"
import { dbProviers } from "../../providers.ts"
import { ImportantError, Result } from "../../models/result.ts"
import { Info } from "../../models/info.ts"

export class Mf2607 extends Platform {
    override name: string = "mf2607"
    hosts: string[] = ["mf2607.com"]
    info: Info = new Info()
    idElements: Set<HTMLElement> = new Set<HTMLElement>()

    override match(): boolean {
        return this.hosts.includes(document.location.host) &&
            document.location.pathname.startsWith("/movie/")
    }

    override getInfo(): boolean {
        if (!this.idElements.size) {
            const eles = document.querySelectorAll<HTMLElement>('.flex')
            for (const ele of eles) {
                if (!ele.innerText.startsWith("番號")) continue
                const e = ele.querySelector<HTMLSpanElement>('span') || ele.querySelector<HTMLDivElement>('div')
                if (e?.childElementCount !== 0) continue
                if (!e) continue
                this.idElements.add(e)
                console.log("id element: ", this.idElements);
            }
        }
        const ele = this.idElements.values().next().value
        if (!ele) return false
        const id = ele.innerText.replace(/^\s*番號\s*[：:]\s*/, "")
        if (!id) return false
        console.log("id: ", id);
        this.info.id = id.trim()
        return true
    }

    override async execute(): Promise<void> {
        const found = await this.waitForInfo()
        if (!found) {
            throw new ImportantError("获取info失败")
        }
        this.applyPlugin()
    }

    private waitForInfo(timeout: number = 20000): Promise<boolean> {
        return new Promise((resolve) => {
            const start = Date.now()
            const timer = setInterval(() => {
                if (this.getInfo()) {
                    clearInterval(timer)
                    resolve(true)
                    return
                }
                if (Date.now() - start > timeout) {
                    clearInterval(timer)
                    console.error("获取info超时")
                    resolve(false)
                }
            }, 200)
        })
    }

    override applyPlugin(): void {
        for (const ele of this.idElements) {
            let div = document.createElement("div")
            div.setAttribute("class", "panel-block")
            div.style.display = "inline-flex"
            div.style.marginLeft = "7px"

            let value = document.createElement("span")
            value.setAttribute("class", "value")
            div.appendChild(value)
            ele.appendChild(div)

            let btnsContainer = document.createElement("p")
            btnsContainer.style.marginBottom = "0px"
            value.appendChild(btnsContainer)

            dbProviers.forEach(async (provider) => {
                let a = document.createElement("a")
                a.target = "_blank"
                let btn = document.createElement("button")
                btn.innerText = provider.name
                btn.disabled = true
                btn.className = "btnJav"
                btn.style.marginBottom = "0px"

                let spinner = document.createElement("div")
                spinner.className = "spinner"
                spinner.style.cssText = "margin:0 0 0 5px"
                btn.append(spinner)
                a.appendChild(btn)
                btnsContainer.appendChild(a)

                let result: Result
                try {
                    result = await provider.search(this.info)
                } catch (error: any) {
                    console.error(error)
                    result = new ImportantError(error.message || String(error))
                }
                spinner.remove()
                super.handleApplyPluginResult(result, a, btn)
            })
        }
    }
}