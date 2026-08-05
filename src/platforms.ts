import { JavBus } from "./platforms/db/javbus.ts"
import { JavLibrary } from "./platforms/db/javlibrary.ts"
import { JavDb } from "./platforms/db/javdb.ts"
import { Jable } from "./platforms/player/jable.ts"
import { P123av } from "./platforms/player/123av.ts"
import { Mf2607 } from "./platforms/player/mf2607.ts"
import { Platform } from "./platforms/platform.ts"

export const dbPlatforms: Platform[] = [
    new JavBus(),
    new JavLibrary(),
    new JavDb(),
]

export const playerPlatforms: Platform[] = [
    new Jable(),
    new P123av(),
    new Mf2607(),
]
