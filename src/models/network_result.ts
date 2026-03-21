import { Ok, Error, ImportantError } from "./result";

interface NetworkResult {
    code: number;
    data?: string;
}

class NetworkOk extends Ok<string> implements NetworkResult {
    code: number;
    constructor(code: number, data: string) {
        super(data);
        this.code = code;
    }
}

class NetworkError extends ImportantError<string> implements NetworkResult {
    code: number;
    message: string;
    data: string;
    constructor(code: number, message: string, data: string) {
        super(message);
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export { NetworkResult, NetworkOk, NetworkError }