import z from "zod";

const BotStatusChangeSchema = z.object({
    code: z.string(),
    message: z.string().nullable(),
    created_at: z.string().datetime(),
    sub_code: z.string().nullable(),
});

export const RecallBotSchema = z.object({
    id: z.string(),
    status_changes: z.array(BotStatusChangeSchema).optional(),
});
export type RecallBot = z.infer<typeof RecallBotSchema>;

