import { NextRequest } from "next/server";
import { z } from "zod";

const StatusChangeWebhookEventSchema = z.object({
    event: z.string(),
    data: z.object({
        bot: z.object({
            id: z.string(),
            metadata: z.record(z.string(), z.any()),
        }),
    }),
})
type StatusChangeWebhookEvent = z.infer<typeof StatusChangeWebhookEventSchema>;
const statusChangeEventCodes = [
    "bot.joining_call",
    "bot.in_waiting_room",
    "bot.in_call_not_recording",
    "bot.recording_permission_allowed",
    "bot.recording_permission_denied",
    "bot.in_call_recording",
    "bot.call_ended",
    "bot.done",
    "bot.fatal",
] as const;
const isStatusChangeWebhookEvent = (event: unknown): event is StatusChangeWebhookEvent => {
    const statusChangeEvent = event as StatusChangeWebhookEvent;
    return statusChangeEventCodes.includes(statusChangeEvent.event as (typeof statusChangeEventCodes)[number]);
}

export const POST = async (req: NextRequest) => {
    const returnSuccess = (args: { message: string, status: number }) => Response.json({ success: true, message: args.message }, { status: args.status });
    const returnError = (args: { message: string, status: number }) => Response.json({ success: false, message: args.message }, { status: args.status });

    try {
        const body = await req.json();

        if (isStatusChangeWebhookEvent(body)) {
            const { event, data: { bot: { id: botId, metadata } } } = StatusChangeWebhookEventSchema.parse(body);

            switch (event) {
                case 'bot.in_call_recording': {
                    console.log(`bot ${botId} is in call recording for meeting: ${metadata.meetingUrl}`);
                    break;
                }
                default: {
                    console.log(`unhandled status change event '${event}' for bot: ${botId}`);
                }
            }
        } else {
            return returnSuccess({ message: 'Unhandled webhoook event schema', status: 200 });
        }

        return returnSuccess({ message: 'Webhook processed successfully', status: 200 });

    } catch (error) {
        console.error('Error processing recall.ai webhook:', error);

        if (error instanceof z.ZodError) {
            return returnError({ message: 'Invalid request body', status: 400 });
        }

        return returnError({ message: 'Failed to process recall.ai webhook', status: 400 });
    }
};