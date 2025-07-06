/**
 * Gets and validates the app url from an environment variable
 */
export function getAppUrl(): URL {
    let rawUrl = process.env.APP_HOST;

    // Check if the app url is set.
    if (!rawUrl) {
        throw new Error('env.APP_HOST is not set in the environment variables.');
    }

    // Ensure the app url has a protocol.
    if (!rawUrl.includes('://')) {
        rawUrl = rawUrl.includes('localhost') ? `http://${rawUrl}` : `https://${rawUrl}`;
    }

    // Validate the app url is a valid URL.
    let url: URL;
    try {
        url = new URL(rawUrl);
    } catch (error) {
        throw new Error(
            `The env.APP_HOST '${rawUrl}' is not a valid URL`,
            { cause: error }
        );
    }

    return url;
} 