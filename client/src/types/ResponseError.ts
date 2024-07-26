export class ResponseError extends Error {
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;

        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}