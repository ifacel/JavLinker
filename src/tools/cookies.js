
import browserHolder from "./browser_init.js"

export class CookieImpl {
    /**
     * 
     * @param {string} url 
     * @param {string} name
     * @returns {Promise<Result>}
     */
    get(url, name) {
        return new Promise((resolve, _) => {
            browserHolder.runtime.sendMessage(
                {
                    type: "getCookie",
                    url,
                    name
                },
                response => {
                    if (response) {
                        resolve(new Ok(response.value))
                    } else {
                        resolve(new Error("Cookie not found"))
                    }
                }
            )
        })

    }
}

export const Cookie = new CookieImpl()