import ApiHelper from "@/apis/LBA_API"
import type { BaseGetRequest } from "../BaseRequest";
import { CONSTANTS_LBA } from "../constantUrls"

export type CreateBrandParam = {
  name: string,
  description: string
}

export type UpdateBrandParam = {
  id: string;
  name: string,
  description: string
}

export type GetBrandParam = BaseGetRequest & { seachValue: string };

export async function CreateBrand(param: CreateBrandParam) {
  await ApiHelper.post(`${CONSTANTS_LBA.BRAND_URL}`, param);
}

export async function GetListBrand(param: GetBrandParam) {
  const response = await ApiHelper.get(`${CONSTANTS_LBA.BRAND_URL}/${CONSTANTS_LBA.LOCATION_URL}`, { params: { ...param } });
  return response;
}

export async function UpdateBrand(param: UpdateBrandParam) {
  await ApiHelper.put(`${CONSTANTS_LBA.BRAND_URL}/${param.id}`, param);
}

export async function RemoveBrand(id: string) {
  await ApiHelper.delete(`${CONSTANTS_LBA.BRAND_URL}/${id}`);
}