import { getRecallBaseUrl } from './getRecallBaseUrl';
import { z } from 'zod';
import { env } from '../../config/env';
import { RecallBot, RecallBotSchema } from './Bot';

const SendChatMessageArgsSchema = z.object({
    botId: z.string(),
    message: z.string(),
    pin: z.boolean().optional(),
});
type SendChatMessageArgs = z.infer<typeof SendChatMessageArgsSchema>;

/**
 * Sends a chat message to a Recall.ai bot.
 * Bot must be in the meeting
 */
export const sendChatMessage = async (args: SendChatMessageArgs): Promise<RecallBot> => {
    const { botId, message, pin } = SendChatMessageArgsSchema.parse(args);

    console.log(
        `Attempting to send chat message to bot: ${botId}`
    );

    const sendChatMessageUrl = `${getRecallBaseUrl().toString()}api/v1/bot/${botId}/send_chat_message/`;

    const response = await fetch(sendChatMessageUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${env.RECALLAI_API_KEY}`
        },
        body: JSON.stringify({ message, pin, })
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const responseData = await response.json();
    const botData = RecallBotSchema.parse(responseData);

    console.log('Successfully sent chat message to bot with ID:', botData.id);

    return botData;
}; 