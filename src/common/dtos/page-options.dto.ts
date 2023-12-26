import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { Order } from '../../common/constants/order.constant';
import { Type } from 'class-transformer';
import { UserSearchBy } from '../constants/user-search-by.constant';

export class PageOptionsDto {
    @ApiPropertyOptional({ enum: Order, default: Order.Asc })
    @IsEnum(Order)
    @IsOptional()
    public readonly orderBy: Order = Order.Asc;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsPositive()
    @IsOptional()
    public readonly page: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsPositive()
    @IsOptional()
    public readonly limit: number = 10;

    @ApiPropertyOptional({ enum: UserSearchBy, default: UserSearchBy.UserName })
    @IsEnum(UserSearchBy)
    @IsOptional()
    public readonly searchBy: UserSearchBy = UserSearchBy.UserName;

    @ApiPropertyOptional({ example: 'hello' })
    @IsString()
    @IsOptional()
    public readonly searchText: string;
}
