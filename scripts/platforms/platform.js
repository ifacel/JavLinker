class Platform {

    handleResult(result, a, btn) {
        if (result instanceof Ok) {
            btn.disabled = false
            a.href = result.data;
        } else if (result instanceof Error) {
            btn.style.color = "red"
            let tooltip = document.createElement("span")
            tooltip.innerText = result.message
            tooltip.className = "tooltipJav"
            btn.appendChild(tooltip)
            this.setLongClick(btn, () => {
                tooltip.style.display = "block"
            }, () => {
                tooltip.style.display = "none"
            })
        } else {
            btn.title = ("发生错误：" + result)
            this.setLongClick(btn, () => {
                alert(result)
            })
        }
    }

    execute() {
        if (this.infoElement) {
            this.getInfo();
            if (!this.videoInfo.id) {
                return
            }
            this.addButtons();
        }
    }

    setLongClick(btn, onInvoke, onRevoke) {

        let pressTimer
        btn.addEventListener('mouseenter', () => {
            onInvoke();
        }, false);

        btn.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
            onRevoke()
        })

        // 触摸事件
        btn.addEventListener('touchstart', () => {
            onInvoke();
        });

        btn.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
            onRevoke()
        });

    }
}