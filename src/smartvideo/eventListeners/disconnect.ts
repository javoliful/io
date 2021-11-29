import {Server, Socket} from 'socket.io';

export class DisconnectListener {
    private io: Server;
    private socket: Socket;
    private event = 'disconnect';

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.addListener();
    }

    private addListener(): void {
        // TODO: Check compatibility with socket.io > 4.0.0
        // this.io.on(this.event, (reason: string | null) => {
        //     this.handle(reason);
        // });
        this.socket.on(this.event, () => {
            this.handle(null);
        });
    }

    public handle(reason: string | null): void {
        console.log('Socket ', this.socket.id, ' disconnected because of: ', reason);
    }
}