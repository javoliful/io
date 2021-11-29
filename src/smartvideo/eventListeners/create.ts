import {Room} from '../model/room';
import {RoomRepository} from '../repositories/roomRepository';
import {Socket} from 'socket.io';

export class CreateRoomListener {
    private socket: Socket;
    private roomsRepository: RoomRepository;
    private event: string;

    constructor(socket: Socket, roomsRepository: RoomRepository) {
        this.event = 'create-room';
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

        
        let existRoom = await this.roomsRepository.getRoom(roomId);
        if (existRoom) {
            this.socket.emit('error', { "code": "exist-room", "description": "This room already exist.", "ownerId": existRoom.ownerId });
        } else {

            const userName = metadata && metadata.userName ? metadata.userName : null;
            const roomName = metadata && metadata.roomName ? metadata.roomName : null;

            const room = new Room(roomName, userId, [userId]);
            this.roomsRepository.setRoom(roomId, room);

            console.log(`User (${userId}) "${userName}" created "${roomName}" (${roomId})`);
            this.socket.join(roomId);

            this.socket.on('disconnect', () => {
                this.socket.to(roomId).emit('user-disconnected', userId, { roomName, userName });
                console.log(`User (${userId}) "${userName}" left "${roomName}" (${roomId}) (disconnected)`);
            });
        }
    }
}