import { User } from "~~/server/models"

export default defineEventHandler(async () => {
    const users = await User.find();
    // test
    return users;
})