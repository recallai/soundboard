import { NextRequest } from "next/server";
import { createBot } from "@/server/recall/createBot";
import { z } from "zod";
import { verifyBotCanBeCreated } from "@/server/recall/verifyBotCanBeCreated";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { meetingUrl } = z
            .object({ meetingUrl: z.string().url() })
            .parse(body);

        await verifyBotCanBeCreated(meetingUrl);

        const botData = await createBot({ meetingUrl });

        return Response.json({
            success: true,
            data: { botId: botData.id, },
            message: 'Bot created successfully'
        });

    } catch (error) {
        console.error('Error creating bot:', error);

        if (error instanceof z.ZodError) {
            return Response.json(
                {
                    success: false,
                    error: 'Invalid request body',
                    details: error
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: false,
                error: 'Failed to create bot',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
};