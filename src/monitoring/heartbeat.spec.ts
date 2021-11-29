import {HeartBeat} from './heartbeat';

const app = {
    head: jest.fn(),
    listen: jest.fn()
}
jest.doMock('express', () => {
    return () => {
        return app
    }
});

const heartbeat = new HeartBeat(app, '/');
heartbeat.getRoute();

test('should call head when get route', () => {
    expect(app.head).toHaveBeenCalledTimes(1);
});

const req = {};
const res = {
    sendStatus: jest.fn()
};
heartbeat.handle(req, res);
test('should return 204', () => {
    expect(res.sendStatus).toHaveBeenCalledTimes(1);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
});