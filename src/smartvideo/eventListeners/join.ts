import {Room} from '../model/room';
import {RoomRepository} from '../repositories/roomRepository';
import {Socket} from 'socket.io';

export class JoinRoomListener {
    private socket: Socket;
    private roomsRepository: RoomRepository;
    private event = 'join-room';

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
        console.log("roomId:", roomId);
        console.log("userId:", userId);
        console.log("metadata:", metadata);
        const userName = metadata && metadata.userName ? metadata.userName : null;
        
        let room = await this.roomsRepository.getRoom(roomId);
        console.log('Room Before: ',room )
        console.log('Room Users Before: ', room?.users.length )
        if (!room) {
            //  room = new Room(metadata.roomName, userId, [userId]);
            this.socket.emit('error', {"code": "no-room", "description": "This room doesn't exist."});
        } else {
            const roomName = room.roomName;
            if (room.users.length >= 100000000000) {
                this.socket.emit('error', {"code": "max-participants", "description": "This room full."});
            } else {

                if (!room.users.includes(userId)) {
                    room.users.push(userId);
                }

                this.roomsRepository.setRoom(roomId, room);

                console.log(`User (${userId}) "${userName}" joined "${roomName}" (${roomId})`);

                this.socket.join(roomId);
                this.socket.to(roomId).emit('user-connected', userId, {roomName, userName});

                this.socket.on('disconnect', () => {
                    this.socket.to(roomId).emit('user-disconnected', userId, {roomName, userName});
                    console.log(`User (${userId}) "${userName}" left "${roomName}" (${roomId}) (disconnected)`);
                });
            }
        }
    }

}