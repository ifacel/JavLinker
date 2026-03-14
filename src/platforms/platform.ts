import { Tabs } from "../tools/tabs.ts"
import { Ok, Error as ResultError, ImportantError, Result } from "../models/result.ts"
import { Setting } from "../tools/setting.ts"
import { SearchData } from "../models/search_data.ts"
import { SearchItem } from "../models/search_item.ts"

export abstract class Platform {
    abstract name: string
    useNewTab: boolean = false

    constructor() {
        Setting.getUseNewTab().then((result) => {
            if (result instanceof Ok) {
                this.useNewTab = result.data
            }
        })
    }

    abstract match(): boolean

    handleApplyPluginResult(result: Result<SearchData>, a: HTMLAnchorElement, btn: HTMLButtonElement): void {
        switch (true) {
            case result instanceof Ok: {
                btn.disabled = false
                const data = (result as Ok<SearchData>).data

                if (data.items.length >= 2) {
                    btn.addEventListener("click", (e) => {
                        e.preventDefault()
                        this.showSelectionDialog(data.items)
                    })
                } else if (data.items.length === 1) {
                    const url = data.items[0].url
                    if (this.useNewTab) {
                        btn.addEventListener("click", (e) => {
                            e.preventDefault()
                            Tabs.newTab(url)
                        })
                    } else {
                        a.href = url
                    }
                }
                break;
            }
            case result instanceof ResultError: {
                btn.style.color = "red"
                const errResult = result as ResultError
                let tooltip = document.createElement("span")
                tooltip.innerText = errResult.message
                tooltip.className = "tooltipJav"
                btn.appendChild(tooltip)
                this.setHoverAction(btn, () => {
                    tooltip.style.display = "block"
                }, () => {
                    tooltip.style.display = "none"
                })
                break;
            }
            case result instanceof ImportantError: {
                btn.dataset.state = "error"
                const impErrResult = result as ImportantError
                let tooltip = document.createElement("span")
                tooltip.innerText = impErrResult.message
                tooltip.className = "tooltipJav"
                btn.appendChild(tooltip)
                tooltip.dataset.state = "error"
                this.setHoverAction(btn, () => {
                    tooltip.style.display = "block"
                }, () => {
                    tooltip.style.display = "none"
                })
                if (impErrResult.action) {
                    btn.disabled = false
                    btn.addEventListener("click", () => { impErrResult.action!() })
                }
                break;
            }

            default: {
                btn.title = ("发生错误：" + result)
            }
        }
    }

    private showSelectionDialog(items: SearchItem[]): void {
        const dialog = document.createElement('div')
        dialog.className = 'dialogJav'

        const overlay = document.createElement('div')
        overlay.className = "overlayJav"

        const title = document.createElement('h3')
        title.innerText = '请选择播放链接'
        title.style = 'margin:0 0 15px 0; justify-self: center'
        dialog.appendChild(title)

        const list = document.createElement('div')
        items.forEach(item => {
            const a = document.createElement('a')
            if(this.useNewTab) {
                a.target = "_blank"
            }else{
                a.href = item.url
            }
            const btn = document.createElement('button')
            btn.innerText = item.name
            btn.className = "btnJav"
            btn.addEventListener("click", (e) => {
                if (this.useNewTab) {
                    e.preventDefault()
                    Tabs.newTab(item.url)
                }
                cleanup()
            })
            a.appendChild(btn)
            list.appendChild(a)
        })
        dialog.appendChild(list)


        const cleanup = () => {
            document.body.removeChild(dialog)
            document.body.removeChild(overlay)
        }

        overlay.addEventListener('click', cleanup)
        document.body.appendChild(overlay)
        document.body.appendChild(dialog)
    }

    abstract applyPlugin(): void
    abstract getInfo(): boolean

    execute(): void {
        if (!this.getInfo()) {
            throw new ImportantError("获取info失败");
        }
        this.applyPlugin();
    }

    setHoverAction(btn: HTMLElement, onInvoke: () => void, onRevoke?: () => void): void {
        let pressTimer: number | undefined
        btn.addEventListener('mouseenter', () => {
            onInvoke();
        }, false);

        btn.addEventListener('mouseleave', () => {
            if (pressTimer) clearTimeout(pressTimer);
            if (onRevoke) {
                onRevoke()
            }
        })

        // 触摸事件
        btn.addEventListener('touchstart', () => {
            onInvoke();
        });

        btn.addEventListener('touchend', () => {
            if (pressTimer) clearTimeout(pressTimer);
            if (onRevoke) {
                onRevoke()
            }
        });
    }
}
