import ClientError from "./ClientError";

export default class AlbreadyExistsError extends ClientError {
    constructor(message: string) {
        super(`Error, albready exists: ${message}`, 403);
    }
}
