import { MongoServerError } from "mongodb";
import { Error } from "mongoose";
import { createBadRequestError } from "../error/bad_request.error";
import { createNotFoundError } from "../error/not_found.error";

const getMongoServerError = (err: MongoServerError) => {
  switch (err.code) {
    case 11000:
      return createBadRequestError("Unique constraint violation", {
        data: err["keyValue"],
      });
    default:
      return null;
  }
};

const getError = (err: any) => {
  switch (true) {
    case err instanceof Error.DocumentNotFoundError:
      const [, modelName] =
        String(err.message).match(/model\s+\"(\w+)\"/) ?? [];
      return createNotFoundError(
        modelName ? `${modelName} not found` : err.message
      );
    case err instanceof Error.ValidationError:
    case err instanceof Error.CastError:
      return createBadRequestError(err.message);
    case err instanceof MongoServerError:
      const serverError = getMongoServerError(err);
      if (serverError) {
        return serverError;
      }
    default:
      return createError({
        name: err?.name || "Internal server error",
        statusMessage: err?.statusMessage || "Internal server error",
        message: err?.message || "Something went wrong",
        statusCode: err?.status || err?.statusCode || 500,
      });
  }
};

const handleError = (err: any) => {
  if (isError(err)) {
    return err;
  }
  return getError(err);
};

export const useApiErrorHandler = (cb: () => any) => {
  try {
    let res = cb();
    if (res instanceof Promise) {
      return res.catch(handleError);
    }
    return res;
  } catch (err: any) {
    handleError(err);
  }
};
