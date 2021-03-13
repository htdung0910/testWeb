import ApiHelper from '@/apis/LBA_API';
import type { BaseGetRequest } from './BaseRequest';
import { CONSTANTS_LBA } from './constantUrls';

export async function GetLayouts(param: BaseGetRequest) {
  const res = await ApiHelper.get(`${CONSTANTS_LBA.LAYOUTS_URL}`, { params: { ...param } });
  return res;
}
