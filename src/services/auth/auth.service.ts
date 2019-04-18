import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { Service, Inject } from "@tsed/di";
import { UserRepositoryToken } from "src/models/dal/token-constants";
import { UserRepository, UserInstance } from "src/models/dal/User";
import { AuthDto, IAuthProviderProfileDto } from "src/models/dto/auth.dto";
import { validateEmail } from 'src/utils/helpers.service';

const DAY = 60000 * 60 * 24;
export const TOKEN_EXP = DAY * 7; // One week

@Service()
export class AuthService {
	private USER_TOKEN_FIELDS = '_id email lastName firstName picture fullName';

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
     * @returns {Promise<User>}
     */
	async rehydrateUser(id: string): Promise<UserInstance> {
		const user = await this.userRepository.findById(id, this.USER_TOKEN_FIELDS);
		if (!user) return;

		return user;
	}

	async createUser(profile: IAuthProviderProfileDto): Promise<UserInstance> {
		this.validateProfile(profile);

		const user = new this.userRepository({
			...profile
		});

		try {
			return await user.save();
		} catch (e) {
			if (e.code === 11000) {
				throw { status: 409, code: 'USER_ALREADY_EXISTS', message: 'El usuario ya existe' };
			}

			throw { code: 'UNEXPECTED_ERROR', message: 'Hubo un error inesperado' }
		}
	}

	private validateProfile(profile: IAuthProviderProfileDto) {
		if (!profile.email) throw { message: 'Falta el email' }
		if (!validateEmail(profile.email)) throw { status: 400, message: 'Dirección de correo inválida' };
		if (!profile.firstName) throw { status: 400, message: 'Hace falta el nombre' };
		if (profile.password && profile.password.length < 6) throw { status: 400, message: 'La contraseña debe ser minimo de 6 caractéres' };
	}

	async validateToken(token: string) {
		try {
			const payload = jwt.verify(token, process.env.SECRET);

			return await this.rehydrateUser((<any>payload)._id);
		} catch (err) {
			if (err.name === 'TokenExpiredError') throw { code: 'EXPIRED_TOKEN', message: 'El token ha expirado' };

			throw { status: 401, code: 'UNAUTHORIZED', message: 'Acceso no autorizado' };
		}
	}

	async authenticateLocal(email: string, password: string): Promise<AuthDto> {
		const user = await this.userRepository.findOne({ email }, this.USER_TOKEN_FIELDS + ' password');

		if (!user) {
			throw { status: 404, code: 'USER_NOT_FOUND', message: 'El usuario no existe' };
		}

		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			throw { status: 409, code: 'USER_WRONG_CREDENTIALS', message: 'Las credenciales proporcionadas son icnorrectas' };
		}

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