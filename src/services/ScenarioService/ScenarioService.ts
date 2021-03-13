import type { BaseGetRequest } from './../BaseRequest';
import { CONSTANTS_LBA } from './../constantUrls';
import ApiHelper from '@/apis/LBA_API';
import { ScenarioItem } from 'umi';

export type GetListScenariosParam = BaseGetRequest;

export type PostScenarioParam = {
  layoutId: string;
  title: string;
  description: string;
};

export type UpdateScenarioParam = {
  id: string;
  layoutId: string;
  title: string;
  description: string;
  scenarioItems: UpdateScenarioItem[];
}

export type UpdateScenarioItem = {
  id?: string;
  displayOrder?: number;
  playlistId?: string;
  scenarioId?: string;
  areaId?: string;
  isActive?: boolean;
  audioArea?: boolean;
}

export async function GetListScenarios(param: GetListScenariosParam) {
  const res = await ApiHelper.get(`${CONSTANTS_LBA.SCENARIO_URL}`, { params: { ...param } });
  console.log('====================================');
  console.log("Response >>>>", res);
  console.log('====================================');
  return res;
}

export async function CreateNewScenario(param: PostScenarioParam) {
  await ApiHelper.post(`${CONSTANTS_LBA.SCENARIO_URL}`, param);
}


export async function UpdateScenario(param: UpdateScenarioParam) {

  console.log('====================================');
  console.log("Update Param >>>>", param);
  console.log('====================================');
  await ApiHelper.put(`${CONSTANTS_LBA.SCENARIO_URL}/${param.id}`, param);
}

export async function RemoveScenario(id: string) {
  await ApiHelper.delete(`${CONSTANTS_LBA.SCENARIO_URL}/${id}`);
}