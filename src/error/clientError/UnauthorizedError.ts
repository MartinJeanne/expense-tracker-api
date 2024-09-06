import ClientError from "./ClientError";

export default class UnauthorizedError extends ClientError {
    constructor(message?: string) {
        if (message) super(message, 401);
        else super('Unauthorized', 401);
    }
}
