import ApiHelper from "@/apis/LBA_API"
import { CONSTANTS_LBA } from "../constantUrls"

export type GetDeviceParams = {
  isSort: boolean,
  isDescending: boolean,
  isPaging: boolean,
  pageNumber: number,
  pageLimitItem: number,
  orderBy: string,
  name: string,
  typeId: string | null
}

export type CreateDeviceParams = {
  matchingCode: string,
  macaddress: string,
  latitude: string,
  longitude: string,
  resolution: string
}

export type UpdateDeviceParams = {
  description: string,
  name: string,
  typeId: string,
  dateFilter: string,
  endDate: string,
  minBid: 0,
  isPublished: boolean,
  startDate: string,
  timeFilter: string
}

export type UpdateListDevicesParam = {
  idList: string[],
  typeId: string,
  endDate: string,
  startDate: string,
  isPublished: boolean,
  timeFilter: string[],
  dateFilter: string[],
  minBid: 0,
  currentType: string;
}

export async function GetDevices(param: GetDeviceParams) {

  const {data} = await ApiHelper.get(CONSTANTS_LBA.DEVICES_URL, { params: { ...param } })
  console.log(data);
  
  return data;
}

export async function UpdateDevice(param: UpdateDeviceParams, id: string) {
  console.log("Param: >>>>", param, id);
  
  const { data } = await ApiHelper.put(`${CONSTANTS_LBA.DEVICES_URL}/${id}`, { ...param })
  return data
}

export async function UpdateListDevices(param: UpdateListDevicesParam) {
  console.log("Update List Devices Param >>>", param);
  
  await ApiHelper.put(CONSTANTS_LBA.DEVICES_URL, { ...param });
}

export async function GetListTypes() {
  const { data } = await ApiHelper.get(CONSTANTS_LBA.DEVICES_TYPE_URL);
  return data;
}

export async function GetDevicesByTypeId(param: GetDeviceParams, id: string) {
  const { data } = await ApiHelper.get(`${CONSTANTS_LBA.DEVICES_URL}/${id}`, { params: { ...param } });
  console.log(data);
  return data;
}

export async function DeleteDevice(id: string) {
  await ApiHelper.delete(`${CONSTANTS_LBA.DEVICES_URL}/${id}`);

}


