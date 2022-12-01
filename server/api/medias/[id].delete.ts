import { Media } from "~~/server/models";
import { useApiErrorHandler } from "../../composables/use_api_error_handler";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const mediaId = event.context.params.id;
    const media = await Media.findByIdAndDelete(mediaId);
    event.node.res.statusCode = 204;
    return media;
  });
});
