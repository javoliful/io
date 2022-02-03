import {Room} from '../model/room';
import {RoomRepository} from './roomRepository';
import * as dotenv from "dotenv";

dotenv.config();
import {RedisClient} from 'redis';


export class RedisRepository implements RoomRepository {
    redis = require('redis');
    asyncRedis = require("async-redis");
    private client: RedisClient;

    private rooms: Map<string, Room>;
    private asyncRedisClient;

    constructor() {
        this.rooms = new Map();
        // process.env.REDIS_URL ? process.env.REDIS_URL : 'redis://localhost:6379',
        // this.client = this.redis.createClient(
        //     process.env.REDIS_URL ? process.env.REDIS_URL : 'redis://redis-auth',
        //     { no_ready_check: false });
        // console.log('redis connecting prod');
        //  this.client = this.redis.createClient({
        //         host: 'redis-10718.c11.us-east-1-3.ec2.cloud.redislabs.com',
        //         port: 10718,
        //         password: 'viIACiBLmxH5brg9WnAyfQO3YDPafADe'
        // }
        // );

        console.log('redis connecting develop');
         this.client = this.redis.createClient({
                host: 'redis-15288.c278.us-east-1-4.ec2.cloud.redislabs.com',
                port: 15288,
                password: 'BG1ooOceDgaxZ6qsPhAqMBg2uPKB5cuz'
        }
        );
        
      
        this.client.on('error', function (err) {
            console.log('redis fail');
            console.log(err);
        });
        this.client.on('ready', function () {
            console.log('redis is running');
        });
      //  this.client.select(process.env.REDIS_DB ? Number(process.env.REDIS_DB) : 7);

        this.asyncRedisClient = this.asyncRedis.decorate(this.client);
    }

    public async getRoom(roomId: string): Promise<Room | null> {
        const res = await this.asyncRedisClient.get(roomId);
        if (res !== null) {
            const data = JSON.parse(res);
            return new Room(data.roomName, data.ownerId, data.users);
        } else {
            return res;
        }
    }


    public setRoom(roomId: string, value: Room): void {
        console.log("creando");
        this.client.setex(roomId, 86400, JSON.stringify(value));
    }

    public async deleteIfEmpty(roomId: string): Promise<void> {
        const room = await this.getRoom(roomId);
        console.log('Room', room);
        
        const users = room?.users.length;
        console.log(users + ' in Room: ' + roomId);
        if (room && room.users.length === 0) {
            console.log('Room deleted because is empty: ', roomId);
            this.client.DEL(roomId);
        }
    }
    public async deleteRoom(roomId: string): Promise<void> {
        const room = await this.getRoom(roomId);
        console.log('Room', room);
      
        const users = room?.users.length;
        console.log(users + ' in Room: ' + roomId);
        if (room) {
            console.log('Room deleted because is forced: ', roomId);
            this.client.DEL(roomId);
        }
    }

    public getRooms(): Map<string, Room> {
        return this.rooms;
    }
}
