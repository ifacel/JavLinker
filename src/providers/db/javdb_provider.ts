import { Provider } from "../provider.ts";
import {
  Ok,
  Error as ResultError,
  ImportantError,
  Result,
} from "../../models/result.ts";
import { Info } from "../../models/info.ts";
import { PlatformType } from "../../models/platform_type.ts";
import { JavdbVideoProvider } from "./javdb_video_provider.ts";
import { JavdbActorProvider } from "./javdb_actor_provider.ts";
import { SearchData } from "../../models/search_data.ts";

export class JavdbProvider extends Provider {
  name: string = "JavDB";
  private impl?: Provider;

  override enable: boolean = true;

  async search(info: Info): Promise<Result<SearchData>> {
    if (!this.impl) {
      if (info.type === PlatformType.Video) {
        this.impl = new JavdbVideoProvider();
      } else if (info.type === PlatformType.Actor) {
        this.impl = new JavdbActorProvider();
      } else {
        console.error(info);
        throw new Error("JavDB 不支持该类型搜索", info.type);
      }
    }

    return this.impl.search(info);
  }
}
