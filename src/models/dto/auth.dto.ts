import { IsEmail, IsNotEmpty as Required, MinLength } from 'class-validator';
import { JsonProperty } from "@tsed/common";
import { prop } from 'typegoose';

export class AuthToken {
    @prop() accessToken: string;
    //@prop({ enum: AuthProviderEnum }) provider: AuthProviderEnum;
}

export interface IAuthProviderProfileDto {
    firstName: string;
    lastName: string;
    picture?: string;
    email: string;
    password?: string;
    facebook?: string;
    tokens?: AuthToken[];
}

export class AuthDto {
	@JsonProperty()
    token: string;
    // Time to expiration specified in EPOC ms
    @JsonProperty()
    expires: string;
}

export class LoginDto {
    @JsonProperty()
    @IsEmail()
    @Required()
    email: string;

    @JsonProperty()
    @Required()
    @MinLength(6)
    password: string;
}

export class SignupDto {
    @IsEmail()
    @Required()
    @JsonProperty()
    email: string;

    @JsonProperty()
    @Required()
    @MinLength(6)
    password: string;

    @JsonProperty()
    @Required()
    firstName: string;

    @JsonProperty()
    @Required()
    lastName: string;
}