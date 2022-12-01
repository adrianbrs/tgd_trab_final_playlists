import { User } from "~~/server/models";
import { useApiErrorHandler } from "../../composables/use_api_error_handler";

export default defineEventHandler(async (event) => {
  return useApiErrorHandler(async () => {
    const userId = event.context.params.id;
    const user = await User.findByIdAndDelete(userId);
    event.node.res.statusCode = 204;
    return user;
  });
});
