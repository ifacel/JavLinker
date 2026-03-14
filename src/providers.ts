import { JableProvider } from "./providers/video/jable_provider.ts"
import { P123avProvider } from "./providers/video/123av_provder.ts"
import { JapanHubProvider } from "./providers/video/japanhub_provider.ts"
import { JavHdPornProvider } from "./providers/video/jav_hd_porn_provider.ts"
import { NjavProvider } from "./providers/video/njav_provider.ts"
import { SupJavProvider } from "./providers/video/supjav_provider.ts"

import { JavdbProvider } from "./providers/db/javdb_provider.ts"
import { Provider } from "./providers/provider.ts"

export const playerProviders: Provider[] = [
    new JableProvider(),
    new P123avProvider(),
    new JapanHubProvider(),
    new JavHdPornProvider(),
    new NjavProvider(),
    new SupJavProvider(),
].filter(p => p.enable)

export const dbProviers: Provider[] = [
    new JavdbProvider(),
]
