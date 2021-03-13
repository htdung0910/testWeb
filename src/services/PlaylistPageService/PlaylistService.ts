import { CONSTANTS_LBA } from '../constantUrls';
import ApiHelper from "@/apis/LBA_API"

export type GetListPlaylistParam = {
  isSort: boolean;
  isDescending: boolean;
  isPaging: boolean,
  pageNumber: number;
  pageLimitItem: number;
  orderBy: string;
}

export type AddNewPlaylistParam = {
  title: string,
  description: string;
  accountId: string;
}


export type UpdatePlaylistParam = {
  title: string;
  description: string;
}


export async function GetListPlaylist(params: GetListPlaylistParam) {
  const res = await ApiHelper.get(`${CONSTANTS_LBA.PLAYLIST_URL}`, { params: { ...params } });
  console.log('====================================');
  console.log(res.data);
  console.log('====================================');
  return res;
}

export async function AddNewPlaylist(params: AddNewPlaylistParam) {
  await ApiHelper.post(`${CONSTANTS_LBA.PLAYLIST_URL}`, params);
}


export async function UpdatePlaylist(params: UpdatePlaylistParam) {
  await ApiHelper.put(`${CONSTANTS_LBA.PLAYLIST_URL}`, params);
}

export async function RemovePlaylist(id: string) {
  await ApiHelper.delete(`${CONSTANTS_LBA.PLAYLIST_URL}/${id}`);
}

