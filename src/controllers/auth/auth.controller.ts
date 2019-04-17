import { Controller } from "@tsed/common";
import { AuthService } from "src/services/auth/auth.service";


@Controller('/auth')
export class AuthController {
	constructor(
		private authService: AuthService
	) {

	}
}