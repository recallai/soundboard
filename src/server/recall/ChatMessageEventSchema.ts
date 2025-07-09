import { z } from 'zod';

/**
 * Chat message event schema from the Recall.ai API.
 * This is the event that is sent when a chat message is sent in the meeting chat.
 */
export const ChatMessageEventSchema = z.object({
    event: z.literal('participant_events.chat_message'),
    data: z.object({
        data: z.object({
            action: z.literal('chat_message'),
            participant: z.object({
                id: z.number(),
                name: z.string().nullish(),
                is_host: z.boolean().nullish(),
                platform: z.string().nullish(),
                extra_data: z.record(z.any()).nullish()
            }),
            timestamp: z.object({
                absolute: z.string(),
                relative: z.number()
            }),
            data: z
                .object({
                    text: z.string(),
                    to: z.string()
                })
                .nullish()
        }),
        realtime_endpoint: z.object({
            id: z.string(),
            metadata: z.record(z.any())
        }),
        participant_events: z.object({
            id: z.string(),
            metadata: z.record(z.any())
        }),
        recording: z.object({
            id: z.string(),
            metadata: z.record(z.any())
        }),
        bot: z.object({
            id: z.string(),
            metadata: z.record(z.any())
        })
    })
});
