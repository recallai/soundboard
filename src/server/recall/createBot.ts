import { z } from 'zod';
import { getAppUrl } from '../utils/getAppUrl';
import { getRecallBaseUrl } from './getRecallBaseUrl';
import { randomUUID } from 'crypto';
import { env } from '../../config/env';
import { generateBotToken } from '../utils/jwt';
import { RecallBot, RecallBotSchema } from './Bot';
import { getRecallApiError } from './getRecallApiError';
import { RECALL_URL } from '../../lib/urls';

const CreateBotArgsSchema = z.object({
    meetingUrl: z.string().url(),
});
type CreateBotArgs = z.infer<typeof CreateBotArgsSchema>;

/**
 * Creates a Recall.ai meeting bot
 * This bot is configured to listen for chat messages to the websocket url specified below
 */
export const createBot = async (args: CreateBotArgs): Promise<RecallBot> => {
    const { meetingUrl } = CreateBotArgsSchema.parse(args);

    const clientId = randomUUID();
    const jwtToken = generateBotToken(clientId);

    console.log(
        `Attempting to create a Recall.ai bot for client: ${clientId}`
    );

    const appUrl = getAppUrl();
    const createBotUrl = `${getRecallBaseUrl().toString()}api/v1/bot`;
    const clientWebpageUrl = `${appUrl.toString()}soundboard?clientId=${clientId}`;
    const realtimeEventsUrl = `wss://${appUrl.host}/ws/bot?clientId=${clientId}&token=${jwtToken}`;

    // This is the message that will be sent to the meeting chat when the bot joins
    const onJoinChatMessage = `Hello, someone requested me to join this meeting! I'm a soundboard bot built with ${RECALL_URL}

Once connected, you can play sounds by typing in the chat: !<sound name> (i.e. !hello) or see the list of sounds by typing !list

If you don't want me in this meeting, you can also ask me to leave with !kick`;

    const response = await fetch(createBotUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${env.RECALLAI_API_KEY}`
        },
        body: JSON.stringify({
            meeting_url: meetingUrl,
            bot_name: "Recall.ai Soundboard Bot",
            recording_config: {
                realtime_endpoints: [
                    // This is the websocket endpoint that the bot will receive events from the bot
                    {
                        type: "websocket",
                        url: realtimeEventsUrl,
                        events: ["participant_events.chat_message"]
                    }
                ],
                retention: {
                    type: "timed",
                    hours: 1
                }
            },
            chat: {
                on_bot_join: {
                    send_to: "everyone",
                    pin: true,
                    message: onJoinChatMessage,
                }
            },
            output_media: {
                // This is the webpage that will be displayed in the meeting chat
                // It will be outputted from the bot's tile (not screenshared)
                camera: {
                    kind: "webpage",
                    config: { url: clientWebpageUrl }
                }
            },
            variant: {
                "zoom": "web_4_core",
                "google_meet": "web_4_core",
                "microsoft_teams": "web_4_core",
            }
        })
    });

    switch (response.status) {
        case 507: {
            throw new Error("Bot pool is full. Please try again in a few seconds.");
        }
        case 400: {
            const data = await response.json();
            throw new Error(`${getRecallApiError(data)}`);
        }
        case 429: {
            const data = await response.json();
            const msg = getRecallApiError(data)
            if (msg.includes('concurrent adhoc bots allowed')) {
                throw new Error("Too many soundboard bots are active. Please try again in 30 minutes")
            } else {
                throw new Error('Too many requests to deploy soundboard bots. Please try again in a 1 minute')
            }
        }
        default: {
            break;
        }
    }


    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const responseData = await response.json();
    const botData = RecallBotSchema.parse(responseData);

    console.log('Successfully created bot with ID:', botData.id);

    return botData;
}; 