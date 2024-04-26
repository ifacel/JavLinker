const videoInfo = {};
const config = {
    platforms: [
        {
            name: "Jable",
            enable: true,
            format: (id) => {
                return `https://jable.tv/videos/${id}/`
            },
            validChecker: statusValidChecker
        },
        {
            name: "Njav",
            enable: true,
            format: (id) => {
                return `https://njav.tv/zh/v/${id}`
            },
            validChecker: statusValidChecker
        },
        {
            name: "Missav",
            enable: true,
            format: (id) => {
                return `https://missav.com/${id}`
            },
            validChecker: statusValidChecker
        }
    ]
}
const infoElement = document.querySelector('.info');


function addLinkButtons() {
    if (infoElement) {
        getInfo();
        if (!videoInfo.id) {
            return
        }
        addButtons();
    }
}

function getInfo() {
    const p = infoElement.firstElementChild;
    if (p.firstElementChild.textContent.includes("識別碼")) {
        videoInfo.id = p.lastElementChild.textContent.trim();
    }
}

/**
 * 
 * @returns {boolean}
 */
function statusValidChecker(result) {
    return result.status == 200
}

function addButtons() {
    let header = document.createElement('p');
    header.innerHTML = "播放链接:"
    header.setAttribute("class", "header")
    infoElement.appendChild(header);
    let btnsContainer = document.createElement('p');

    infoElement.appendChild(btnsContainer);
    let platforms = config.platforms.filter(p => p.enable)
    platforms.forEach(async (platform, index) => {
        let url = platform.format(videoInfo.id)
        let btn = document.createElement('button');
        btn.innerText = platform.name;
        btn.style.cssText = index === 0 ? "margin:0 5px 0 0" : "margin:0 5px;"
        btn.disabled = true
        btn.className = "btnJav"
        btn.onclick = () => {
            window.open(url);
        }
        btnsContainer.appendChild(btn);
        let response = await fetchUrl(url)
        console.log(response);
        if (platform.validChecker(response)) {
            btn.disabled = false
        } else {
            console.info(`invalid ${platform.name} ID: ${videoInfo.id}`);
            btn.style.color = "red"
        }
    })
}

function addALinkButton() {

}

class FetchResult {
    status
    text
    error
    constructor(status, text, error) {
        this.status = status;
        this.text = text;
        this.error = error;
    }
}

/**
 * 
 * @param {*} url 
 * @returns {Promise<FetchResult>}
 */
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                type: "fetch",
                url,
            },
            response => {
                resolve(new FetchResult(response.status, response.text, response.error))
            }
        )
    })
}

addLinkButtons();
