import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { Playlist } from "~~/server/models";
import { IMedia } from "~~/server/models/media.model";
import { IUser } from "~~/server/models/user.model";

export default defineEventHandler(({ context }) => {
  return useApiErrorHandler(async () => {
    const playlistId = context.params.id;
    const playlist = await Playlist.findOne({
      _id: playlistId,
    })
      .orFail()
      .populate<{
        owner: Pick<IUser, "name" | "username">;
      }>("owner", ["name", "username"])
      .populate<{ items: { media: IMedia }[] }>("items.media");

    return playlist;
  });
});
