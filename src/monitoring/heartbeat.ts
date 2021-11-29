import * as express from 'express';

export class HeartBeat {

    private app: express.Application;
    private path: string;

    constructor(app: any, path: string) {
        this.app = app;
        this.path = path;
    }

    private config(): void {
        this.app.head(this.path, this.handle);
    }

    public handle(req: any, res: any): void {
        console.log('Ping received');
        res.sendStatus(204);
    }

    public getRoute(): void {
        this.config();
    }
}