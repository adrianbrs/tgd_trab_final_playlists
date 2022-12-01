import { createBadRequestError } from "~~/server/error/bad_request.error";
import { Playlist } from "~~/server/models";
import { IUser } from "~~/server/models/user.model";
import { useApiErrorHandler } from "../../composables/use_api_error_handler";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const data = await readBody(event);

    if ("id" in data) {
      throw createBadRequestError('Forbidden property "id"');
    }
    const playlist = await (
      await Playlist.create(data)
    ).populate<{ owner: IUser }>("owner");
    event.node.res.statusCode = 201;
    return playlist;
  });
});
