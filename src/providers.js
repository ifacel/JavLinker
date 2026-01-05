import { JableProvider } from "./providers/player/jable_provider.js"
import { P123avProvider } from "./providers/player/123av_provder.js"
import { NjavProvider } from "./providers/player/njav_provider.js"
import { SupjavProvider } from "./providers/player/supjav_privder.js"
import { JapanHubProvider } from "./providers/player/japanhub_provider.js"
import { JavdbProvider } from "./providers/db/javdb_provider.js"

export const playerProviders = [
    new JableProvider(),
    new P123avProvider(),
    new NjavProvider(),
    new SupjavProvider(),
    new JapanHubProvider(),
].filter(p => p.enable)

export const dbProviers = [
    new JavdbProvider(),
]