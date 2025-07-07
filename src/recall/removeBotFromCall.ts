
import { z } from 'zod';
import { getRecallBaseUrl } from '@/recall/getRecallBaseUrl';
import { env } from '@/config/env.mjs';

const RemoveBotFromCallInputSchema = z.object({
    botId: z.string(),
});
type RemoveBotFromCallInput = z.infer<typeof RemoveBotFromCallInputSchema>;

export const RecallBotResponseSchema = z.object({
    id: z.string()
});
export type RecallBotResponse = z.infer<typeof RecallBotResponseSchema>;

/**
 * Removes a Recall.ai bot from a call.
 * Bot must be in the meeting
 */
export const removeBotFromCall = async (args: RemoveBotFromCallInput): Promise<RecallBotResponse> => {
    const { botId } = RemoveBotFromCallInputSchema.parse(args);

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
    const botData = RecallBotResponseSchema.parse(responseData);

    console.log('Successfully removed bot from call with ID:', botData.id);

    return botData;
}; 