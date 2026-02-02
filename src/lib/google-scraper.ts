import puppeteer, { Page } from 'puppeteer';

export async function scrapeGoogleMapsImages(url: string, hotelName?: string): Promise<string[]> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // 1. Try Direct URL (Google Maps)
    console.log(`Navigating to Maps URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    let images = await extractImages(page);
    console.log(`Found ${images.length} images on Maps page.`);

    // 2. Fallback: Google Image Search (if Maps failed or yielded few images)
    if (images.length < 5 && hotelName) {
        console.log(`Fallback: Searching Google Images for "${hotelName}"...`);
        const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(hotelName)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        
        const searchImages = await extractImages(page);
        console.log(`Found ${searchImages.length} images on Search page.`);
        images = [...images, ...searchImages];
    }
    
    // Filter and Process
    const highResImages = images
        .map(url => {
            // Remove size constraints if present (e.g. =w400-h300-k-no) and replace with high res
            return url.replace(/=w\d+-h\d+.*$/, '=w1024'); // Request decent size
        })
        .filter(url => {
            const lower = url.toLowerCase();
            return lower.startsWith('http') && 
                   !lower.includes('favicon') && 
                   !lower.includes('logo') &&
                   !lower.includes('icon') &&
                   !lower.includes('loader') &&
                   !lower.endsWith('.gif') &&
                   !lower.endsWith('.svg');
        });

    return [...new Set(highResImages)];

  } catch (error) {
    console.error("Puppeteer Scrape Error:", error);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

async function extractImages(page: Page): Promise<string[]> {
    return await page.evaluate(() => {
      const images: string[] = [];
      
      // 1. Get all img src
      const imgs = Array.from(document.querySelectorAll('img')).map(img => img.src);
      
      // 2. Get all div background images
      const divs = Array.from(document.querySelectorAll('div')).map(div => {
        const style = window.getComputedStyle(div);
        return style.backgroundImage;
      });

      const allSources = [...imgs, ...divs];
      
      allSources.forEach(src => {
        if (!src) return;
        
        // Google Images often uses base64 for thumbnails, we can accept them if needed,
        // but prefer http URLs.
        // Google Images result pattern: https://encrypted-tbn0.gstatic.com/images?q=...
        
        if (src.startsWith('http')) {
             images.push(src);
        }
        
        // Also clean up css url()
        if (src.includes('url(')) {
           const match = src.match(/url\(['"]?(.*?)['"]?\)/);
           if (match && match[1] && match[1].startsWith('http')) {
             images.push(match[1]);
           }
        }
      });

      return images;
    });
}
