import { H3Error } from "h3";

export const createBadRequestError = (
  message = "Bad request",
  options?: Partial<H3Error>
) =>
  createError({
    name: "BadRequest",
    statusMessage: "Bad request",
    message,
    ...options,
  });
