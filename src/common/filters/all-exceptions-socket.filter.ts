import type { ArgumentsHost } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { PacketType } from 'socket.io-parser';

@Catch()
export class AllExceptionsSocketFilter extends BaseWsExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const client = host.switchToWs().getClient();
        client.packet({
            type: PacketType.ACK,
            data: [{ message: exception.message }],
            id: client.nsp._ids++,
        });
    }
}
