import { useApiErrorHandler } from "~~/server/composables/use_api_error_handler";
import { User } from "~~/server/models";

export default defineEventHandler(({ context }) => {
    return useApiErrorHandler(async () => {
        const userId = context.params.id;
        const user = await User.findOne({
            _id: userId
        });

        return user;
    })
})