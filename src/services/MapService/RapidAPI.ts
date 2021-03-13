import { CONSTANTS_RAPID } from './../constantUrls';
import RapidAPIHelper from "@/apis/RAPID_API";
import axios from 'axios';

// const options = {
//   method: 'GET',
//   url: 'https://google-maps-geocoding.p.rapidapi.com/geocode/json',
//   params: {address: '164 Townsend St., San Francisco, CA', language: 'en'},
//   headers: {
//     'x-rapidapi-key': '64d2eae8ddmshf0a295ed1b48a24p10ab27jsn4986212cfeb4',
//     'x-rapidapi-host': 'google-maps-geocoding.p.rapidapi.com'
//   }
// };


export async function geocoding(address: string) {
  const res = await RapidAPIHelper.get(`${CONSTANTS_RAPID.GEOCODE}/json`, { params: { address, language: 'en' } });
  return res;
}
