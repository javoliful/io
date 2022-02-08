import { Room } from '../model/room';
import { RoomRepository } from '../repositories/roomRepository';
import { Socket } from 'socket.io';

export class ShareScreenListener {
  private socket: Socket;
  private roomsRepository: RoomRepository;
  private event: string;

  constructor(socket: Socket, roomsRepository: RoomRepository) {
    this.event = 'share-screen';
    this.socket = socket;
    this.roomsRepository = roomsRepository;
    this.addListener();
  }

  private addListener(): void {
    this.socket.on(this.event, (roomId, userId, metadata, stream) => {
      this.handle(roomId, userId, metadata, stream);
    });
  }

  public async handle(
    roomId: string,
    userId: string,
    metadata: any,
    stream: MediaStream
  ) {
    console.log('Event ', this.event);
    console.log('tupu');
    stream
      ? console.log('Stream ', stream)
      : console.error('No Stream Available');

    const room = await this.roomsRepository.getRoom(roomId);
    if (!room) {
      //  room = new Room(metadata.roomName, userId, [userId]);
      this.socket.emit('error', {
        code: 'no-room',
        description: "This room doesn't exist.",
      });
    } else {
      const { userName } = metadata;
      const { roomName } = room;
      this.socket
        .to(roomId)
        .emit('sharing-screen', userId, { roomName, userName }, stream);
    }
  }
}