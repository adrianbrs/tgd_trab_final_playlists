import { createBadRequestError } from "~~/server/error/bad_request.error";
import { createNotFoundError } from "~~/server/error/not_found.error";
import { Media } from "~~/server/models";
import { useApiErrorHandler } from "../../composables/use_api_error_handler";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const mediaId = event.context.params.id;
    const data = await readBody(event);

    delete data["_id"];
    delete data["id"];

    const media = await Media.findByIdAndUpdate(mediaId, data, {
      new: true,
    }).orFail();

    return media;
  });
});
