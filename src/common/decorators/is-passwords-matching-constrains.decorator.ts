import { ValidatorConstraint } from 'class-validator';
import type { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import type { SignUpDto } from '../../authentication/dto/sign-up.dto';
import { PASSWORD_MISMATCH } from '../constants/error-messages.constant';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstrains implements ValidatorConstraintInterface {
    public validate(passwordRepeat: string, validationArguments: ValidationArguments): boolean {
        const obj = validationArguments.object as SignUpDto;
        return obj.password === passwordRepeat;
    }

    public defaultMessage(): string {
        return PASSWORD_MISMATCH;
    }
}
