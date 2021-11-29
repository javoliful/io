import * as express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import {SocketIoSubscriber} from './eventListeners/subscriber';

export class SmartVideo {

    public static readonly PORT = 3000;
    private app: express.Application;
    private port: string | number;

    constructor() {
        this.app = express();
        this.app.use(express.static('public'));
        this.port = process.env.PORT || SmartVideo.PORT;
        const httpServer = createServer(this.app);

        httpServer.listen(this.port, () => {
            console.log('Running smartvideo-io on port %s', this.port);
            let io = new Server(httpServer, {});
            const subscriber = new SocketIoSubscriber();
            subscriber.subscribe(io);
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}