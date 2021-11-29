export class Room {
    public roomName: string;
    public ownerId: string;
    public users: string[];

    constructor(roomName: string, ownerId: string, users: string[]) {
        this.roomName = roomName;
        this.ownerId = ownerId;
        this.users = users;
    }
}