import ClientError from "./ClientError";

export default class BodyError extends ClientError {
    constructor(message: string) {
        super(`Error, not found: ${message}`, 404);
    }
}
