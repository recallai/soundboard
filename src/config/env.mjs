// @ts-check
/**
 * This file is included in `/next.config.js` which ensures the app isn't built with invalid env vars.
 * It has to be a `.js`-file to be imported there.
 */
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const DEFAULT_PORT = parseInt(process.env.PORT ?? '4000');

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    PORT: z.number().default(DEFAULT_PORT),
    RECALLAI_API_KEY: z.string(),
    RECALLAI_BASE_URL: z.string().url(),
    APP_HOST: z.string().url(),
    SEE_FULL_WS_MESSAGES: z.boolean().default(false),
    // DATABASE_URL: z.string(),
    // REDIS_URL: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    PORT: DEFAULT_PORT,
    RECALLAI_API_KEY: process.env.RECALLAI_API_KEY?.trim(),
    RECALLAI_BASE_URL: process.env.RECALLAI_BASE_URL?.trim(),
    APP_HOST: process.env.APP_HOST?.trim(),
    SEE_FULL_WS_MESSAGES: process.env.SEE_FULL_WS_MESSAGES?.toLowerCase()?.trim() === "true",
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});