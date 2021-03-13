import {GetListMediaNotBelongToPlaylist, GetPlaylistItemByPlaylistId, UpdatePlaylistItemsByPlaylistId } from "@/services/PlaylistPageService/PlaylistItemService"
import type {AddNewPlaylistItemParam, GetPlaylistItemByPlaylistIdParam} from "@/services/PlaylistPageService/PlaylistItemService"
import { AddNewPlaylist, GetListPlaylist, RemovePlaylist } from "@/services/PlaylistPageService/PlaylistService";
import type {AddNewPlaylistParam, GetListPlaylistParam} from "@/services/PlaylistPageService/PlaylistService";
import type { Effect, FileType, Reducer } from "umi"
import type { GetMediaSourcesParam } from "@/services/MediaSourceService";

export type PlaylistItem = {
  key: string;
  id: string;
  mediaSrcId: string;
  playlistId: string;
  displayOrder: number,
  duration: number,
  modifyBy: string;
  createBy: string;
  createTime: string;
  modifyTime: string,
  isActive: true,
  url: string;
  title: string,
  typeName: string;
  index: number;
  isSelected?: boolean;
}

export type Playlist = {
  key: string;
  id: string;
  title: string,
  description: string;
  accountId: string;
  isSelected?: boolean;
  playlistItems: PlaylistItem[],
}

export type PlayListModelState = {
  listPlaylist: Playlist[],
  getPlaylistParam: GetListPlaylistParam
  selectedPlaylist: Playlist,
  selectedPlaylistItems: PlaylistItem[],
  addNewPlaylistModal: {
    isLoading: boolean,
    visible: boolean,
  },

  tableLoading: boolean,
  currentPage: number,
  totalItem: number,
  addNewPlaylistParam: AddNewPlaylistParam,

  getItemsByPlaylistIdParam: GetPlaylistItemByPlaylistIdParam

  editPlaylistDrawer: {
    visible: boolean,
    isLoading: boolean,
    currentPage: number,
    totalItem: number,
  }
  minDuration: number,
  maxDuration: number,
  totalDuration: number,
  currentNewItemDuration: number,

  addNewPlaylistItemsDrawer: {
    visible: boolean,
    isLoading: boolean,
    currentPage: number,
    totalItem: number,
  },

  listMediaNotBelongToPlaylist: any[],

  getListMediaParam: GetMediaSourcesParam & {playlistId: string},

  selectedMedia: FileType,

  newPlaylistItemParam: AddNewPlaylistItemParam
}

export type PlaylistModel = {
  namespace: string,
  
  state: PlayListModelState

  effects: {
    getListPlaylist: Effect;
    addNewPlaylist: Effect;
    getItemsByPlaylist: Effect;
    getMediaNotBelongToPlaylist: Effect;
    updatePlaylist: Effect;
    removePlaylist: Effect;
  },

  reducers: {
    setlistPlaylistReducer: Reducer<PlayListModelState>,
    setSelectedPlaylistReducer: Reducer<PlayListModelState>,
    clearSelectedPlaylistReducer: Reducer<PlayListModelState>,

    setGetPlaylistParamReducer: Reducer<PlayListModelState>,
    setAddNewPlaylistItemsDrawerReducer: Reducer<PlayListModelState>,
    setAddNewPlaylistModalReducer: Reducer<PlayListModelState>,
    setAddNewPlaylistParamReducer: Reducer<PlayListModelState>,
    setTableLoadingReducer: Reducer<PlayListModelState>,
    clearAddNewPlaylistParamReducer: Reducer<PlayListModelState>,
    setTotalItemReducer: Reducer<PlayListModelState>,
    setEditPlaylistDrawerReducer: Reducer<PlayListModelState>,
    setGetItemsByPlaylistIdParamReducer: Reducer<PlayListModelState>,
    setSelectedPlaylistItemsReducer: Reducer<PlayListModelState>,
    setAddNewPlaylistItemParamReducer: Reducer<PlayListModelState>,
    setListMediaNotBelongToPlaylistReducer: Reducer<PlayListModelState>,
    setGetListMediaParamReducer: Reducer<PlayListModelState>,
    setNewPlaylistItemParamReducer: Reducer<PlayListModelState>,
    setSelectedMediaReducer: Reducer<PlayListModelState>,
    clearSelectedMediaReducer: Reducer<PlayListModelState>,
    setTotalDurationReducer: Reducer<PlayListModelState>,
    clearAddNewPlaylistItemParamReducer: Reducer<PlayListModelState>,
    setCurrentDurationReducer: Reducer<PlayListModelState>,
  }
}

const PlaylistStore: PlaylistModel = {
  namespace: "playlists",

  state: {
    listPlaylist: [],
    tableLoading: false,
    totalItem: 0,
    currentPage: 0,
    selectedPlaylist: {
      key: "",
      title: "",
      id: "",
      accountId: "",
      description: "",
      playlistItems: []
    },
    selectedPlaylistItems: [],
    getPlaylistParam: {
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: "",
      pageLimitItem: 10,
      pageNumber: 0
    },

    getItemsByPlaylistIdParam: {
      id: "",
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: "",
      pageLimitItem: 10,
      pageNumber: 0
    },

    addNewPlaylistModal: {
      visible: false,
      isLoading: false
    },

    addNewPlaylistParam: {
      accountId: "",
      description: "",
      title: ""
    },

    editPlaylistDrawer: {
      visible: false,
      isLoading: false,
      currentPage: 0,
      totalItem: 0,
    },

    addNewPlaylistItemsDrawer: {
      currentPage: 0,
      isLoading: false,
      totalItem: 0,
      visible: false
    },

    listMediaNotBelongToPlaylist: [],
    
    selectedMedia: {
      id: "",
      folder_id: null,
      title: "",
      description: "",
      type: {
        id: "",
        description: "",
        name: ""
      },
      extension: "",
      size: 0,
      width: 0,
      height: 0,
      privacy: "",
      option_download: "",
      option_ad: "",
      option_transform: "",
      wm_id: "",
      urlPreview: "",
      url_thumbnail: "",
      url_download: "",
      versions: 0,
      hits: 0,
      created_at: "",
      updated_at: "",
      isSelected: false,
      isSigned: 0
    },

    getListMediaParam: {
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: "",
      pageNumber: 0,
      isSigned: -1,
      pageLimitItem: 10,
      title: "",
      playlistId: ""
    },

    newPlaylistItemParam: {
      displayOrder: 0,
      duration: 1,
      mediaSrcId: "",
      id: "",
    },

    totalDuration: 10*60,
    minDuration: 10,
    maxDuration: 60 * 4,
    currentNewItemDuration: 10
  },

  effects: {
    *getListPlaylist({ payload }, { call, put }) {
      const { data } = yield call(GetListPlaylist, payload);

      yield put({
        type: "setlistPlaylistReducer",
        payload: data.result.data.map((playlist: any) => {
          return {
            ...playlist,
            key: playlist.id
          }
        }),
      })


      yield put({
        type: "setGetPlaylistParamReducer",
        payload
      })

      yield put({
        type: "setTotalItemReducer",
        payload: data.result.totalItem
      })
    },


    *addNewPlaylist({ payload }, { call }) {
      yield call(AddNewPlaylist, payload)
    },


    *getItemsByPlaylist({ payload }, { call, put }) {
      const { data } = yield call(GetPlaylistItemByPlaylistId, payload);

      yield put({
        type: "setSelectedPlaylistItemsReducer",
        payload: data.result ? data.result.data.map((item: any, index: number) => {
          return {
            key: item.id,
            ...item,
            url: item.mediaSrc.urlPreview,
            title: item.mediaSrc.title,
            typeName: item.mediaSrc.type.name,
            index,
            displayOrder: index
          }
        }): []
      })

      yield put({
        type: "setGetItemsByPlaylistIdParamReducer",
        payload
      })
    },

    *getMediaNotBelongToPlaylist({ payload }, { call, put }) {
      const { data } = yield call(GetListMediaNotBelongToPlaylist, payload);
      
      yield put({
        type: "setListMediaNotBelongToPlaylistReducer",
        payload: data.result.data.map((item: any) => {
          return {
            ...item,
            key: item.id
          }
        })
      })
      
      yield put({
        type: "setAddNewPlaylistItemsDrawerReducer",
        payload: {
          totalItem: data.result.totalItem
        }
      })

      yield put({
        type: "setGetListMediaParamReducer",
        payload
      })
    },

    *updatePlaylist({ payload }, { call }) {
      yield call(UpdatePlaylistItemsByPlaylistId, payload);
    },

    *removePlaylist({ payload }, { call }) {
      yield call(RemovePlaylist, payload);
    }
  },

  reducers: {
    setlistPlaylistReducer(state, { payload }) {
      console.log('====================================');
      console.log(payload);
      console.log('====================================');
      return {
        ...state,
        listPlaylist: payload
      }
    },

    setSelectedPlaylistItemsReducer(state, { payload }) {
      return {
        ...state,
        selectedPlaylistItems: payload
      }
    },

    setTableLoadingReducer(state, { payload }) {
      return {
        ...state,
        tableLoading: payload
      }
    },
    
    setGetPlaylistParamReducer(state, { payload }) {
      return {
        ...state,
        getPlaylistParam: payload
      }
    },

    setAddNewPlaylistModalReducer(state, { payload }) {
      return {
        ...state,
        addNewPlaylistModal: payload
      }
    },
    
    setAddNewPlaylistParamReducer(state, { payload }) {
      return {
        ...state,
        addNewPlaylistParam: payload
      }
    },

    setSelectedPlaylistReducer(state, { payload }) {
      return {
        ...state,
        selectedPlaylist: payload
      }
    },

    clearAddNewPlaylistParamReducer(state) {
      return {
        ...state,
        addNewPlaylistParam: {
          accountId: "",
          description: "",
          title: ""
        }
      }
    },

    setTotalItemReducer(state, { payload }) {
      return {
        ...state,
        totalItem: payload
      }
    },

    setEditPlaylistDrawerReducer(state, { payload }) {
      return {
        ...state,
        editPlaylistDrawer: payload
      }
    },

    setGetItemsByPlaylistIdParamReducer(state, { payload }) {
      return {
        ...state,
        getItemsByPlaylistIdParam: payload
      }
    },
    
    setAddNewPlaylistItemParamReducer(state, { payload }) {
      return {
        ...state,
        editPlaylistDrawer: {
          ...state?.editPlaylistDrawer,
          addNewPlaylistItemParam: payload
        }
      }
    },

    setAddNewPlaylistItemsDrawerReducer(state, { payload }) {
      return {
        ...state,
        addNewPlaylistItemsDrawer: {
          ...state?.addNewPlaylistItemsDrawer,
          ...payload
        }
      }
    },

    setListMediaNotBelongToPlaylistReducer(state, { payload }) {
      return {
        ...state,
        listMediaNotBelongToPlaylist: payload
      }
    },

    setGetListMediaParamReducer(state, { payload }) {
      return {
        ...state,
        getListMediaParam: {
          ...state?.getListMediaParam,
          ...payload
        }
      }
    },

    setNewPlaylistItemParamReducer(state, { payload }) {
      return {
        ...state,
        newPlaylistItemParam: {
          ...state?.newPlaylistItemParam,
          ...payload
        }
      }
    },

    setSelectedMediaReducer(state, { payload }) {
      return {
        ...state,
        selectedMedia: {
          ...state?.selectedMedia,
          ...payload
        }
      }
    },

    clearSelectedMediaReducer(state) {
      return {
        ...state,
        selectedMedia: {
          accountId: "",
          createBy: "",
          createTime: "",
          description: "",
          extension: "",
          id: "",
          isActive: true,
          isApprove: false,
          modifyBy: "",
          modifyTime: "",
          securityHash: "",
          title: "",
          typeId: "",
          url: "",
          type: {
            id: "",
            description: "",
            name: ""
          },
          isSelected: false
        }
      }
    },

    setTotalDurationReducer(state, { payload }) {
      return {
        ...state,
        totalDuration: payload
      }
    },
    clearAddNewPlaylistItemParamReducer(state) {
      return {
        ...state,
        newPlaylistItemParam: {
          id: "",
          duration: 0,
          displayOrder: 0,
          mediaSrcId: "",
        }
      }
    },

    setCurrentDurationReducer(state, { payload }) {
      return {
        ...state,
        currentNewItemDuration: payload
      }
    },

    clearSelectedPlaylistReducer(state) {
      return {
        ...state,
        selectedPlaylist: {
          key: "",
          title: "",
          id: "",
          accountId: "",
          description: "",
          playlistItems: []
        }
      }
    }
  }
}


export default PlaylistStore;