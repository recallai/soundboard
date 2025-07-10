import z from "zod";

const BotStatusChangeSchema = z.object({
    code: z.string(),
    message: z.string().nullable(),
    created_at: z.string().datetime(),
    sub_code: z.string().nullable(),
});

const StatusSchema = z.object({
    code: z.string(),
    sub_code: z.string().nullable(),
    updated_at: z.string().datetime(),
})

const RecordingSchema = z.object({
    id: z.string(),
    status: StatusSchema,
    media_shortcuts: z.object({
        participant_events: z.object({
            data: z.object({
                participant_events_download_url: z.string().url().nullish(),
                speaker_timeline_download_url: z.string().url().nullish(),
                participants_download_url: z.string().url().nullish(),
            }),
        }).nullish(),
    }),
    metadata: z.record(z.string(), z.any()),
});

export const RecallBotSchema = z.object({
    id: z.string(),
    status_changes: z.array(BotStatusChangeSchema).optional(),
    recordings: z.array(RecordingSchema).optional(),
});
export type RecallBot = z.infer<typeof RecallBotSchema>;

