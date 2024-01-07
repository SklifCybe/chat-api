import { ConflictException, Injectable } from '@nestjs/common';
import { ValidatorConstraint, registerDecorator } from 'class-validator';
import type { ValidatorConstraintInterface, ValidationOptions } from 'class-validator';
import { userNameExistError } from '../helpers/error-message.helper';
import { UserService } from '../../models/user/user.service';

// todo: look like duplicate with IsEmailUnique
@Injectable()
@ValidatorConstraint({ name: 'IsUserNameUnique', async: true })
export class IsUserNameUniqueValidate implements ValidatorConstraintInterface {
    constructor(private readonly userService: UserService) {}

    public async validate(userName: string): Promise<boolean> {
        const user = await this.userService.findOneByUserName(userName);

        if (user) {
            throw new ConflictException(userNameExistError(userName));
        }

        return true;
    }
}

export function IsUserNameUnique(options?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            validator: IsUserNameUniqueValidate,
        });
    };
}
