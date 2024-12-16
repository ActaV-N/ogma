import * as cheerio from 'cheerio';

export async function fetchOgTitle(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to get Open Graph title first
    const ogTitle = $('meta[property="og:title"]').attr('content');
    console.log(ogTitle);
    if (ogTitle) {
      return ogTitle;
    }

    // Fallback to regular HTML title
    const title = $('title').text();
    return title || null;
  } catch (error) {
    console.error('Error fetching OG title:', error);
    return null;
  }
}
