import HTTPError from "../HTTPError";

export default class ServerError extends HTTPError {
    constructor(message: string, status?: number) {
        if (status && status >= 500 && status <= 599) super(message, status);
        else super(message, 500);
    }
}
