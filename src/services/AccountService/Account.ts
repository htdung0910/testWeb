import  ApiHelper from '@/apis/LBA_API';
import { CONSTANTS_LBA } from '../constantUrls';


export type getAccountParam = {

}

export async function GetAccountById() {
  const res = await ApiHelper.get(`${CONSTANTS_LBA.ACCOUNTS_URL}`);
  return res;
}
