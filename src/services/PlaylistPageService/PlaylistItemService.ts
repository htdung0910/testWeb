import type  {BaseGetRequest} from '../BaseRequest';
import { CONSTANTS_LBA } from '../constantUrls';
import ApiHelper from "@/apis/LBA_API"

export type EditPlayListItemParam = {
  id: string;
  displayOrder: number;
  duration: number;
}

export type AddNewPlaylistItemParam = {
  id: string;
  mediaSrcId: string;
  displayOrder: number;
  duration: number;
}

export type UpdatePlaylistItemsByPlaylistIdParam = {
  id: string;
  title: string,
  description: string,
  updatePlaylistItems: AddNewPlaylistItemParam[]
}

export type GetPlaylistItemByPlaylistIdParam = BaseGetRequest & {
  id: string;
}

export async function AddNewPlaylistItem(param: AddNewPlaylistItemParam) {
  await ApiHelper.post(`${CONSTANTS_LBA.PLAYLIST_ITEM_URL}`, param);
}

export async function EditPlayListItem(param: EditPlayListItemParam) {

  await ApiHelper.put(`${CONSTANTS_LBA.PLAYLIST_ITEM_URL}/${param.id}`, param);
}

export async function GetPlaylistItemByPlaylistId(params: GetPlaylistItemByPlaylistIdParam) {
  const res = await ApiHelper.get(`${CONSTANTS_LBA.PLAYLIST_URL}/${params.id}/playlist-items`, { params: { ...params } });
  return res
}

export async function GetListMediaNotBelongToPlaylist(param: GetPlaylistItemByPlaylistIdParam) {
  // const res = await ApiHelper.get(`${CONSTANTS_LBA.PLAYLIST_ITEM_URL}/playlist/${param.id}`, { params: { ...param } });
  const res = await ApiHelper.get(`${CONSTANTS_LBA.MEDIA_SRC_URL}`, { params: { ...param } });
  return res
}

export async function UpdatePlaylistItemsByPlaylistId(param: UpdatePlaylistItemsByPlaylistIdParam) {
  console.log(param);
  const newParam: UpdatePlaylistItemsByPlaylistIdParam = {
    id: param.id,
    description: param.description,
    title: param.title,
    updatePlaylistItems: param.updatePlaylistItems.map(item => {
      return {
        id: item.id,
        displayOrder: item.displayOrder,
        duration: item.duration,
        mediaSrcId: item.mediaSrcId
      }
    })
  }
  await ApiHelper.put(`${CONSTANTS_LBA.PLAYLIST_URL}/${param.id}/playlistitems`, newParam)
}