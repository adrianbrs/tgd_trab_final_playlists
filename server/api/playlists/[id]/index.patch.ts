import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { createBadRequestError } from "~~/server/error/bad_request.error";
import { Playlist } from "~~/server/models";
import { IMedia } from "~~/server/models/media.model";
import { IUser } from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const playlistId = event.context.params.id;
    const data = await readBody(event);

    if ("id" in data) {
      throw createBadRequestError('Forbidden property "id"');
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, data, {
      new: true,
    })
      .orFail()
      .populate<{
        owner: Pick<IUser, "name" | "username">;
      }>("owner", ["name", "username"])
      .populate<{ items: { media: IMedia }[] }>("items.media");

    return playlist;
  });
});
