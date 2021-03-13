import {  AddNewMediaSource, EditMediaSource, GetListMEdiaFromFiledId, GetListMediaSource, GetListMediaSourceTypes, RemoveMediaSource } from '@/services/MediaSourceService';
import type {AddNewMediaParam, EditMediaParam, GetMediaSourcesParam} from '@/services/MediaSourceService'
import { CreateFolder, CreateMedia, GetFiles, GetFolders, UpdateFile } from '@/services/PublitioService/PublitioService';
import type { UpdateFileParam } from '@/services/PublitioService/PublitioService';
import type { CreateFileParam, CreateFolderParam, GetFilesParam, GetFoldersParam } from '@/services/PublitioService/PublitioService';
import type { Effect, Reducer } from 'umi';



export type FolderType = {
  id: string;
  name: string;
  path: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

export type FileType = {
  id: string;
  folder_id?: null;
  title?: string;
  description?: string;
  type: {
    id: string;
    name: string;
    description: string;
  }
  extension: string;
  size: number;
  width: number;
  height: number;
  privacy: string;
  option_download: string;
  option_ad: string;
  option_transform: string;
  wm_id: string;
  urlPreview: string;
  url_thumbnail: string;
  url_download: string;
  versions: number;
  hits: number;
  created_at: string;
  updated_at: string;
  isSelected?: boolean;
  isSigned: number;
}

export type MediaSourceTypeModel = {
  id: string;
  name: string;
  description: string;
}

export type MediaType = {
  id: string;
  name: string;
  description: string;
}

export type MediaSourceModelState = {
  listMedia: any[];
  listFolder: any[];
  listLoading: boolean;
  totalItem: number;
  breadScrumb: FolderType[];
  getListFileParam: GetFilesParam;
  searchListMediaParam: GetMediaSourcesParam;
  getListFolderParam: GetFoldersParam;
  createFolderParam: CreateFolderParam;
  createFileParam: CreateFileParam;
  updateFileParam: EditMediaParam;
  addNewFolderModal: {
    visible: boolean,
    isLoading: boolean,
  },

  addNewFileModal: {
    visible: boolean;
    isLoading: boolean;
    fileList: any;
  };

  editFileDrawer: {
    visible: boolean,
    isLoading: boolean,
    
  },

  selectedFile: FileType,
  listMediaType: MediaType[]
}


export type MediaSourceModel = {
  namespace: string;

  state: MediaSourceModelState;

  effects: {
    getListMediaFromFileId: Effect;
    searchListMedia: Effect;
    getListFolder: Effect;
    getListMediaType: Effect;
    createFile: Effect;
    createFolder: Effect;
    updateFile: Effect;
    removeMedia: Effect;
  },

  reducers: {
    setListMediaReducer: Reducer<MediaSourceModelState>;
    setListFolderReducer: Reducer<MediaSourceModelState>;
    setBreadScrumbReducer: Reducer<MediaSourceModelState>;
    setGetListFileParamReducer: Reducer<MediaSourceModelState>;
    setSearchListMediaParamReducer: Reducer<MediaSourceModelState>;
    setGetListFolderParamReducer: Reducer<MediaSourceModelState>;
    setCreateFolderParamReducer: Reducer<MediaSourceModelState>;
    setCreateFileParamReducer: Reducer<MediaSourceModelState>;
    setUpdateFileParamReducer: Reducer<MediaSourceModelState>;
    setTotalItemReducer: Reducer<MediaSourceModelState>;
    setListLoadingReducer: Reducer<MediaSourceModelState>;
    setAddNewFolderModalReducer: Reducer<MediaSourceModelState>;
    setAddNewFileModalReducer: Reducer<MediaSourceModelState>;
    setListMediaTypeReducer: Reducer<MediaSourceModelState>;
    clearAddNewFileNodalFileList: Reducer<MediaSourceModelState>;
    clearCreateNewFolderParamReducer: Reducer<MediaSourceModelState>;
    setEditFileDrawerReducer: Reducer<MediaSourceModelState>;
    setSelectedFileReducer: Reducer<MediaSourceModelState>;
    clearCreateFileParamReducer: Reducer<MediaSourceModelState>;
    clearSearchListMediaParamReducer: Reducer<MediaSourceModelState>;
  }
}


const MediaSourceStore: MediaSourceModel = {
  namespace: "media",
  
  state: {
    listFolder: [],
    listMedia: [],
    breadScrumb: [],
    createFileParam: {
      file: "",
      folder: "",
      privacy: 1,
      title: "",
      description: "",
      accountId: "",
      securityHash: "",
      typeId: "",
      typeName: "",
      url_preview: "",
      public_id: "",
      tags: "",
      fileId: "",
      isSigned: 0,
    },

    createFolderParam: {
      name: "",
      parent_id: ""
    },

    getListFileParam: {
      filter_privacy: "public",
      limit: 10,
      offset: 0,
      folder: "/",
      pageNumber: 0,

    },

    searchListMediaParam: {
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: "",
      pageLimitItem: 10,
      pageNumber: 0,
      title: "",
    },

    getListFolderParam: {
      parent_id: ""
    },
    updateFileParam: {
      id: "",
      title: "",
      description: "",
      typeId: "",
      isSigned: 0,
    },

    listLoading: false,
    totalItem: 0,

    addNewFolderModal: {
      visible: false,
      isLoading: false,
    },

    addNewFileModal: {
      visible: false,
      isLoading: false,
      fileList: []
    },

    editFileDrawer: {
      isLoading: false,
      visible: false
    },

    selectedFile: {
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
      isSigned: 0
    },
    listMediaType: []
    
  },

  effects: {
    *getListMediaFromFileId({ payload }, { call, put }) {

      const listFile = yield call(GetFiles, payload);
      const listId = listFile.files.map((file: any) => {
        return file.id
      })
      const {data} = yield call(GetListMEdiaFromFiledId, listId);


      
      yield put({
        type: "setListMediaReducer",
        payload: data.result.data
      })

      yield put({
        type: "setGetListFileParamReducer",
        payload
      })

      yield put({
        type: "setTotalItemReducer",
        payload: data.result.totalItem
      })
      
    },
    *searchListMedia({ payload }, { call, put }) {
      const { data } = yield call(GetListMediaSource, payload);
      
      yield put({
        type: "setListMediaReducer",
        payload: data.result.data
      })

      yield put({
        type: "setTotalItemReducer",
        payload: data.result.totalItem
      })

      yield put({
        type: "setSearchListMediaParamReducer",
        payload
      })
    },
    *getListFolder({ payload }, { call, put }) {
      
      const result = yield call(GetFolders, payload);

      console.log('====================================');
      console.log(result);
      console.log('====================================');

      yield put({
        type: "setListFolderReducer",
        payload: result.folders.map((folder: any) => {
          return {
            ...folder,
            isSelected: false
          }
        })
      })

      yield put({
        type: "setGetListFolderParamReducer",
        payload
      })
    },

    *getListMediaType(_, { call, put }) {
      const {data} = yield call(GetListMediaSourceTypes);

      yield put({
        type: "setListMediaTypeReducer",
        payload: data.result.data
      })
    },

    *createFile({ payload }, { call }) {
      const res = yield call(CreateMedia, payload);

      const newParam: AddNewMediaParam = {
        url_preview: res.url_preview,
        fileId: res.id,
        accountId: payload.accountId,
        title: payload.title,
        description: payload.description,
        typeId: payload.typeId,
        securityHash: payload.securityHash,
        isSigned: payload.isSigned
      }
      
      yield call(AddNewMediaSource, newParam);
    },

    *createFolder({ payload }, { call, put }) {
      const res = yield call(CreateFolder, payload);

      yield put({
        type: "clearCreateNewFolderParamReducer"
      })

      return res
    },

    *updateFile({ payload }, { call }) {

      // const res = yield call(UpdateFile, payload);
      yield call(EditMediaSource, payload);
    },

    *removeMedia({ payload }, { call }) {
      const updateParam: UpdateFileParam = {
        id: payload.fileId,
        title: payload.title,
        description: payload.description,
        privacy: 0
      }
      yield call(UpdateFile, updateParam);
      yield call(RemoveMediaSource, payload.id);
    }
  },

  reducers: {
    setListMediaReducer(state, { payload }) {
      return {
        ...state,
        listMedia: payload
      }
    },

    setListFolderReducer(state, { payload }) {
      return {
        ...state,
        listFolder: payload
      }
    },

    setBreadScrumbReducer(state, { payload }) {
      return {
        ...state,
        breadScrumb: payload
      }
    },

    setCreateFileParamReducer(state, { payload }) {
      console.log('====================================');
      console.log("Create File Param >>>>", payload);
      console.log('====================================');
      return {
        ...state,
        createFileParam: {
          ...state?.createFileParam,
          ...payload
        }
      }
    },

    setCreateFolderParamReducer(state, { payload }) {
      return {
        ...state,
        createFolderParam: {
          ...state?.createFolderParam,
          ...payload
        }
      }
    },

    setGetListFileParamReducer(state, { payload }) {
      console.log('====================================');
      console.log("Files >>>>", payload);
      console.log('====================================');
      return {
        ...state,
        getListFileParam: {
          ...state?.getListFileParam,
          ...payload
        }
      }
    },

    setGetListFolderParamReducer(state, { payload }) {
      console.log('====================================');
      console.log("Folders >>>>", payload);
      console.log('====================================');
      return {
        ...state,
        getListFolderParam: {
          ...state?.getListFolderParam,
          ...payload
        }
      }
    },

    setListLoadingReducer(state, { payload }) {
      return {
        ...state,
        listLoading: payload
      }
    },

    setTotalItemReducer(state, { payload }) {
      return {
        ...state,
        totalItem: payload
      }
    },

    setUpdateFileParamReducer(state, { payload }) {
      return {
        ...state,
        updateFileParam: {
          ...state?.updateFileParam,
          ...payload
        }
      }
    },

    setAddNewFileModalReducer(state, { payload }) {
      return {
        ...state,
        addNewFileModal: {
          ...state?.addNewFileModal,
          ...payload
        }
      }
    },

    setAddNewFolderModalReducer(state, { payload }) {
      return {
        ...state,
        addNewFolderModal: {
          ...state?.addNewFolderModal,
          ...payload
        }
      }
    },

    setListMediaTypeReducer(state, { payload }) {
      return {
        ...state,
        listMediaType: payload
      }
    },

    clearAddNewFileNodalFileList(state) {
      return {
        ...state,
        addNewFileModal: {
          fileList: [],
          isLoading: false,
          visible: false
        }
      }
    },
    
    clearCreateNewFolderParamReducer(state) {
      return {
        ...state,
        createFolderParam: {
          ...state?.createFolderParam,
          name: "",
        }
      }
    },

    setEditFileDrawerReducer(state, { payload }) {
      return {
        ...state,
        editFileDrawer: {
          ...state?.editFileDrawer,
          ...payload
        }
      }
    },

    setSelectedFileReducer(state, { payload }) {
      return {
        ...state,
        selectedFile: {
          ...state?.selectedFile,
          ...payload
        }
      }
    },

    clearCreateFileParamReducer(state) {
      return {
        ...state,
        createFileParam: {
          file: "",
          privacy: 1,
          securityHash: "",
          title: "",
          typeId: "",
          url_preview: "",
          description: ""
        }
      }
    },

    setSearchListMediaParamReducer(state, { payload }) {
      return {
        ...state,
        searchListMediaParam: {
          ...state?.searchListMediaParam,
          ...payload
        }
      }
    },

    clearSearchListMediaParamReducer(state) {
      return {
        ...state,
        searchListMediaParam: {
          isDescending: false,
          isPaging: true,
          isSort: false,
          orderBy: "",
          pageLimitItem: 10,
          pageNumber: 0,
          title: "",
          isSigned: -1
        }
      }
    }
  }
}

export default MediaSourceStore;