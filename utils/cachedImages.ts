const cheerio = require('cheerio');

let cachedResults;

export default async function getResults() {
  if (!cachedResults) {

    const directoryUrl = 'https://photos.naomie-di-scala.com/maman_08-2024/';
     // Fetch the directory listing HTML
    const res = await fetch(directoryUrl);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const html = await res.text();

    // Parse the HTML using cheerio
    const $ = cheerio.load(html);
    let imageUrls = [];

    // Find all links in the table and filter based on file type
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href && /\.(jpg|jpeg|png)$/i.test(href)) { //removed |mov types for now
        // Construct the full URL
        imageUrls.push(`${directoryUrl}${href}`);
      }
    });

    // Filter out duplicates using a Map to retain only unique URLs
    const uniqueImages = Array.from(new Map(imageUrls.map(url => [url, url])).values());


    cachedResults = uniqueImages;
  }

  return cachedResults as string[];
}
