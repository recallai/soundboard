import z from "zod";

export const RecallBotSchema = z.object({
    id: z.string()
});
export type RecallBot = z.infer<typeof RecallBotSchema>;

