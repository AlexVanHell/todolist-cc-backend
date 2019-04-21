import { API_ERRORS } from '../../types/app.errors';

export interface ErrorPayload {
	status?: number;
	code?: number;
	message: string;
}

export class ApiError extends Error {
	code: number;
	status: number;

	constructor(payload: ErrorPayload, status = 500) {
		super(payload.message);

		this.code = (payload.code || API_ERRORS.GENERAL_ERROR.code);
		this.status = (payload.status || status);
	}
}