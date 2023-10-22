import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CacheManagerModule } from '../../../models/cache-manager/cache-manager.module';
import { ConfigModule } from '@nestjs/config';
import { RedisProviderModule } from '../../../providers/redis/provider.module';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { CacheManagerService } from '../../../models/cache-manager/cache-manager.service';
import { AuthenticationConfigService } from '../../../config/authentication/config.service';
import { mockSignUpDto, mockUserReturn, mockHashedPassword, mockSalt } from './mocks/user.service.mock';

jest.mock('bcrypt', () => ({
    hash: jest.fn(() => mockHashedPassword),
    genSalt: jest.fn(() => mockSalt),
}));

describe('UserService', () => {
    let userService: UserService;
    const mockUserRepository = {
        create: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        confirm: jest.fn(),
    };

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

        it('should throw a BadRequestException if hashing fails', async () => {
            const hashPassword = jest.spyOn(userService as any, 'hashPassword');
            hashPassword.mockImplementation(() => null);

            await expect(userService.create(mockSignUpDto)).rejects.toThrow(BadRequestException);
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
