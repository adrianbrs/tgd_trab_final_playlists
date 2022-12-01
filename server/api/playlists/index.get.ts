import { Playlist } from "~~/server/models";
import { IMedia } from "~~/server/models/media.model";
import { IUser } from "~~/server/models/user.model";

export default defineEventHandler(async () => {
  const playlists = await Playlist.find()
    .populate<{
      owner: Pick<IUser, "name" | "username">;
    }>("owner", ["name", "username"])
    .populate<{ items: { media: IMedia }[] }>("items.media");
  return playlists;
});
