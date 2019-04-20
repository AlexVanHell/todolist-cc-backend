export interface IApiErrorResponse {
    code: number;
    status: number;
    message: string;
    stack?: string;
    reasons?: string[];
}