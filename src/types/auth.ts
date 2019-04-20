import { Request } from 'express';
import { UserInstance } from 'src/models/dal/User';

export interface AuthRequest extends Request {
	user: UserInstance
}