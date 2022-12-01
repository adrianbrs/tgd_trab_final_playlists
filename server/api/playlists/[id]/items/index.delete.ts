import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { Playlist } from "~~/server/models";
import { IUser } from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const playlistId = event.context.params.id;

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: {
          items: [],
        },
      },
      { new: true }
    )
      .orFail()
      .populate<{
        owner: Pick<IUser, "name" | "username">;
      }>("owner", ["name", "username"]);

    return playlist;
  });
});
