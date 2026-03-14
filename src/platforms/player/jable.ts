import { Platform } from "../platform"
import { JableActor } from "./jable_actor.ts"
import { JableVideo } from "./jable_video.ts"

export class Jable extends Platform {
    override name: string = "Jable"
    private impl?: Platform

    override match(): boolean {
        const video = new JableVideo()
        if (video.match()) {
            this.impl = video
            return true
        }
        const actor = new JableActor()
        if (actor.match()) {
            this.impl = actor
            return true
        }
        return false
    }

    getInfo(): boolean {
        return this.impl?.getInfo() ?? false
    }

    override applyPlugin(): void {
        this.impl?.applyPlugin()
    }
}
