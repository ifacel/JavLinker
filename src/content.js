// const platforms = [
//     new JavBus(),
//     new JavLibrary(),
//     new JavDb(),
// ]
// p = platforms.find(it => it.match())
// if (p) {
//     console.info("javlinker init")
//     p.execute()
// }
import './css/jav_liner.css';
import { dbPlatforms } from "./platforms.js"
import { playerPlatforms } from "./platforms.js"

let p = dbPlatforms.find(it => it.match())
if (p) {
    console.info("db platform init")
    p.execute()
} else {
    p = playerPlatforms.find(it => it.match())
    if (p) {
        console.info("player platform init")
        p.execute()
    }
}

