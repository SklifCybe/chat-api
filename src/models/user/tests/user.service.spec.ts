import { Test } from '@nestjs/testing';
import { CacheManagerModule } from '../../../models/cache-manager/cache-manager.module';
import { ConfigModule } from '@nestjs/config';
import { RedisProviderModule } from '../../../providers/redis/provider.module';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { CacheManagerService } from '../../../models/cache-manager/cache-manager.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';
import {
    mockSignUpDto,
    mockUserReturn,
    hashedPassword,
    salt,
    mockUserRepository,
    id,
    mockUserUpdateFields,
    mockUpdateFieldsWithPassword,
} from './mocks/user.service.mock';
import type { UpdateUserFields } from '../../../common/types/configuration-user.type';

jest.mock('bcrypt', () => ({
    hash: jest.fn(() => hashedPassword),
    genSalt: jest.fn(() => salt),
}));

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CacheManagerModule, RedisProviderModule, ConfigModule.forRoot({ isGlobal: true })],
            providers: [
                UserService,
                CacheManagerService,
                AuthenticationConfigService,
                { provide: UserRepository, useValue: mockUserRepository },
            ],
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
    });

    describe('create', () => {
        mockUserRepository.create.mockResolvedValue(mockUserReturn);

        it('should return user', async () => {
            const user = await userService.create(mockSignUpDto);

            expect(user).toEqual(mockUserReturn);
        });

        it('method hashPassword should be called with password from dto', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');

            await userService.create(mockSignUpDto);

            expect(hashPassword).toHaveBeenCalledWith(mockSignUpDto.password);
        });

        it('method create from userRepository should be called with correct arguments', () => {
            const { firstName, lastName, email } = mockSignUpDto;
            const { password: hashedPassword } = mockUserReturn;

            expect(mockUserRepository.create).toHaveBeenCalledWith(firstName, lastName, email, hashedPassword);
        });

        it('should return null if hashPassword return null', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');
            hashPassword.mockImplementation(() => null);

            const user = await userService.create(mockSignUpDto);

            expect(user).toBeNull();
        });
    });

    describe('update', () => {
        it('should call userRepository.update without hashed password without problem', async () => {
            await userService.update(id, mockUserUpdateFields);

            expect(mockUserRepository.update).toHaveBeenCalledWith(id, mockUserUpdateFields);
        });

        it('should call userRepository.update with hashed password without problem', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');
            const received = {
                ...mockUpdateFieldsWithPassword,
                password: hashedPassword,
            };

            hashPassword.mockImplementation(() => hashedPassword);

            await userService.update(id, mockUpdateFieldsWithPassword);

            expect(mockUserRepository.update).toHaveBeenCalledWith(id, received);
        });

        it('should return null because hashPassword throw exception', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');
            const updateFields: UpdateUserFields = {
                ...mockUpdateFieldsWithPassword,
                password: hashedPassword,
            };

            hashPassword.mockImplementation(() => null);

            const user = await userService.update(id, updateFields);

            expect(user).toBeNull();
        });
    });

    it('findOneById should call findOne method with correct id', async () => {
        const { id } = mockUserReturn;

        await userService.findOneById(id);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith(id);
    });

    it('findOneByEmail should call findOne method with correct email', async () => {
        const { email } = mockUserReturn;

        await userService.findOneByEmail(email);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith(email);
    });

    it('remove should call remove method with correct id', async () => {
        const { id } = mockUserReturn;

        await userService.remove(id);

        expect(mockUserRepository.remove).toHaveBeenCalledWith(id);
    });

    it('confirm should call confirm method with correct id', async () => {
        const { id } = mockUserReturn;

        await userService.confirm(id);

        expect(mockUserRepository.findOne).toHaveBeenCalledWith(id);
    });
});
