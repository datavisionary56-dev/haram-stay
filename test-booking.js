const axios = require('axios');

async function testSearch() {
  const hotelNames = ["Massa Bader Makkah", "Al Massa Badr Makkah", "فندق الماسة بدر مكة"];
  
  const headers = {
    'x-rapidapi-key': '289205acf6msha2deef8357bf96bp1c034bjsnd00ce488ff32',
    'x-rapidapi-host': 'booking-com.p.rapidapi.com'
  };

  for (const name of hotelNames) {
      console.log(`\nSearching for: ${name}...`);
      try {
        const searchRes = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/locations', {
          params: { name: name, locale: 'en-gb' }, 
          headers
        });

        const hotels = searchRes.data.filter(item => item.dest_type === 'hotel');
        
        if (hotels.length > 0) {
          console.log(`Found ${hotels.length} hotels for "${name}":`);
          hotels.forEach(h => console.log(`- ${h.label} (ID: ${h.dest_id})`));
          
          // If found, break and fetch photos for the first one
          const firstHotel = hotels[0];
          console.log(`Fetching photos for ${firstHotel.label} (ID: ${firstHotel.dest_id})...`);
          const photosRes = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/photos', {
              params: { hotel_id: firstHotel.dest_id, locale: 'en-gb' },
              headers
          });
          
          if (Array.isArray(photosRes.data)) {
            console.log(`Found ${photosRes.data.length} photos.`);
            console.log("Sample URLs:", photosRes.data.slice(0, 3).map(p => p.url_max1280 || p.url_square60));
          }
          return; // Stop after finding one match
        } else {
            console.log(`No hotels found for "${name}".`);
        }
      } catch (e) {
          console.log(`Error searching for ${name}: ${e.message}`);
          if (e.response) console.log(e.response.data);
      }
  }
}

testSearch();
