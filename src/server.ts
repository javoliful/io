import {SmartVideo} from './smartvideo/app';
import {Routes} from './routes/routes';
import {HeartBeat} from './monitoring/heartbeat';

// Really the smartvideo io app
const app = new SmartVideo().getApp();

// Root head
const heartbeat = new HeartBeat(app, '/');
heartbeat.getRoute();

// Static routes to serve public and assets folders. TODO: Remove when not needed
const route = new Routes(app);
route.getRoutes();

export {app};