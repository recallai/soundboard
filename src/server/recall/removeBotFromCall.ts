import { getRecallBaseUrl } from './getRecallBaseUrl';
import { z } from 'zod';
import { env } from '../../config/env';
import { RecallBot, RecallBotSchema } from './Bot';

const RemoveBotFromCallArgsSchema = z.object({
    botId: z.string(),
});
type RemoveBotFromCallArgs = z.infer<typeof RemoveBotFromCallArgsSchema>;

/**
 * Removes a Recall.ai bot from a call.
 * Bot must be in the meeting
 */
export const removeBotFromCall = async (args: RemoveBotFromCallArgs): Promise<RecallBot> => {
    const { botId } = RemoveBotFromCallArgsSchema.parse(args);

    console.log(
        `Attempting to remove bot from call: ${botId}`
    );

    const removeBotFromCallUrl = `${getRecallBaseUrl().toString()}api/v1/bot/${botId}/leave_call/`;

    const response = await fetch(removeBotFromCallUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${env.RECALLAI_API_KEY}`
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const responseData = await response.json();
    const botData = RecallBotSchema.parse(responseData);

    console.log('Successfully removed bot from call with ID:', botData.id);

    return botData;
}; 