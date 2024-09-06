import ClientError from "./ClientError";

export default class UnauthorizedError extends ClientError {
    constructor() {
        super('Unauthorized', 401);
    }
}
