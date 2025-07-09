import jwt from 'jsonwebtoken';
import { env } from '@/config/env.mjs';
import { z } from 'zod';

const BotTokenPayloadSchema = z.object({
    clientId: z.string(),
    type: z.literal('bot-auth'),
});
type BotTokenPayload = z.infer<typeof BotTokenPayloadSchema>;

/**
 * Generates a JWT token for bot authentication
 * @param clientId The client ID that the bot is associated with
 * @returns A signed JWT token
 */
export function generateBotToken(clientId: string): string {
    const payload = BotTokenPayloadSchema.parse({
        clientId,
        type: 'bot-auth',
    });

    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '1h',
        issuer: 'recall-soundboard',
        audience: 'recall-bot',
    });
}

/**
 * Verifies a JWT token for bot authentication
 * @param token The JWT token to verify
 * @returns The decoded payload if valid, null if invalid
 */
export function verifyBotToken(token: string): BotTokenPayload | null {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET, {
            issuer: 'recall-soundboard',
            audience: 'recall-bot',
        });

        const payload = BotTokenPayloadSchema.parse(decoded);

        if (payload.type !== 'bot-auth') {
            return null;
        }

        return payload;
    } catch {
        // Token is invalid, expired, or malformed
        return null;
    }
} 