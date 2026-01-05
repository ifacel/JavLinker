import { JavBus } from "./platforms/db/javbus.js"
import { JavLibrary } from "./platforms/db/javlibrary.js"
import { JavDb } from "./platforms/db/javdb.js"
import { Jable } from "./platforms/player/jable.js"
import { P123av } from "./platforms/player/123av.js"

export const dbPlatforms = [
    new JavBus(),
    new JavLibrary(),
    new JavDb(),
]

export const playerPlatforms = [
    new Jable(),
    new P123av(),
]