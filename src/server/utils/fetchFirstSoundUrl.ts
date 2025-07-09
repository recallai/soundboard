import * as cheerio from 'cheerio';

/**
 * Fetches the first sound URL from the MyInstants website for the given search term.
 * @param searchTerm The search term to use to find the sound.
 * @returns The URL of the first sound.
 */
export const fetchFirstSoundUrl = async (searchTerm: string): Promise<string> => {
    const searchUrl = `https://www.myinstants.com/en/search/?name=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch search results: HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const firstButton = $('#instants_container .instant .small-button').first();
    if (firstButton.length === 0) {
        throw new Error(`No sounds found for search term: "${searchTerm}"`);
    }

    const onclickAttr = firstButton.attr('onclick');
    if (!onclickAttr) {
        throw new Error('Could not find audio link for the first sound.');
    }

    const audioPathMatch = onclickAttr.match(/'(.*?)'/);
    if (!audioPathMatch || !audioPathMatch[1]) {
        throw new Error('Could not parse audio path from the button.');
    }

    return `https://www.myinstants.com${audioPathMatch[1]}`;
}; 