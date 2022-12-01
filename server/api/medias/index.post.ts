import { createBadRequestError } from "~~/server/error/bad_request.error";
import { Media } from "~~/server/models";
import { useApiErrorHandler } from "../../composables/use_api_error_handler";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const data = await readBody(event);

    if ("id" in data) {
      throw createBadRequestError('Forbidden property "id"');
    }
    const media = await Media.create(data);
    event.node.res.statusCode = 201;
    return media;
  });
});
