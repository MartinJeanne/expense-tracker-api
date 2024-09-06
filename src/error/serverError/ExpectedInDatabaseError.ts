import ServerError from "./ServerError";

export default class ExpectedInDatabaseError extends ServerError {
    constructor(message: string) {
        super(`Value expected in database but not there: ${message}`);
    }
}
