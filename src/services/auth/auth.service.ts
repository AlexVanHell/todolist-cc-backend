import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { Service, Inject } from '@tsed/di';
import { UserRepositoryToken } from '../../models/dal/token-constants';
import { UserRepository, UserInstance } from '../../models/dal/User';
import { AuthDto, IAuthProviderProfileDto } from '../../models/dto/auth.dto';
import { validateEmail } from '../../utils/helpers.service';
import { ApiError } from '../../utils/error';
import { API_ERRORS } from '../../types/app.errors';
import { HTTPStatusCodes } from '../../types/http';
import { TOKEN_EXP } from '../../constants';
import { MongoErrorCode } from '../../types/mongo';

@Service()
export class AuthService {
	private USER_TOKEN_FIELDS = '_id email username lastName secondLastName firstName fullName picture';

	constructor(
		@Inject(UserRepositoryToken) private userRepository: UserRepository
	) { }

	/**
     * Used to fetch user based on its id.
     *
     * There are multiple approaches with working with jwt,
     * You can skip the hydration process and use only the jwt token as the user data.
     * But if you need to invalidate user token dynamically a db/redis query should be made.
     *
     * @param {string} id
	 * @param {string} tokenFields Override default selected fields
     * @returns {Promise<UserInstance>}
     */
	async rehydrateUser(id: string, tokenFields?: string): Promise<UserInstance> {
		const user: UserInstance = await this.userRepository.findById(id, tokenFields || this.USER_TOKEN_FIELDS);
		if (!user) return;

		return user;
	}

	/**
	 * Get user by provided id
	 * @param id 
	 * @param tokenFields 
	 */
	async getUserById(id: string, tokenFields?: string): Promise<UserInstance> {
		const user: UserInstance = await this.userRepository.findById(id, tokenFields || this.USER_TOKEN_FIELDS);
		if (!user) return;

		return user;
	}

	/**
	 * Get user by provided id
	 * @param id 
	 * @param tokenFields 
	 */
	async getUserByEmail(email: string, tokenFields?: string): Promise<UserInstance> {
		const user: UserInstance = await this.userRepository.findOne({ email }, tokenFields || this.USER_TOKEN_FIELDS);
		if (!user) return;

		return user;
	}

	/**
	 * Get user by provided id
	 * @param id 
	 * @param tokenFields 
	 */
	async getUserByUsername(name: string, tokenFields?: string): Promise<UserInstance> {
		const user: UserInstance = await this.userRepository.findOne({ username: name }, tokenFields || this.USER_TOKEN_FIELDS);
		if (!user) return;

		return user;
	}

	/**
	 * Create new user in database
	 * @param profile 
	 */
	async createUser(profile: IAuthProviderProfileDto): Promise<UserInstance> {
		this.validateProfile(profile);

		const user: UserInstance = new this.userRepository({
			...profile
		});

		try {
			return await user.save();
		} catch (e) {
			if (e.code === MongoErrorCode.DUPLICATE_KEY) throw new ApiError(API_ERRORS.USER_ALREADY_EXISTS)

			throw new ApiError(API_ERRORS.GENERAL_ERROR)
		}
	}

	/**
	 * Validate profile information
	 * @param profile 
	 */
	private validateProfile(profile: IAuthProviderProfileDto) {
		if (!profile.email) throw new ApiError({ message: 'Missing email field' }, HTTPStatusCodes.BAD_REQUEST);
		if (!validateEmail(profile.email)) throw new ApiError({ message: 'Invalid email adress' }, HTTPStatusCodes.BAD_REQUEST);
		if (!profile.firstName) throw new ApiError({ message: 'Missing firstName field' }, HTTPStatusCodes.BAD_REQUEST);
		if (!profile.password) throw new ApiError({ message: 'Missing password field' }, HTTPStatusCodes.BAD_REQUEST);
		if (profile.password && profile.password.length < 6) throw new ApiError({ message: 'Password must be 6 char long' }, HTTPStatusCodes.BAD_REQUEST);
	}

	/**
	 * Validate token with jwt
	 * @param token 
	 */
	async validateToken(token: string) {
		try {
			const payload: string | object = jwt.verify(token, process.env.SECRET);

			return await this.rehydrateUser((<object>payload)['_id']);
		} catch (err) {
			if (err.name === 'TokenExpiredError') throw new ApiError(API_ERRORS.EXPIRED_TOKEN)

			throw new ApiError(API_ERRORS.UNAUTHORIZED)
		}
	}

	async authenticateLocal(email: string, password: string): Promise<AuthDto> {
		const user = await this.userRepository.findOne({ email }, this.USER_TOKEN_FIELDS + ' password');

		if (!user) throw new ApiError(API_ERRORS.USER_NOT_FOUND);

		const isMatch = await user.matchPassword(password);

		if (!isMatch) throw new ApiError(API_ERRORS.USER_WRONG_CREDENTIALS);

		return await this.generateToken(user);
	}

	private async generateToken(user: UserInstance): Promise<AuthDto> {
		const payload: UserInstance = {
			_id: user._id,
			email: user.email,
			lastName: user.lastName,
			firstName: user.firstName,
			picture: user.picture
		} as any;

		return {
			token: jwt.sign(payload, process.env.SECRET, { expiresIn: TOKEN_EXP }),
			expires: moment().add(TOKEN_EXP, 'ms').format('X')
		};
	}
}