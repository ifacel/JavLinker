window.onload = () => {
    const checkboxUseNewTab = document.getElementById('useNewTab')
    const checkboxNewTabInBackend = document.getElementById('newTabInBackend')

    checkboxUseNewTab.addEventListener('change', async (event) => {        
        let result = await Storage.setUseNewTab(event.target.checked)   
        if (result instanceof Ok) {
            //后台打开配置依赖于
            checkboxNewTabInBackend.disabled = !event.target.checked
        }
        if (result instanceof Error) {
            alert(result.message)
        }
    })

    checkboxNewTabInBackend.addEventListener('change', async (event) => {        
        let result = await Storage.setOpenInBackend(event.target.checked)
        if (result instanceof Error) {
            alert(result.message)
        }
    })

    async function loadConfig() {
        let resultUseNewTab = await Storage.getUseNewTab()        
        if (resultUseNewTab instanceof Ok) {
            checkboxUseNewTab.checked = resultUseNewTab.data
        }
        checkboxUseNewTab.disabled = false
        let resultOpenInBackend = await Storage.getOpenInBackend()
        if (resultOpenInBackend instanceof Ok) {
            checkboxNewTabInBackend.checked = resultOpenInBackend.data
        }
        checkboxNewTabInBackend.disabled = !resultUseNewTab.data
    }

    loadConfig()


}
