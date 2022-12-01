import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { Playlist } from "~~/server/models";
import { IUser } from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const playlistId = event.context.params.id;
    const itemId = event.context.params.itemId;
    const data = await readBody(event);

    await Playlist.updateOne(
      {
        _id: playlistId,
        "items._id": itemId,
      },
      {
        $set: {
          "items.$.title": data?.title,
          "items.$.start": data?.start,
          "items.$.end": data?.end,
          "items.$.media": data?.media,
        },
      }
    );

    const playlist = await Playlist.findOne(
      {
        _id: playlistId,
        "items._id": itemId,
      },
      { "items.$": 1 }
    ).orFail();

    return playlist.items[0];
  });
});
