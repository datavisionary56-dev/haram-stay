const axios = require('axios');

async function testApi() {
  const url = 'http://localhost:3000/api/fetch-hotel';
  const mapsUrl = "https://www.google.com/maps/place/%D9%81%D9%86%D8%AF%D9%82+%D8%A7%D9%84%D9%85%D8%A7%D8%B3%D8%A9+%D8%A8%D8%AF%D8%B1%E2%80%AD/@21.4132002,39.824151,17z/data=!3m1!4b1!4m9!3m8!1s0x15c2053ff4912c85:0x881b22c698de64f4!5m2!4m1!1i2!8m2!3d21.4131952!4d39.8215761!16s%2Fg%2F11g23596m_?entry=ttu&g_ep=EgoyMDI2MDExOS4wIKXMDSoASAFQAw%3D%3D";
  
  console.log("Testing API with Google Maps URL (No API Key mode)...");
  
  try {
    const res = await axios.post(url, { url: mapsUrl });
    console.log("Response Status:", res.status);
    console.log("Success:", res.data.success);
    
    if (res.data.success) {
        console.log("Hotel Name:", res.data.data.name);
        console.log("Images Found:", res.data.data.images.length);
        console.log("Sample Image:", res.data.data.images[0]);
    } else {
        console.log("Error:", res.data.error);
    }
  } catch (e) {
    console.log("Request Failed:", e.message);
    if (e.response) console.log(e.response.data);
  }
}

testApi();
