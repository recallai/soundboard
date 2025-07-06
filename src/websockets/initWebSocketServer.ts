import { WebSocketServer, WebSocket, RawData } from 'ws';
import { Server } from 'http';
import { fetchFirstSoundUrl } from '@/utils/fetchFirstSoundUrl';
import { URL } from 'url';
import { ChatMessageEventSchema } from '@/recall/ChatMessageEventSchema';
import { WebSocketClients } from '@/websockets/WebSocketClients';

const showFullWsMessages = process.env.SEE_FULL_WS_MESSAGES?.toLowerCase() === 'true';

// A map of all the websocket connections
const wsConnections = new WebSocketClients();

const logWsMsg = (args: { clientId: string, source: 'bot-ws' | 'client-ws' | 'server', message: string }) => {
    const clientIdMsg = args.clientId ? `[${args.source}: ${args.clientId}]` : '';
    console.log(`${clientIdMsg} ${args.message}`.trim());
}

/**
 * Creates the websocket server
 */
export function initWebSocketServer(server: Server) {
    const wss = new WebSocketServer({ noServer: true });

    // --- Create a new websocket connection for each client ---
    wss.on('connection', (ws: WebSocket, req) => {
        const { pathname, searchParams } = new URL(
            req.url || '',
            `wss://${req.headers.host}`
        );
        if (pathname === '/ws/bot') {
            const clientId = searchParams.get('clientId');
            if (clientId) {
                logWsMsg({ clientId, source: 'bot-ws', message: 'Bot connected' });

                // Saves the websocket connection to the map for bot ws to reference later
                wsConnections.add('bot', clientId, ws);

                handleBotConnection(ws, clientId);
            } else {
                ws.close(1011, 'Missing clientId for bot connection.');
            }
        } else if (pathname === '/ws/client') {
            const clientId = searchParams.get('clientId');
            if (clientId) {
                logWsMsg({ clientId, source: 'client-ws', message: 'Client connected' });

                // Saves the websocket connection to the map for client ws to reference later
                wsConnections.add('client', clientId, ws);

                handleClientConnection(ws, clientId);
            } else {
                ws.close(1011, 'Missing clientId for bot connection.');
            }
        } else {
            logWsMsg({ clientId: '', source: 'server', message: 'Invalid path' });
            ws.close(1011, 'Invalid path. Please use /ws/bot or /ws/client.');
        }
    });

    // --- Handle WebSocket connections for our specific websocket paths ---
    server.on('upgrade', (request, socket, head) => {
        const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);

        // Only handle upgrades for our specific websocket paths
        if (pathname.startsWith('/ws/')) {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        } else {
            // For other paths (like Vite's HMR), destroy the socket to prevent errors.
            socket.destroy();
        }
    });

    const colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        green: '\x1b[32m',
        cyan: '\x1b[36m',
    };

    console.log(`${colors.green}${colors.bright}🔌 WebSocket Server Initialized${colors.reset} ${colors.cyan}(Bot & Client connections ready)${colors.reset}`);
}

/**
 * Manages a Recall bot connection. 
 * It listens for chat messages sent in chat, then sends the resulting sound URL to the specified client.
 * @param ws The WebSocket instance for the bot.
 * @param clientId The ID of the client that this bot is associated with.
 */
function handleBotConnection(ws: WebSocket, clientId: string) {
    ws.on('close', () => {
        logWsMsg({ clientId, source: 'bot-ws', message: `Bot disconnected` });
        wsConnections.delete('bot', clientId);
    });

    ws.on('error', (error) => {
        logWsMsg({ clientId, source: 'bot-ws', message: `Bot WebSocket error. error: ${error}` });
        wsConnections.delete('bot', clientId);
    });

    ws.on('message', async (message: RawData) => {
        try {
            // Get the parsed websocket message
            const rawMessage = JSON.parse(message.toString());
            const parsedMessage =
                ChatMessageEventSchema.safeParse(rawMessage);
            if (!parsedMessage.success) {
                logWsMsg({ clientId, source: 'bot-ws', message: `Received invalid message from bot. action: ${rawMessage?.data?.action}` });
                if (showFullWsMessages) {
                    logWsMsg({ clientId, source: 'bot-ws', message: JSON.stringify(rawMessage, null, 2) });
                }
                return;
            } else {
                logWsMsg({ clientId, source: 'bot-ws', message: `Received action from bot: ${parsedMessage.data.data.data.action}` });
                if (showFullWsMessages) {
                    logWsMsg({ clientId, source: 'bot-ws', message: JSON.stringify(rawMessage, null, 2) });
                }
            }

            // Get the message sent to the meeting chat
            const chatData = parsedMessage.data.data.data.data;
            if (!chatData) {
                return;
            }
            const command = chatData.text.trim();

            logWsMsg({ clientId, source: 'bot-ws', message: `${parsedMessage.data.data.data.participant.name ?? 'Unknown Participant'} sent to chat: ${command}` });

            // Check if the command starts with our trigger character '!'
            if (command.startsWith('!')) {
                const searchTerm = command.substring(1);
                if (searchTerm) {
                    logWsMsg({ clientId, source: 'bot-ws', message: `Client ${clientId} triggered sound with command: ${command}` });
                    const audioUrl = await fetchFirstSoundUrl(searchTerm);
                    logWsMsg({ clientId, source: 'bot-ws', message: `Sending audio URL to client: ${audioUrl}` });
                    sendMsgToClient({ clientId, data: { type: 'audio', payload: { audioUrl } } });
                }
            }
        } catch (error) {
            logWsMsg({ clientId, source: 'bot-ws', message: `Error processing bot message for client ${clientId}: ${error}` });
        }
    });
}

/**
 * Manages a browser client connection which the bot will be casting in the meeting. 
 * This only receives and logs messages from the client.
 * It also cleans up the websocket connection when the client errors/disconnects.
 * @param ws The WebSocket instance for the browser client.
 */
function handleClientConnection(ws: WebSocket, clientId: string) {
    ws.on('close', () => {
        logWsMsg({ clientId, source: 'client-ws', message: `Client disconnected` });
        wsConnections.delete('client', clientId);
    });
    ws.on('error', (error) => {
        logWsMsg({ clientId, source: 'client-ws', message: `Client WebSocket error. error: ${error}` });
        wsConnections.delete('client', clientId);
    });

    ws.on('message', async (message: RawData) => {
        logWsMsg({ clientId, source: 'client-ws', message: `Received message from client: ${message.toString()}` });
    });
}


/**
 * Sends a message to a single client.
 * @param clientId The unique ID of the target client.
 * @param data The message object to send.
 */
export function sendMsgToClient(args: { clientId: string, data: object }) {
    const { clientId, data } = args;
    const client = wsConnections.get('client', clientId);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
        logWsMsg({ clientId, source: 'bot-ws', message: `Sent message to client` });
    } else {
        logWsMsg({ clientId, source: 'bot-ws', message: `Client ${clientId} not found or not open, message not sent.` });
    }
} 
