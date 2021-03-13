import ApiHelper from "@/apis/LBA_API"
import type { BaseGetRequest } from "../BaseRequest";
import { CONSTANTS_LBA } from "../constantUrls"

export type CreateCampaignParam = {
  scenarioId: string;
  budget: number;
  description: string;
  location: string;
  typeIds: string[];
  maxBid: number,
  startDate: string;
  endDate: string;
  dateFilter: string;
  timeFilter: string;
  radius: number;
}

export type UpdateCampaignParam = {
  
}


export async function getListCampaigns(param: BaseGetRequest) {
  const res = await ApiHelper.get(`${CONSTANTS_LBA.CAMPAIGN_URL}`, { params: { ...param } });
  return res;
}

export async function createCampaign(param: CreateCampaignParam) {
  await ApiHelper.post(`${CONSTANTS_LBA.CAMPAIGN_URL}`, param);
}

export async function deleteCampaign(id: string) {
  await ApiHelper.delete(`${CONSTANTS_LBA.CAMPAIGN_URL}/${id}`);
}
