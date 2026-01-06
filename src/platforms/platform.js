import { Tabs } from "../tools/tabs.js"
import { Ok, Error, ImportantError } from "../tools/result.js"
import { Setting } from "../tools/setting.js"
export class Platform {
    useNewTab = false
    constructor() {
        Setting.getUseNewTab().then((result) => {
            if (result instanceof Ok) {
                this.useNewTab = result.data
            }
        })
    }
    handleApplyPluginResult(result, a, btn) {        
        switch (true) {
            case result instanceof Ok: {
                btn.disabled = false
                if (this.useNewTab) {
                    btn.addEventListener("click", async () => {
                        Tabs.newTab(result.data)
                    })
                } else {
                    a.href = result.data
                }
                break;
            }
            case result instanceof Error: {
                btn.style.color = "red"
                let tooltip = document.createElement("span")
                tooltip.innerText = result.message
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
                let tooltip = document.createElement("span")
                tooltip.innerText = result.message
                tooltip.className = "tooltipJav"
                btn.appendChild(tooltip)
                tooltip.dataset.state = "error"
                this.setHoverAction(btn, () => {
                    tooltip.style.display = "block"
                }, () => {
                    tooltip.style.display = "none"
                })
                if (result.action) {
                    btn.disabled = false
                    btn.addEventListener("click", () => { result.action() })
                }
                break;
            }

            default: {
                btn.title = ("发生错误：" + result)
            }
        }
    }


    applyPlugin() { }

    execute() {
        this.getInfo();
        if (!this.videoInfo.id) {
            return
        }
        this.applyPlugin();
    }

    setHoverAction(btn, onInvoke, onRevoke) {
        let pressTimer
        btn.addEventListener('mouseenter', () => {
            onInvoke();
        }, false);

        btn.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
            if (onRevoke) {
                onRevoke()
            }
        })

        // 触摸事件
        btn.addEventListener('touchstart', () => {
            onInvoke();
        });

        btn.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
            if (onRevoke) {
                onRevoke()
            }
        });

    }
}