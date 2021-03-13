import ApiHelper from "@/apis/LBA_API";
import type { BaseGetRequest } from "../BaseRequest";
import { CONSTANTS_LBA } from "../constantUrls";

export type GetLocationParam = BaseGetRequest;

export type CreateLocationParam = {
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  typeId: string;
  brandId: string;
  address: string;

}

export type UpdateLocationParam = {
  id: string;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  isApprove: boolean;
  isActive: boolean;
  typeId: string;
  brandId: string;
}

export async function GetLocations(param: GetLocationParam) {
  const response = await ApiHelper.get(`${CONSTANTS_LBA.LOCATION_URL}/${CONSTANTS_LBA.LOCATION_URL}`, { params: { ...param } });
  return response;
}

export async function CreateLocation(param: CreateLocationParam) {
  await ApiHelper.post(`${CONSTANTS_LBA.LOCATION_URL}`, param);
}

export async function UpdateLocation(param: UpdateLocationParam) {
  await ApiHelper.put(`${CONSTANTS_LBA.LOCATION_URL}/${param.id}`, param);
}

export async function DeleteLocation(id: string) {
  await ApiHelper.delete(`${CONSTANTS_LBA.LOCATION_URL}/${id}`);
}