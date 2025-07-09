import { WebSocket } from 'ws';
import { verifyBotToken } from '../server/utils/jwt';

export type ConnectionType = 'client' | 'bot';

/**
 * A unified store for websocket connections and bot secrets.
 * Uses different key prefixes to separate different types of data.
 * This prepares for eventual Redis migration where everything will be in one key-value store.
 */
export class WebSocketClients {
    private store: Map<string, WebSocket | string> = new Map<string, WebSocket | string>();

    private getConnectionKey(type: ConnectionType, id: string): string {
        return `${type}:${id}`;
    }



    add(type: ConnectionType, id: string, ws: WebSocket) {
        const key = this.getConnectionKey(type, id);
        this.store.set(key, ws);
    }

    get(type: ConnectionType, id: string): WebSocket | undefined {
        const key = this.getConnectionKey(type, id);
        const value = this.store.get(key);
        return value instanceof WebSocket ? value : undefined;
    }

    delete(type: ConnectionType, id: string) {
        const key = this.getConnectionKey(type, id);
        this.store.delete(key);
    }

    /**
     * Validates a bot's JWT token during connection
     * JWTs are self-contained and don't need to be stored - they're verified cryptographically
     * @param clientId The client ID that the bot claims to be associated with
     * @param token The JWT token provided by the bot
     * @returns true if the token is valid and matches the client ID, false otherwise
     */
    validateBotToken(clientId: string, token: string): boolean {
        const payload = verifyBotToken(token);
        if (!payload) {
            return false;
        }

        // Ensure the token's clientId matches the claimed clientId
        return payload.clientId === clientId;
    }
}

const wsConnections = new WebSocketClients();

export { wsConnections };
