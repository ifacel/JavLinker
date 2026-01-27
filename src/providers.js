import { JableProvider } from "./providers/player/jable_provider.js"
import { P123avProvider } from "./providers/player/123av_provder.js"
import { NjavProvider } from "./providers/player/njav_provider.js"
import { JapanHubProvider } from "./providers/player/japanhub_provider.js"
import { JavdbProvider } from "./providers/db/javdb_provider.js"
import { JavHdPornProvider } from "./providers/player/jav_hd_porn.js"

export const playerProviders = [
    new JableProvider(),
    new P123avProvider(),
    new NjavProvider(),
    new JapanHubProvider(),
    new JavHdPornProvider(),
].filter(p => p.enable)

export const dbProviers = [
    new JavdbProvider(),
]