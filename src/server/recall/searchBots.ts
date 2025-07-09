import { z } from 'zod';
import { getRecallBaseUrl } from './getRecallBaseUrl';
import { env } from '../../config/env';
import { RecallBot, RecallBotSchema } from './Bot';
import { getRecallApiError } from './getRecallApiError';

const SearchBotsArgsSchema = z.object({
    meetingUrl: z.string().url(),
    lookbackSeconds: z.number().default(900),
});

type SearchBotsArgs = z.input<typeof SearchBotsArgsSchema>;

const ListBotsResponseSchema = z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(RecallBotSchema),
});

/**
 * Searches for Recall.ai meeting bots by meeting_url
 */
export const searchBots = async (
    args: SearchBotsArgs
): Promise<RecallBot[]> => {
    const { meetingUrl, lookbackSeconds } = SearchBotsArgsSchema.parse(args);

    console.log(
        `Searching for bots in meeting: ${meetingUrl} with a ${lookbackSeconds} second lookback`
    );

    const listBotsUrl = new URL(`${getRecallBaseUrl().toString()}api/v1/bot`);
    listBotsUrl.searchParams.append('meeting_url', meetingUrl);

    const response = await fetch(listBotsUrl.toString(), {
        method: 'GET',
        headers: {
            Authorization: `Token ${env.RECALLAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    switch (response.status) {
        case 400: {
            const data = await response.json();
            throw new Error(`${getRecallApiError(data)}`);
        }
    }

    if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
    }

    const responseData = await response.json();
    const parsedResponse = ListBotsResponseSchema.parse(responseData);

    console.log(`Found ${parsedResponse.results.length} bot(s), filtering...`);

    const lookbackMs = lookbackSeconds * 1000;
    const lookbackDate = new Date(Date.now() - lookbackMs);

    const recentBots = parsedResponse.results.filter((bot) => {
        if (!bot.status_changes) {
            return false;
        }
        return bot.status_changes.some(
            (change) =>
                change.code === 'joining_call' &&
                new Date(change.created_at) > lookbackDate
        );
    });

    console.log(`Found ${recentBots.length} bot(s) with recent activity`);

    return recentBots;
}; 