import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";

import { User } from "../classes/User.ts";
import WebsocketManager from "../ws/WebsocketManager.ts";
import Message from "../classes/Message.ts";
import RESTapi from "../rest/REST.ts";
import { Channel, TextChannel, VoiceChannel } from "../classes/Channel.ts";
import { TextChannelType } from "../constants/enums.ts";
import * as logs from "../utilities/logging.ts";
import ClientOptions from "../interfaces/ClientOptions.ts";
import Guild from "../classes/Guild.ts";

export default class Client extends EventEmitter<{
    ready (): any
    messageCreate (message: Message): any
}>{
    token!: string;
    intents!: number;
    socket: WebsocketManager = new WebsocketManager(this);
    public user!: User;
    public rest!: RESTapi;
    public channels: Map<string,Channel | TextChannel | VoiceChannel> = new Map<string,Channel | TextChannel | VoiceChannel>;
    public guilds: Map<string,Guild> = new Map<string,Guild>;

    constructor(token: string,options: ClientOptions) {
        super();
        this.token = token;
        this.rest = new RESTapi(this,{
            "Content-Type": "application/json",
            "Authorization": `Bot ${this.token}`
        });
        if (typeof(options.intents) === "number") {
            this.intents = options.intents;
        } else {
            this.intents = options.intents.reduce((a,b) => a + b,1);
        }
    }

    async getChannel(id?: string) : Promise<Channel |  TextChannel | VoiceChannel | undefined> {
        if (!id) return;
        let channel = this.channels.get(id);

        if (channel !== undefined) {
            return channel;
        }

        const channelDataResponse = await this.rest.request(`channels/${id}`,"GET");
        const channelData = await channelDataResponse.json();

        if (channelData.code) {
            logs.error(channelData);
            return;
        }
    
        if (Object.values(TextChannelType).includes(channelData.type)) {
            channel = new TextChannel(channelData);
        } else {
            channel = new VoiceChannel(channelData);
        }
    
        this.channels.set(id,channel);

        return channel;
    }

    async getGuild(id?: string) : Promise<Guild | undefined> {
        if (!id) return;
        let guild = this.guilds.get(id);

        if (guild !== undefined) {
            return guild;
        }

        const guildDataResponse = await this.rest.request(`guilds/${id}`,"GET");
        const guildData = await guildDataResponse.json();

        if (guildData.code) {
            logs.error(guildData);
            return;
        }
    
        guild = new Guild(guildData);
    
        this.guilds.set(id,guild);

        return guild;
    }

    connect() {
        this.socket.connect(this.token);
    }
}