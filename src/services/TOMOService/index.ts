import { CONSTANTS_TOMO } from './../constantUrls';
import TOMOApiHelper from "@/apis/TOMO_API"


export type GetListTransactionParam = {
  holder: string;
  token?: string;
  page: number;
  limit?: number;
}


export async function GetListTransactions(param: GetListTransactionParam) {
  
  const res = await TOMOApiHelper.get(`${CONSTANTS_TOMO.TRANSACTIONS}/${CONSTANTS_TOMO.TOKEN_TYPE}`, { params: { ...param } });
  return res;
}

