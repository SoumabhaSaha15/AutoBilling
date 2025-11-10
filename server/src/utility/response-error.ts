export default class ResponseError extends Error {
  public readonly statusCode: number;
  public readonly cause: string;
  constructor(statusCode: number, message: string, cause: string = 'unknown') {
    super(message);
    this.name = 'ResponseError';
    this.statusCode = statusCode;
    this.cause = cause;
    if (Error.captureStackTrace) Error.captureStackTrace(this, ResponseError);
  }
  public isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode <= 499;
  }
}
