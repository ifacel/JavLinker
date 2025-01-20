class TabsImpl {
    async newTab(url) {
        let back = await Storage.getOpenInBackend()        
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

const Tabs = new TabsImpl();