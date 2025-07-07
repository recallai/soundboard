
import { z } from 'zod';
import { getAppUrl } from '@/utils/getAppUrl';
import { getRecallBaseUrl } from '@/recall/getRecallBaseUrl';
import { randomUUID } from 'crypto';
import { env } from '@/config/env.mjs';
import { generateBotToken } from '@/utils/jwt';

const CreateBotInputSchema = z.object({
    meetingUrl: z.string().url(),
});
type CreateBotInput = z.infer<typeof CreateBotInputSchema>;

export const RecallBotResponseSchema = z.object({
    id: z.string()
});
export type RecallBotResponse = z.infer<typeof RecallBotResponseSchema>;

/**
 * Creates a Recall.ai meeting bot
 * This bot is configured to listen for chat messages to the websocket url specified below
 */
export const createBot = async (args: CreateBotInput): Promise<RecallBotResponse> => {
    const { meetingUrl } = CreateBotInputSchema.parse(args);

    const clientId = randomUUID();
    const jwtToken = generateBotToken(clientId);

    console.log(
        `Attempting to create a Recall.ai bot for client: ${clientId}`
    );

    const appUrl = getAppUrl();
    const createBotUrl = `${getRecallBaseUrl().toString()}api/v1/bot`;
    const clientWebpageUrl = `${appUrl.toString()}soundboard?clientId=${clientId}`;
    const realtimeEventsUrl = `wss://${appUrl.host}/ws/bot?clientId=${clientId}&token=${jwtToken}`;

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
                    // This is the message that will be sent to the meeting chat when the bot joins
                    message: "Hello! I'm a soundboard bot powered by https://www.recall.ai. Once connected, you can play sounds by typing in the chat: !<sound name> (i.e. !hello)",
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

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }


    const responseData = await response.json();
    const botData = RecallBotResponseSchema.parse(responseData);

    console.log('Successfully created bot with ID:', botData.id);

    return botData;
}; 