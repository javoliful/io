import {Room} from '../model/room';

export interface RoomRepository {
    getRoom(roomId: string): Promise<Room | null>;

    setRoom(roomId: string, value: Room): void;

    deleteIfEmpty(roomId: string): Promise<void>;

    getRooms(): Map<string, Room>;
}
