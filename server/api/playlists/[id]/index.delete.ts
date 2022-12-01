import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { Playlist } from "~~/server/models";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const playlistId = event.context.params.id;
    const media = await Playlist.findByIdAndDelete(playlistId);
    event.node.res.statusCode = 204;
    return media;
  });
});
