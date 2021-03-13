import { CONSTANTS_LOCATIONIQ } from './../constantUrls';
import LocationIQ_ApiHelper from "@/apis/LOCATIONIQ_API";


// const { LOCATIONIQ_ACCESS_TOKEN } = process.env;
const key = "pk.3ca283b2e5ac56b587e3193483a29f24";
export async function reverseGeocoding(latitude: number, longitude: number) {
  const param = {
    key,
    lat:latitude,
    lon:longitude,
    format:'json'
  }
  const res = await LocationIQ_ApiHelper.get(`${CONSTANTS_LOCATIONIQ.REVERSE_GEOCODING}`, { params: { ...param } });
  return res;
}

export async function forwardGeocoding(address: string) {
  const param = {
    key,
    q: address,
    format:'json'
  }
  const res = await LocationIQ_ApiHelper.get(`${CONSTANTS_LOCATIONIQ.GEOCODING}`, { params: { ...param } });
  return res;
}

export async function autoComplete(address: string) {
  const param = {
    key,
    q: address,
    format:'json'
  }
  const res = await LocationIQ_ApiHelper.get(`${CONSTANTS_LOCATIONIQ.AUTOCOMPLETE}`, { params: { ...param } });
  return res;
}