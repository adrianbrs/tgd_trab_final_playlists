import { Media } from "~~/server/models";

export default defineEventHandler(async () => {
  const medias = await Media.find();
  return medias;
});
