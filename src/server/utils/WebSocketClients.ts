import { WebSocket } from 'ws';

export type ConnectionType = 'client' | 'bot';

/**
 * A map of all the websocket connections to clients and bots.
 * This stores the websocket connection for each client and bot by a unique id.
 */
export class WebSocketClients {
    private store: Map<string, WebSocket> = new Map<string, WebSocket>();

    private getKey(type: ConnectionType, id: string): string {
        return `${type}:${id}`;
    }

    add(type: ConnectionType, id: string, ws: WebSocket) {
        const key = this.getKey(type, id);
        this.store.set(key, ws);
    }

    get(type: ConnectionType, id: string): WebSocket | undefined {
        const key = this.getKey(type, id);
        return this.store.get(key);
    }

    delete(type: ConnectionType, id: string) {
        const key = this.getKey(type, id);
        this.store.delete(key);
    }
} 