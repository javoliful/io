import {RoomRepository} from 'smartvideo/repositories/roomRepository';
import {Socket} from 'socket.io';

export class LeaveRoomListener {
    private socket: Socket;
    private roomsRepository: RoomRepository;
    private event = 'leave-room';

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
            roomName = room.roomName;
            room.users = room.users.filter((id: any) => id !== userId);
            this.roomsRepository.setRoom(roomId, room);
        }

        this.socket.to(roomId).emit('user-disconnected', userId, {roomName, userName});
        console.log(`User (${userId}) "${userName}" left "${roomName}" (${roomId})`);

        await this.roomsRepository.deleteIfEmpty(roomId);
    }
}
