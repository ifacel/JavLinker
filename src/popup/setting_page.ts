import { Setting } from "../tools/setting.ts"
import { Ok, Error as ResultError } from "../models/result.ts"

window.onload = () => {
    const checkboxUseNewTab = document.getElementById('useNewTab') as HTMLInputElement
    const checkboxNewTabInBackend = document.getElementById('newTabInBackend') as HTMLInputElement

    checkboxUseNewTab.addEventListener('change', async (event: Event) => {
        const target = event.target as HTMLInputElement
        let result = await Setting.setUseNewTab(target.checked)
        if (result instanceof Ok) {
            // 后台打开依赖于此
            checkboxNewTabInBackend.disabled = !target.checked
        } else if (result instanceof ResultError) {
            loadConfig()
            alert(result.message)
        }
    })

    checkboxNewTabInBackend.addEventListener('change', async (event: Event) => {
        const target = event.target as HTMLInputElement
        let result = await Setting.setOpenInBackend(target.checked)
        if (result instanceof ResultError) {
            loadConfig()
            alert(result.message)
        }
    })

    async function loadConfig() {
        let resultUseNewTab = await Setting.getUseNewTab()
        let useNewTabValue = false
        if (resultUseNewTab instanceof Ok) {
            useNewTabValue = resultUseNewTab.data
            checkboxUseNewTab.checked = useNewTabValue
        }

        let resultOpenInBackend = await Setting.getOpenInBackend()
        if (resultOpenInBackend instanceof Ok) {
            checkboxNewTabInBackend.checked = resultOpenInBackend.data
        }
        checkboxNewTabInBackend.disabled = !useNewTabValue
    }
    loadConfig()
}
