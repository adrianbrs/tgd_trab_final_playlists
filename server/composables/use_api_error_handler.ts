const statusCodeMap: Record<string, number> = {
    CastError: 400
}

const getError = (err: Error) => {
    return createError({
        name: err.name,
        statusMessage: err.message,
        statusCode: statusCodeMap[err.name] ?? 500
    });
}

const handleError = (err: any) => {
    if (err instanceof Error) {
        return getError(err);
    }
    return createError({
        name: 'Internal server error',
        message: 'Something went wrong',
        statusCode: 500
    })
}

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
}