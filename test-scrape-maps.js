const axios = require('axios');
const fs = require('fs');

async function testGoogleMapsScrape() {
  const url = "https://www.google.com/maps/place/%D9%81%D9%86%D8%AF%D9%82+%D8%A7%D9%84%D9%85%D8%A7%D8%B3%D8%A9+%D8%A8%D8%AF%D8%B1%E2%80%AD/@21.4132002,39.824151,17z/data=!3m1!4b1!4m9!3m8!1s0x15c2053ff4912c85:0x881b22c698de64f4!5m2!4m1!1i2!8m2!3d21.4131952!4d39.8215761!16s%2Fg%2F11g23596m_?entry=ttu&g_ep=EgoyMDI2MDExOS4wIKXMDSoASAFQAw%3D%3D";
  
  try {
    console.log("Fetching Google Maps URL...");
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log("Response status:", response.status);
    const html = response.data;
    
    // Try to find image URLs in the massive script tags or JSON blobs
    // Google often puts images in arrays like ["https://...", ...]
    // Looking for high-res images usually starting with https://lh5.googleusercontent.com/p/
    
    const regex = /https:\/\/lh5\.googleusercontent\.com\/p\/[^"\\]+/g;
    const matches = html.match(regex);
    
    if (matches) {
        console.log(`Found ${matches.length} potential image URLs.`);
        const uniqueImages = [...new Set(matches)];
        console.log("First 5 unique images:", uniqueImages.slice(0, 5));
    } else {
        console.log("No standard Google User Content image URLs found with simple regex.");
        fs.writeFileSync('google_maps_dump.txt', html);
        console.log("Dumped HTML to google_maps_dump.txt");
    }

    // Try to extract the name
    const titleRegex = /<meta property="og:title" content="([^"]+)">/;
    const titleMatch = html.match(titleRegex);
    if (titleMatch) {
        console.log("Extracted Title:", titleMatch[1]);
    }

  } catch (error) {
    console.error("Error scraping:", error.message);
  }
}

testGoogleMapsScrape();
