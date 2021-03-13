import axios from 'axios';

const LocationIQ_ApiHelper = axios.create({
  baseURL: "https://us1.locationiq.com/v1/",
  headers: {
    "Accept": "application/json",
  },
})
export default LocationIQ_ApiHelper;