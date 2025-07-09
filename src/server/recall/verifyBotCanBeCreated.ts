import { searchBots } from "./searchBots";

const blocklistedMeetingUrlRegexes: RegExp[] = [
]

export const verifyBotCanBeCreated = async (meetingUrl: string): Promise<void> => {
    // Check if the meeting url is in the blocklisted
    for (const blocklistedUrlRegex of blocklistedMeetingUrlRegexes) {
        if (blocklistedUrlRegex.test(meetingUrl)) {
            throw new Error(`Sending bots to this organization\'s meetings is are allowed. Please use a different meeting url.`);
        }
    }

    // Check for bots with the same meeting url
    const bots = await searchBots({ meetingUrl, lookbackSeconds: 900 });
    if (bots.length > 0) {
        throw new Error('A bot with this meeting url already exists. You can try again for this meeting url after 15 minutes.');
    }
}
