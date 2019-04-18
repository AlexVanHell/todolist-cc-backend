import { Controller, Post, BodyParams, Request, Response, Next, Status } from "@tsed/common";
import { AuthService } from "src/services/auth/auth.service";
import { AuthDto, SignupDto, LoginDto } from "src/models/dto/auth.dto";
import { Returns } from "@tsed/swagger";
import { NextFunction } from "express-serve-static-core";
import { Validate, Validator } from 'typescript-param-validator';

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
	) {
		try {
			const auth = await this.authService.authenticateLocal(body.email, body.password);

			res.json(auth);
		} catch (err) {
			res.json(err)
		}
	}

	@Post('/signup')
	@Returns(AuthDto)
	@Status(201)
	@Validate()
	async signup(
		@Validator() @BodyParams() body: SignupDto
	) {
		const user = await this.authService.createUser(body);
		const authData = await this.authService.authenticateLocal(user.email, body.password);

		return authData;
	}
}