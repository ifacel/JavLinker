import './css/jav_liner.css';
import { dbPlatforms, playerPlatforms } from "./platforms.ts"
import { SelectionPlatform } from "./platforms/selection/selection_platform.ts"

let p = dbPlatforms.find(it => it.match())
if (p) {
    p.execute()
} else {
    p = playerPlatforms.find(it => it.match())
    if (p) {
        p.execute()
    }
}
console.log("JavLinker loaded");
// 所有网站通用：选中番号文字时弹出悬浮按钮，列出所有 provider
new SelectionPlatform().watchSelection()
