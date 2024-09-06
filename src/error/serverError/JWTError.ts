import ServerError from "./ServerError";

export default class JWTError extends ServerError {
    constructor(message: string) {
        super(`JWT error, ${message}`);
    }
}
