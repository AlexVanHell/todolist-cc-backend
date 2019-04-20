import { Controller, Post, BodyParams, Request, Response, Next, Status, Get, Authenticated, Req, PathParams, JsonProperty, QueryParams } from '@tsed/common';
import { Returns, Description } from '@tsed/swagger';
import { NextFunction } from 'express-serve-static-core';
import { Validate, Validator } from 'typescript-param-validator';
import { AuthService } from '../../services/auth/auth.service';
import { AuthDto, SignupDto, LoginDto, UserDto, UsernameDto, EmailDto } from '../../models/dto/auth.dto';
import { AuthRequest } from '../../types/auth';
import { UserInstance } from '../../models/dal/User';
import { validateEmail } from '../../utils/helpers.service';
import { ApiError } from '../../utils/error';
import { API_ERRORS } from '../../types/app.errors';
import { HTTPStatusCodes } from '../../types/http';
import { $log } from 'ts-log-debug';

@Controller('/auth')
export class AuthController {
	constructor(
		private authService: AuthService
	) {

	}

	@Post('/login')
	@Returns(AuthDto)
	@Validate()
	async login(
		@Validator() @BodyParams() body: LoginDto,
		@Request() req: any,
		@Response() res,
		@Next() next: NextFunction
	): Promise<AuthDto> {
		return await this.authService.authenticateLocal(body.email, body.password);
	}

	@Post('/signup')
	@Returns(AuthDto)
	@Status(201)
	@Validate()
	async signup(
		@Validator() @BodyParams() body: SignupDto
	): Promise<AuthDto> {
		const user = await this.authService.createUser(body);
		const authData = await this.authService.authenticateLocal(user.email, body.password);

		return authData;
	}

	@Get('/user')
	@Description('Get information about authenticated user')
	@Returns(UserDto)
	@Authenticated()
	async getUser(
		@Req() req: AuthRequest
	): Promise<UserDto> {
		return await this.authService.getUserById(req.user._id);
	}

	@Get('/user/username')
	@Description('Check if username is already in use')
	@Returns(UsernameDto)
	async findUserName(
		@QueryParams('name') name: string
	): Promise<UsernameDto> {
		const user: UserInstance = await this.authService.getUserByUsername(name, 'username');
		return { username: user ? user.username : null };
	}

	@Get('/user/email')
	@Description('Check if email is already in use')
	@Returns(EmailDto)
	async findEmail(
		@QueryParams('email') email: string
	): Promise<EmailDto> {
		if (!validateEmail(email)) {
			throw new ApiError({ message: 'Invalid email' }, HTTPStatusCodes.BAD_REQUEST);
		}
		
		const user: UserInstance = await this.authService.getUserByEmail(email, 'email');
		return { email: user ? user.email : null };
	}
}