import {Server} from 'socket.io';
import {RedisRepository} from '../repositories/RedisRepository';
import {RoomRepository} from '../repositories/roomRepository';
import {CreateRoomListener} from './create';
import {JoinRoomListener} from './join';
import {LeaveRoomListener} from './leave';
import { DisconnectListener } from './disconnect';
import {DeleteRoomListener} from './delete';

export class SocketIoSubscriber {
    private roomsRepository: RoomRepository;

    constructor() {
        this.roomsRepository = new RedisRepository();
    }

    public subscribe(io: Server): void {
        io.on('connection', (socket) => {
            console.log('Connected ', socket.id);
            const createListener = new CreateRoomListener(socket, this.roomsRepository);
            const joinListener = new JoinRoomListener(socket, this.roomsRepository);
            const leaveListener = new LeaveRoomListener(socket, this.roomsRepository);
            const deleteListener = new DeleteRoomListener(socket, this.roomsRepository);
            const disconnectListener = new DisconnectListener(io, socket);
           
        })
    }
}