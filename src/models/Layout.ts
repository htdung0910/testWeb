import type { BaseGetRequest } from '@/services/BaseRequest';
import { GetLayouts } from '@/services/LayoutService';
import type { Effect, Reducer } from 'umi';


export type Area = {
  height: number;
  id: string;
  width: number;
  x: number;
  y: number;
}

export type Layout = {
  id: string;
  title: string;
  description: string;
  isHorizontal: boolean;
  layoutUrl: string;
  isSelected: boolean;
  areas: Area[];
};

export type LayoutModelState = {
  listLayouts: Layout[];
  getListLayoutParam: BaseGetRequest;
  selectedLayout: Layout;
};

export type LayoutModel = {
  namespace: string;

  state: LayoutModelState;

  effects: {
    getLayouts: Effect;
  };

  reducers: {
    setListLayoutsReducer: Reducer<LayoutModelState>;
    setSelectedLayoutReducer: Reducer<LayoutModelState>;
    setGetListLayoutsParamReducer: Reducer<LayoutModelState>;
  };
};

const layoutModel: LayoutModel = {
  namespace: 'layouts',

  state: {
    listLayouts: [],
    selectedLayout: {
      description: '',
      id: '',
      isHorizontal: false,
      layoutUrl: '',
      title: '',
      isSelected: false,
      areas: []
    },
    getListLayoutParam: {
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: '',
      pageLimitItem: 10,
      pageNumber: 0,
    },
  },

  effects: {
    *getLayouts({ payload }, { call, put }) {
      const { data } = yield call(GetLayouts, payload);

      yield put({
        type: 'setListLayoutsReducer',
        payload: data.result.data.map((item: any) => {
          return {
            ...item,
            isSelected: false,
          };
        }),
      });

      yield put({
        type: 'setGetListLayoutsParamReducer',
        payload,
      });
    },
  },

  reducers: {
    setListLayoutsReducer(state, { payload }) {
      return {
        ...state,
        listLayouts: payload,
      };
    },

    setSelectedLayoutReducer(state, { payload }) {
      return {
        ...state,
        selectedLayout: {
          ...state?.selectedLayout,
          ...payload,
        },
      };
    },

    setGetListLayoutsParamReducer(state, { payload }) {
      return {
        ...state,
        getListLayoutParam: {
          ...state?.getListLayoutParam,
          ...payload,
        },
      };
    },
  },
};

export default layoutModel;
