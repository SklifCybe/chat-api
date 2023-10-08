import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, registerDecorator } from 'class-validator';
import type { ValidatorConstraintInterface, ValidationArguments, ValidationOptions } from 'class-validator';
import type { SignUpDto } from '../../authentication/dto/sign-up.dto';
import { emailExistError } from '../helpers/error-message.helper';
import { UserService } from '../../models/user/user.service';

@Injectable()
@ValidatorConstraint({ name: 'IsEmailUnique', async: true })
export class IsEmailUniqueValidate implements ValidatorConstraintInterface {
    constructor(private readonly userService: UserService) {}

    public async validate(email: string): Promise<boolean> {
        const user = await this.userService.findOneByEmail(email);
        return user === null;
    }

    public defaultMessage(validationArguments: ValidationArguments): string {
        const obj = validationArguments.object as SignUpDto;
        return emailExistError(obj.email);
    }
}

export function IsEmailUnique (options?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            validator: IsEmailUniqueValidate,
        });
    };
};
