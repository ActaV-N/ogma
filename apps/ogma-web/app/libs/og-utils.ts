import * as cheerio from 'cheerio';

interface PagePreview {
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
}

export async function fetchPagePreview(url: string): Promise<PagePreview> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Get title (og:title or fallback to HTML title)
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || null;

    // Get description (og:description or fallback to meta description)
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      null;

    // Get image (og:image)
    const image = $('meta[property="og:image"]').attr('content') || null;

    // Get favicon (try different possible favicon locations)
    const favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      new URL('/favicon.ico', url).href ||
      null;

    return {
      title,
      description,
      image,
      favicon,
    };
  } catch (error) {
    console.error('Error fetching page preview:', error);
    return {
      title: null,
      description: null,
      image: null,
      favicon: null,
    };
  }
}
