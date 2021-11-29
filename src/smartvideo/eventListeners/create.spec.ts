import {CreateRoomListener} from './create';
import {Socket} from 'socket.io';
import {RoomRepository} from '../repositories/roomRepository';
import {Mock} from "moq.ts";
import {Room} from 'smartvideo/model/room';


const userId = 'thisistheuserid';
const userName = 'thisistheusername';
const roomId = '156464adf354';
const roomName = 'MyCoolRoom';

const socketMock = new Mock<Socket>();
const repositoryMock = new Mock<RoomRepository>();

const socket = socketMock.object();
socket.on = jest.fn();
socket.join = jest.fn();

const repository = repositoryMock.object();
repository.setRoom = jest.fn((currentRoomId: string, room: Room) => {
    expect(currentRoomId).toEqual(roomId);
    expect(room.ownerId).toEqual(userId);
    expect(room.roomName).toEqual(roomName);
    expect(room.users).toEqual([userId]);
});

const listener = new CreateRoomListener(socket, repository);
listener.handle(roomId, userId, {userName, roomName});

test('should save the room', () => {
    expect(repository.setRoom).toHaveBeenCalledTimes(1);
});

test('should join the room', () => {
    expect(socket.join).toHaveBeenCalledTimes(1);
    expect(socket.join).toHaveBeenCalledWith(roomId);
});

test('add 2 event listeners', () => {
    expect(socket.on).toHaveBeenCalledTimes(2);
});