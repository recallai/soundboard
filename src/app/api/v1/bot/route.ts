import { NextRequest } from "next/server";
import { createRecallBot } from "@/server/utils/createRecallBot";
import { z } from "zod";
import { env } from "@/config/env.mjs";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { meetingUrl } = z
            .object({ meetingUrl: z.string().url() })
            .parse(body);

        const recallApiKey = env.RECALLAI_API_KEY;
        if (!recallApiKey) {
            throw new Error('RECALLAI_API_KEY env var is not set');
        }

        const botData = await createRecallBot({
            recallApiKey,
            meetingUrl
        });

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
                    details: error.errors
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
            { status: 500 }
        );
    }
};