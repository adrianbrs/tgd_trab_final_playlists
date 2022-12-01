import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { Playlist } from "~~/server/models";
import { IMedia } from "~~/server/models/media.model";

export default defineEventHandler(({ context }) => {
  return useApiErrorHandler(async () => {
    const playlistId = context.params.id;
    const playlist = await Playlist.findOne(
      {
        _id: playlistId,
      },
      { items: 1 }
    )
      .orFail()
      .populate<{ items: { media: IMedia }[] }>("items.media");

    return playlist;
  });
});
