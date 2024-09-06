export default class JWTError extends Error {
    constructor(message: string) {
        super(message);
    }
}
