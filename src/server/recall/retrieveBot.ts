import { z } from 'zod';
import { getRecallBaseUrl } from './getRecallBaseUrl';
import { env } from '../../config/env';
import { RecallBot, RecallBotSchema } from './Bot';

const RetrieveBotArgsSchema = z.object({
    botId: z.string(),
});
type RetrieveBotArgs = z.infer<typeof RetrieveBotArgsSchema>;

/**
 * Retrieves a Recall.ai meeting bot
 */
export const retrieveBot = async (args: RetrieveBotArgs): Promise<RecallBot> => {
    const { botId } = RetrieveBotArgsSchema.parse(args);

    const retrieveBotUrl = `${getRecallBaseUrl().toString()}api/v1/bot/${botId}`;

    const response = await fetch(retrieveBotUrl, {
        method: 'GET',
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

    console.log('Successfully retrieved bot with ID:', botData.id);

    return botData;
};
