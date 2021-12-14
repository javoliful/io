import {RoomRepository} from 'smartvideo/repositories/roomRepository';
import {Socket} from 'socket.io';
import { Room } from '../model/room';

export class DeleteRoomListener {
    private socket: Socket;
    private roomsRepository: RoomRepository;
    private event = 'delete-room';

    constructor(socket: Socket, roomsRepository: RoomRepository) {
        this.socket = socket;
        this.roomsRepository = roomsRepository;
        this.addListener();
    }

    private addListener(): void {
        this.socket.on(this.event, (roomId, userId, metadata) => {
            this.handle(roomId, userId, metadata);
        });
    }

    public async handle(roomId: string, userId: string, metadata: any) {
        console.log('Event ', this.event);

        const userName = metadata && metadata.userName ? metadata.userName : null;
        let roomName = metadata && metadata.roomName ? metadata.roomName : null;

        let room: any = await this.roomsRepository.getRoom(roomId);
        if (room) {
            await this.roomsRepository.deleteRoom(roomId);
            console.log(`Room ("${roomName}" (${roomId}) was deleted`);
            
        }  

      
    }
}
