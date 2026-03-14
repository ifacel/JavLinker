import './css/jav_liner.css';
import { dbPlatforms, playerPlatforms } from "./platforms.ts"

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
