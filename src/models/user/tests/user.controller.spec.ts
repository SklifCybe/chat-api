import { Test } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import type { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { Order } from '../../../common/constants/order.constant';
import { UserSearchBy } from '../../../common/constants/user-search-by.constant';
import type { PageMetaDto } from '../../../common/dtos/page-meta-dto';
import type { User } from '@prisma/client';
import { PageResponse } from '../../../common/responses/page.response';

const mockUserService = {
    getAll: jest.fn(),
};
const getAllReturn: [User[], PageMetaDto] = [
    [
        {
            id: 'id',
            userName: 'sklif',
            firstName: 'Ilya',
            lastName: 'Strelkovskiy',
            email: 'email@gmail.com',
            avatarUrl: null,
            mailConfirmed: true,
            password: '###123###',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    {
        page: 1,
        limit: 10,
        total: 1,
        offset: 0,
    },
];
const query: PageOptionsDto = {
    limit: 10,
    orderBy: Order.Asc,
    page: 1,
    searchBy: UserSearchBy.Email,
    searchText: '@gmail.com',
};

describe('UserController', () => {
    let userController: UserController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [UserController],
            providers: [{ provide: UserService, useValue: mockUserService }],
        }).compile();

        userController = moduleRef.get<UserController>(UserController);
    });

    describe('getAll', () => {
        it('should call userService.getAll method with all query parameters', async () => {
            mockUserService.getAll.mockResolvedValueOnce(getAllReturn);

            await userController.getAll(query);

            expect(mockUserService.getAll).toHaveBeenCalledWith(query);
        });

        it('should return PageResponse without problem', async () => {
            mockUserService.getAll.mockResolvedValueOnce(getAllReturn);

            const result = await userController.getAll(query);

            expect(result).toBeInstanceOf(PageResponse);
        });
    });
});
