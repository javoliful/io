import * as express from 'express';
import * as path from 'path';

export class Routes {

    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
        this.setStaticDir(); // new
    }

    private home(): void {
        this.app.get('/**', (req, res) => {
            return res.sendFile(path.join(__dirname + '/public/index.html'));
        });
    }

    // new
    private setStaticDir(): void {
        this.app.use(express.static(path.join(__dirname, '../views')));

        // TODO: Remove these lines (used to serve any frontend stored in /public)
        this.app.use('/static', express.static('public'));
        this.app.use('/assets', express.static('public/assets'));
    }

    public getRoutes(): void {
        this.home();
    }
}