import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { createBadRequestError } from "~~/server/error/bad_request.error";
import { Playlist } from "~~/server/models";
import { IMedia } from "~~/server/models/media.model";
import { IPlaylistItem } from "~~/server/models/playlist.model";
import { IUser } from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const playlistId = event.context.params.id;
    const { items }: { items: (Partial<IPlaylistItem> & { media: string })[] } =
      (await readBody(event)) ?? [];

    if (!Array.isArray(items)) {
      throw createBadRequestError("Items must be an array");
    }

    const playlistItems = await Promise.all(
      items.map((item) => Playlist.createItem(item))
    );

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: {
          items: playlistItems,
        },
      },
      { new: true }
    )
      .orFail()
      .populate<{
        owner: Pick<IUser, "name" | "username">;
      }>("owner", ["name", "username"])
      .populate<{ items: { media: IMedia }[] }>("items.media");

    return playlist;
  });
});
