import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [UserModule, CloudinaryModule],
    controllers: [UserProfileController],
    providers: [UserProfileService],
})
export class UserProfile {}
