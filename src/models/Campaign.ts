import type { BaseGetRequest } from "@/services/BaseRequest";
import { createCampaign, deleteCampaign, getListCampaigns } from "@/services/CampaignService/CampaignService";
import type { CreateCampaignParam } from '@/services/CampaignService/CampaignService';
import moment from "moment";
import type { Effect, Reducer } from "umi";

export type Campaign = {
  id: string;
  budget: number;
  description: string;
  location: string;
  maxBid: number;
  startDate: string;
  endDate: string;
  dateFilter: string;
  timeFilter: string;
  radius: number;
  status: number;
  modifyBy?: string;
  createBy?: string;
  createTime?: string;
  modifyTime?: string;
  isActive: boolean;
  address: string;
  types: any[]
};

export type CampaignModelState = {
  listCampaign: Campaign[];
  campaignsTableLoading: boolean;
  totalCampaigns: number; 
  selectedCampaign: Campaign;

  getListCampaignParam: BaseGetRequest;

  createCampaignParam: CreateCampaignParam;

  addNewCampaignModal: {
    visible: boolean;
    isLoading: boolean;
    address: string;
  };

  editCampaignDrawer: {
    visible: boolean;
    isLoading: boolean;
  }
};

export type CampaignModelStore = {
  namespace: string;

  state: CampaignModelState;

  effects: {
    getListCampaigns: Effect;
    createCampaign: Effect;
    deleteCampaign: Effect;
  };

  reducers: {
    setListCampaignReducer: Reducer<CampaignModelState>;
    setTotalCampaignReducer: Reducer<CampaignModelState>;
    setCampaignTableLoadingReducer: Reducer<CampaignModelState>;
    setGetListCampaignParamReducer: Reducer<CampaignModelState>;

    setCreateCampaignParamReducer: Reducer<CampaignModelState>; //
    clearCreateCampaignParamReducer: Reducer<CampaignModelState>;

    setAddNewCampaignModalReducer: Reducer<CampaignModelState>;
    
    setSelectedCampaignReducer: Reducer<CampaignModelState>;

    setEditCampaignReducer: Reducer<CampaignModelState>;
  }
};

const CampaignStore: CampaignModelStore = {
  namespace: "campaign",

  state: {
    listCampaign: [],
    campaignsTableLoading: false,
    totalCampaigns: 0,

    selectedCampaign: {
      id: "",
      budget: 0,
      description: "",
      location: "",
      maxBid: 0,
      endDate: moment().format('YYYY/MM/DD'),
      startDate: moment().format('YYYY/MM/DD'),
      dateFilter: "0000000",
      timeFilter: "000000000000000000000000",
      radius: 0,
      isActive: true,
      status: 0,
      address: "",
      types: []
    },

    
    createCampaignParam: {
      budget: 0,
      dateFilter: "0000000",
      timeFilter: "000000000000000000000000",
      description: "",
      endDate: moment().format('YYYY/MM/DD'),
      startDate: moment().format('YYYY/MM/DD'),
      location: "",
      maxBid: 0,
      radius: 0,
      scenarioId: "",
      typeIds: []
    },

    getListCampaignParam: {
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: "",
      pageLimitItem: 10,
      pageNumber: 0
    },

    addNewCampaignModal: {
      visible: false,
      isLoading: false,
      address: ""
    },

    editCampaignDrawer: {
      isLoading: false,
      visible: false,
    }
  },

  effects: {
    *getListCampaigns({ payload }, { call, put }) {
      const { data } = yield call(getListCampaigns, payload);

      yield put({
        type: "setListCampaignReducer",
        payload: data.result.data.map((campaign: any) => {
          return {
            key: campaign.id,
            ...campaign,
            maxBid: campaign.maxBid.toFixed(2),
            budget: campaign.budget.toFixed(2),
          }
        })
      })

      yield put({
        type: "setTotalCampaignReducer",
        payload: data.result.totalItem
      })

      yield put({
        type: "setGetListCampaignParamReducer",
        payload
      })
    },

    *createCampaign({ payload }, { call }) {
      yield call(createCampaign, payload);
    },

    *deleteCampaign({ payload }, { call }) {
      yield call(deleteCampaign, payload);
    }
  },

  reducers: {
    setListCampaignReducer(state, { payload }) {
      return {
        ...state,
        listCampaign: payload
      }
    },

    setGetListCampaignParamReducer(state, { payload }) {
      return {
        ...state,
        getListCampaignParam: {
          ...state?.getListCampaignParam,
          ...payload
        }
      }
    },
    
    setCampaignTableLoadingReducer(state, { payload }) {
      return {
        ...state,
        campaignsTableLoading: payload
      }
    },

    setTotalCampaignReducer(state, { payload }) {
      return {
        ...state,
        totalCampaigns: payload
      }
    },

    setAddNewCampaignModalReducer(state, { payload }) {
      return {
        ...state,
        addNewCampaignModal: {
          ...state?.addNewCampaignModal,
          ...payload
        }
      }
    },

    setCreateCampaignParamReducer(state, { payload }) {
      return {
        ...state,
        createCampaignParam: {
          ...state?.createCampaignParam,
          ...payload
        }
      }
    },

    clearCreateCampaignParamReducer(state) {
      return {
        ...state,
        createCampaignParam: {
          budget: 0,
          dateFilter: "0000000",
          timeFilter: "000000000000000000000000",
          description: "",
          endDate: moment().format('YYYY/MM/DD'),
          startDate: moment().format('YYYY/MM/DD'),
          location: "",
          maxBid: 0,
          radius: 0,
          scenarioId: "",
          typeIds: []
        }
      }
    },

    setSelectedCampaignReducer(state, { payload }) {
      return {
        ...state,
        selectedCampaign: {
          ...state?.selectedCampaign,
          ...payload
        }
      }
    },

    setEditCampaignReducer(state, { payload }) {
      return {
        ...state,
        editCampaignDrawer: {
          ...state?.editCampaignDrawer,
          ...payload
        }
      }
    }
  }
}


export default CampaignStore;