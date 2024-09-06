import ClientError from "./ClientError";

export default class BodyError extends ClientError {
    constructor(message: string) {
        super(`Body error, ${message}`);
    }
}
