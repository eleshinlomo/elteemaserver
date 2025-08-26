import axios from 'axios'


export async function getPublicIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip
  } catch (error) {
    console.error('Error fetching IP:', error.message);
  }
}


export async function getLocationFromIP(ip) {
  try {
    // Using ip-api.com (Free tier available)
    const response = await axios.get(`http://ip-api.com/json/${ip}?fields=country,regionName,city,region,query`);
    const { country, regionName, city, region, query } = response.data;
  
    const geoData = { country, state: regionName, city, region, ip: query}
    return geoData;
  } catch (error) {
    console.error("Error fetching geolocation:", error.message);
    return null;
  }
}
