import { H3Error } from "h3";

export const createNotFoundError = (
  message = "Not found",
  options?: Partial<H3Error>
) =>
  createError({
    name: "NotFound",
    statusMessage: "Not found",
    statusCode: 404,
    message,
    ...options,
  });
