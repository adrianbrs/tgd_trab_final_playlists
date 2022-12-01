import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { createNotFoundError } from "~~/server/error/not_found.error";
import { Media } from "~~/server/models";

export default defineEventHandler(({ context }) => {
  return useApiErrorHandler(async () => {
    const mediaId = context.params.id;
    const media = await Media.findOne({
      _id: mediaId,
    }).orFail();

    return media;
  });
});
