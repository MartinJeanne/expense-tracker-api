import ClientError from "./ClientError";

export default class QueryParamError extends ClientError {
    constructor(message: string) {
        super(`Path Parameter error, ${message}`);
    }
}
