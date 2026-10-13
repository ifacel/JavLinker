import { Platform } from "../platform.ts";
import { dbProviers, playerProviders } from "../../providers.ts";
import { Info } from "../../models/info.ts";
import { PlatformType } from "../../models/platform_type.ts";
import { Ok, Result } from "../../models/result.ts";
import { SearchData } from "../../models/search_data.ts";
import { extractJavCode } from "../../tools/jav_code.ts";
import { Setting } from "../../tools/setting.ts";

/**
 * 通用选择平台：在所有网站上生效
 * 选中文字为番号时，在选区附近弹出悬浮按钮，
 * 点击按钮展开面板，列出所有 provider 并提供搜索结果
 */
export class SelectionPlatform extends Platform {
    override name: string = "Selection";
    info: Info = new Info();
    private floatingBtn: HTMLButtonElement | null = null;
    private panel: HTMLDivElement | null = null;

    override match(): boolean {
        return false;
    }

    override getInfo(): boolean {
        return true;
    }

    override applyPlugin(): void {
        // 由 watchSelection 驱动，无需向页面注入固定元素
    }

    /**
     * 监听全局选中事件（所有网站通用）
     */
    watchSelection(): void {
        // 鼠标选中
        document.addEventListener("mouseup", () => {
            // 等待浏览器完成选区更新
            setTimeout(() => this.handleSelection(), 0);
        });

        // 键盘选中（Shift + 方向键等）
        document.addEventListener("keyup", (e) => {
            if (e.shiftKey) {
                this.handleSelection();
            }
        });

        // Esc 关闭
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.hideAll();
            }
        });

        // 点击其它区域关闭面板
        document.addEventListener("mousedown", (e) => {
            const target = e.target as Node;
            if (
                this.panel &&
                !this.panel.contains(target) &&
                !(this.floatingBtn && this.floatingBtn.contains(target))
            ) {
                this.removePanel();
            }
        });
    }

    private async handleSelection(): Promise<void> {
        let enabled = true;
        const settingResult = await Setting.getSelectionSearchEnabled();
        if (settingResult instanceof Ok) {
            enabled = settingResult.data;
        }
        if (!enabled) return;

        const selection = window.getSelection();
        console.log(selection?.toString());

        if (!selection || selection.rangeCount === 0) return;

        const code = extractJavCode(selection.toString());
        if (!code) {
            this.hideAll();
            return;
        }

        // 忽略输入控件内的选择
        const node = selection.anchorNode;
        if (node) {
            const el =
                node.nodeType === Node.ELEMENT_NODE
                    ? (node as Element)
                    : node.parentElement;
            if (el && el.closest("input, textarea, select, [contenteditable=true], [contenteditable='']")) {
                return;
            }
        }

        this.info.id = code;
        this.info.type = PlatformType.Video;
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        this.showFloatingBtn(code, rect);
    }

    private showFloatingBtn(code: string, rect: DOMRect): void {
        // 番号变化时关闭旧面板
        if (this.floatingBtn?.dataset.code !== code) {
            this.removePanel();
        }

        if (!this.floatingBtn) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "floatingBtnJav";
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePanel();
            });
            document.body.appendChild(btn);
            this.floatingBtn = btn;
        }

        this.floatingBtn.dataset.code = code;
        this.floatingBtn.innerText = `搜索 ${code}`;
        this.floatingBtn.title = code;
        this.floatingBtn.style.display = "block";

        // 定位到选区上方居中，空间不足时放到选区下方
        const btnH = this.floatingBtn.offsetHeight || 28;
        const btnW = this.floatingBtn.offsetWidth || 80;
        let top = rect.top + window.scrollY - btnH - 8;
        if (top < window.scrollY) {
            top = rect.bottom + window.scrollY + 8;
        }
        const maxLeft =
            window.scrollX + document.documentElement.clientWidth - btnW - 8;
        let left = rect.left + window.scrollX + rect.width / 2 - btnW / 2;
        left = Math.max(window.scrollX + 8, Math.min(left, Math.max(window.scrollX + 8, maxLeft)));

        this.floatingBtn.style.top = `${top}px`;
        this.floatingBtn.style.left = `${left}px`;
    }

    private togglePanel(): void {
        if (this.panel) {
            this.removePanel();
            return;
        }
        this.showPanel();
    }

    private showPanel(): void {
        if (!this.floatingBtn || !this.info.id) return;

        const panel = document.createElement("div");
        panel.className = "floatingPanelJav";

        const header = document.createElement("div");
        header.className = "floatingPanelHeaderJav";
        const title = document.createElement("span");
        title.innerText = `番号: ${this.info.id}`;
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.innerText = "×";
        closeBtn.className = "floatingCloseBtnJav";
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.removePanel();
        });
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        const list = document.createElement("div");
        list.className = "floatingPanelListJav";
        panel.appendChild(list);

        document.body.appendChild(panel);
        this.panel = panel;

        // 列出所有 provider 并搜索
        const providers = [...dbProviers, ...playerProviders];
        providers.forEach(async (provider) => {
            const a = document.createElement("a");
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            const btn = document.createElement("button");
            btn.type = "button";
            btn.innerText = provider.name;
            btn.disabled = true;
            btn.className = "btnJav";

            const spinner = document.createElement("div");
            spinner.className = "spinner";
            spinner.style.cssText = "margin:0 0 0 5px";
            btn.append(spinner);
            a.appendChild(btn);
            list.appendChild(a);

            let result: Result<SearchData>;
            try {
                result = await provider.search(this.info);
            } catch (error: any) {
                console.error(error);
                result = error;
            }
            spinner.remove();
            this.handleApplyPluginResult(result, a, btn);
        });

        // 定位到悬浮按钮下方，并避免超出右侧边界
        const btnRect = this.floatingBtn.getBoundingClientRect();
        panel.style.top = `${btnRect.bottom + window.scrollY + 6}px`;
        const maxLeft =
            window.scrollX + document.documentElement.clientWidth - panel.offsetWidth - 8;
        let left = btnRect.left + window.scrollX;
        left = Math.max(window.scrollX + 8, Math.min(left, Math.max(window.scrollX + 8, maxLeft)));
        panel.style.left = `${left}px`;
    }

    private removePanel(): void {
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
        this.panel = null;
    }

    private hideAll(): void {
        this.removePanel();
        if (this.floatingBtn && this.floatingBtn.parentNode) {
            this.floatingBtn.parentNode.removeChild(this.floatingBtn);
        }
        this.floatingBtn = null;
    }
}
