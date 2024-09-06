import HTTPError from "../HTTPError";

export default class ClientError extends HTTPError {
    constructor(message: string, status?: number) {
        if (status && status >= 400 && status <= 499) super(message, status);
        else super(message, 400);
    }
}
