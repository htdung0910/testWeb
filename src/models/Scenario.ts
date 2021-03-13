import { GetListPlaylist } from '@/services/PlaylistPageService/PlaylistService';
import type { GetListPlaylistParam } from '@/services/PlaylistPageService/PlaylistService';
import {
  CreateNewScenario,
  GetListScenarios,
  RemoveScenario,
  UpdateScenario,
} from '@/services/ScenarioService/ScenarioService';
import type { GetListScenariosParam, PostScenarioParam } from '@/services/ScenarioService/ScenarioService';
import type { Area, Effect, Layout, Playlist, PlaylistItem, Reducer } from 'umi';

export type Scenario = {
  key: string;
  id: string;
  layoutId: string;
  title: string;
  description: string;
  modifyBy: string;
  createBy: string;
  createTime: string;
  modifyTime: string;
  isActive: boolean;
  playlists: Playlist[];
  scenarioItems: ScenarioItem[];
  layout: Layout;
  isSelected: boolean;
};

export type ScenarioItem = {
  id: string;
  displayOrder?: number
  audioArea?: boolean;
  isActive?: boolean;
  playlist: Playlist;
  area: Area;
  scenario: Scenario;
  isHover?: boolean;
}

export type ScenarioModelState = {
  listScenario: Scenario[];
  selectedSenario: Scenario;
  getListScenarioParam: GetListScenariosParam;
  tableLoading: boolean;
  totalItem: number;
  addNewScenarioModal: {
    isLoading: boolean;
    visible: boolean;
  };

  createScenarioParam: PostScenarioParam;

  editScenarioDrawer: {
    visible: boolean;
    isLoading: boolean;
    playlistLoading: boolean;
  };

  selectedArea: Area;

  playlistsDrawer: {
    visible: boolean;
    isLoading: boolean;
    totalItem: number;
    listPlaylists: Playlist[]
  },

  getListPlaylistParam: GetListPlaylistParam;

  selectedPlaylist: Playlist;
  selectedPlaylistItems: PlaylistItem[];
};

export type ScenarioStoreModel = {
  namespace: string;

  state: ScenarioModelState;

  effects: {
    getListScenarios: Effect;
    createScenario: Effect;
    getListPlaylist: Effect;
    updateScenario: Effect;
    removeScenario: Effect;
  };

  reducers: {
    setListScenarioReducer: Reducer<ScenarioModelState>;
    setSelectedScenarioReducer: Reducer<ScenarioModelState>;
    setGetListScenarioParamReducer: Reducer<ScenarioModelState>;
    setTotalItemReducer: Reducer<ScenarioModelState>;
    setTableLoadingReducer: Reducer<ScenarioModelState>;
    setAddNewScenarioModalReducer: Reducer<ScenarioModelState>;
    setCreateScenarioParamReducer: Reducer<ScenarioModelState>;
    clearCreateScenarioParamReducer: Reducer<ScenarioModelState>;
    setEditScenarioDrawerReducer: Reducer<ScenarioModelState>;
    setPlaylistsDrawerReducer: Reducer<ScenarioModelState>;
    setGetListPlaylistParamReducer: Reducer<ScenarioModelState>;
    setSelectedAreaReducer: Reducer<ScenarioModelState>;
    setSelectedPlaylistReducer: Reducer<ScenarioModelState>;
    setSelectedPlaylistItemsReducer: Reducer<ScenarioModelState>;
  };
};

const ScenarioStore: ScenarioStoreModel = {
  namespace: 'scenarios',

  state: {
    getListScenarioParam: {
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: '',
      pageLimitItem: 10,
      pageNumber: 0,
    },
    selectedArea: {
      height: 0,
      width: 0,
      id: "",
      x: 0,
      y: 0
    },
    tableLoading: false,
    totalItem: 0,
    listScenario: [],
    selectedSenario: {
      key: '',
      createBy: '',
      createTime: '',
      description: '',
      id: '',
      isActive: true,
      layout: {
        description: '',
        id: '',
        isHorizontal: true,
        layoutUrl: '',
        title: '',
        isSelected: false,
        areas: []
      },
      scenarioItems: [],
      layoutId: '',
      modifyBy: '',
      modifyTime: '',
      playlists: [],
      title: '',
      isSelected: false
    },

    addNewScenarioModal: {
      isLoading: false,
      visible: false,
    },

    createScenarioParam: {
      description: '',
      layoutId: '',
      title: '',
    },

    editScenarioDrawer: {
      isLoading: false,
      visible: false,
      playlistLoading: false,
    },

    playlistsDrawer: {
      isLoading: false,
      visible: false,
      totalItem: 0,
      listPlaylists: []
    },

    getListPlaylistParam: {
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: "",
      pageLimitItem: 10,
      pageNumber: 0
    },

    selectedPlaylist: {
      id: "",
      accountId: "",
      description: "",
      key: "",
      playlistItems: [],
      title: "",
      isSelected: false
    },

    selectedPlaylistItems: []
  },

  effects: {
    *getListScenarios({ payload }, { call, put }) {
      const { data } = yield call(GetListScenarios, payload);
      if (data) {
        yield put({
          type: 'setListScenarioReducer',
          payload: data.result.data.map((item: any) => {
            return {
              key: item.id,
              ...item,
              isSelected: false
            };
          }),
        });
        yield put({
          type: 'setTotalItemReducer',
          payload: data.result.totalItem,
        });
        yield put({
          type: 'setGetListScenarioParamReducer',
          payload,
        });
      }
    },

    *createScenario({ payload }, { call, put }) {
      console.log('====================================');
      console.log('Effects Create scenarios');
      console.log('====================================');
      yield call(CreateNewScenario, payload);

      yield put({
        type: 'clearCreateScenarioParamReducer',
      });
    },

    *getListPlaylist({ payload }, { call, put }) {
      const { data } = yield call(GetListPlaylist, payload);

      yield put({
        type: "setPlaylistsDrawerReducer",
        payload: {
          listPlaylists: data.result.data.map((item: any) => {
            return {
              ...item,
              isSelected: false
            }
          })
        }
      });

      yield put({
        type: "setPlaylistsDrawerReducer",
        payload: data.result.totalItem
      });

      yield put({
        type: "setGetListPlaylistParamReducer",
        payload
      })
    },

    *updateScenario({ payload }, { call }) {
      console.log('====================================');
      console.log("UpdateScenario >>>>");
      console.log('====================================');
      yield call(UpdateScenario, payload);
    },

    *removeScenario({ payload }, { call }) {
      yield call(RemoveScenario, payload); 
    }
  },

  reducers: {
    setListScenarioReducer(state, { payload }) {
      return {
        ...state,
        listScenario: payload,
      };
    },

    setGetListScenarioParamReducer(state, { payload }) {
      return {
        ...state,
        getListScenarioParam: {
          ...state?.getListScenarioParam,
          ...payload,
        },
      };
    },

    setSelectedScenarioReducer(state, { payload }) {
      return {
        ...state,
        selectedSenario: {
          ...state?.selectedSenario,
          ...payload
        },
      };
    },

    setTotalItemReducer(state, { payload }) {
      return {
        ...state,
        totalItem: payload,
      };
    },

    setTableLoadingReducer(state, { payload }) {
      return {
        ...state,
        tableLoading: payload,
      };
    },

    setAddNewScenarioModalReducer(state, { payload }) {
      return {
        ...state,
        addNewScenarioModal: {
          ...state?.addNewScenarioModal,
          ...payload,
        },
      };
    },

    setCreateScenarioParamReducer(state, { payload }) {
      return {
        ...state,
        createScenarioParam: {
          ...state?.createScenarioParam,
          ...payload,
        },
      };
    },

    clearCreateScenarioParamReducer(state) {
      return {
        ...state,
        createScenarioParam: {
          description: '',
          layoutId: '',
          title: '',
        },
      };
    },

    setEditScenarioDrawerReducer(state, { payload }) {
      return {
        ...state,
        editScenarioDrawer: {
          ...state?.editScenarioDrawer,
          ...payload,
        },
      };
    },

    setPlaylistsDrawerReducer(state, { payload }) {
      return {
        ...state,
        playlistsDrawer: {
          ...state?.playlistsDrawer,
          ...payload
        }
      }
    },

    setGetListPlaylistParamReducer(state, { payload }) {
      return {
        ...state,
        getListPlaylistParam: {
          ...state?.getListPlaylistParam,
          ...payload
        }
      }
    },

    setSelectedAreaReducer(state, { payload }) {
      return {
        ...state,
        selectedArea: {
          ...state?.selectedArea,
          ...payload
        }
      }
    },

    setSelectedPlaylistReducer(state, { payload }) {
      return {
        ...state,
        selectedPlaylist: {
          ...state?.selectedPlaylist,
          ...payload
        }
      }
    },

    setSelectedPlaylistItemsReducer(state, { payload }) {
      return {
        ...state,
        selectedPlaylistItems: payload
      }
    }
  },
};

export default ScenarioStore;
