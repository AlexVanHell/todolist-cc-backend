import { Typegoose, pre, prop, instanceMethod, InstanceType, ModelType } from 'typegoose'
import { JsonProperty, registerFactory } from '@tsed/common';
import * as bcrypt from 'bcrypt-nodejs';
import { UserRepositoryToken } from './token-constants';

@pre<User>('save', preSaveHook)
export class User extends Typegoose {
	@prop({ unique: true })
	@JsonProperty()
	email: string;

	@prop()
	@JsonProperty()
	password: string;

	@prop()
	@JsonProperty()
	firstName: string;

	@prop()
	@JsonProperty()
	lastName: string;

	@prop({ unique: true })
	@JsonProperty()
	username: string;

	@prop()
	@JsonProperty()
	secondLastName: string;

	@prop()
	@JsonProperty()
	picture: string;

	@prop()
	@JsonProperty()
	get fullName() {
		return `${this.firstName} ${this.lastName}`
	}

	@instanceMethod
    matchPassword(candidatePassword: string) {
        return new Promise((resolve) => {
            bcrypt.compare(String(candidatePassword), this.password, (err, isMatch) => {
                if (err || !isMatch) return resolve(false);

                resolve(true);
            });
        });
    }
}

async function preSaveHook(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(String(user.password), salt, null, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
}

export type UserInstance = InstanceType<User>;
export type UserRepository = ModelType<User>;
registerFactory(UserRepositoryToken, new User().getModelForClass(User))