const VALID_RECALLAI_REGIONS = ['api', 'us-east-1', 'us-west-2', 'eu-central-1', 'ap-northeast-1'];

/**
 * Gets and validates the Recall.ai base URL from an environment variable
 */
export function getRecallBaseUrl(): URL {
    let rawUrl = process.env.RECALLAI_BASE_URL;

    // Check if the Recall.ai base URL is set.
    if (!rawUrl) {
        throw new Error('env.RECALLAI_BASE_URL is not set in the environment variables.');
    }

    // Ensure the Recall.ai base URL has a protocol.
    if (!rawUrl.includes('://')) {
        rawUrl = rawUrl.includes('localhost') ? `http://${rawUrl}` : `https://${rawUrl}`;
    }

    // Validate the Recall.ai base URL is a valid URL.
    let url: URL;
    try {
        url = new URL(rawUrl);
    } catch (error) {
        throw new Error(
            `The env.RECALLAI_BASE_URL '${rawUrl}' is not a valid URL`,
            { cause: error }
        );
    }

    // Check if the hostname is a valid Recall.ai region.
    const region = url.hostname.split('.')[0];
    if (!url.hostname.includes('recall.ai') || !VALID_RECALLAI_REGIONS.includes(region)) {
        throw new Error(`The env.RECALLAI_BASE_URL '${rawUrl}' is not a valid URL. The region '${region}' must be one of the following: ${VALID_RECALLAI_REGIONS.join(', ')}.`);
    }

    return url;
} 