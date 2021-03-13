import type { CreateBrandParam, GetBrandParam, UpdateBrandParam } from "@/services/BrandService/BrandServices"
import type { Effect, Reducer } from "umi"
import {GetListBrand, CreateBrand, UpdateBrand, RemoveBrand} from "@/services/BrandService/BrandServices"
import type { Location } from "@/.umi/plugin-dva/connect"

export type Brand = {
  key?: string;
  id: string;
  name: string;
  description: string;
  isApprove: boolean;
  locations: Location[]
}

// export type Location = {
//   createBy: string;
//   createTime: string;
//   description: string;
//   id: string;
//   isActive: boolean;
//   isApprove: boolean;
//   latitude: number;
//   longitude: number;
//   matchingCode: number;
//   modifyBy?: string;
//   modifyTime?: string;
//   name: string;
// }

export type BrandModelState = {
  listBrand: Brand[];
  brandsTableLoading: boolean;
  totalItem: number;

  selectedBrand: Brand;
  getListBrandParam: GetBrandParam;

  createBrandParam: CreateBrandParam;

  updateBrandParam: UpdateBrandParam;

  addNewBrandModal: {
    isLoading: boolean;
    visible: boolean;
  },

  editBrandModal: {
    isLoading: boolean;
    visible: boolean;
  }
}

export type BrandStoreModel = {
  namespace: string;

  state: BrandModelState;

  effects: {
    getListBrands: Effect;
    createBrand: Effect;
    updateBrand: Effect;
    removeBrand: Effect;
  };

  reducers: {
    setListBrandsReducer: Reducer<BrandModelState>;
    setTotalItemReducer: Reducer<BrandModelState>;
    setBrandsTableLoadingReducer: Reducer<BrandModelState>;
    setSelectedBrandReducer: Reducer<BrandModelState>;
    setGetListBrandsParamReducer: Reducer<BrandModelState>;
    setCreateBrandParamReducer: Reducer<BrandModelState>;
    setUpdateBrandParamReducer: Reducer<BrandModelState>;
    setAddNewBrandModalReducer: Reducer<BrandModelState>;
    setEditBrandModalReducer: Reducer<BrandModelState>;
    clearGetListBrandsParamReducer: Reducer<BrandModelState>;
  }
}


const BrandStore: BrandStoreModel = {
  namespace: "brand",

  state: {
    listBrand: [],
    brandsTableLoading: false,
    totalItem: 0,
    createBrandParam: {
      description: "",
      name: ""
    },
    getListBrandParam: {
      isDescending: false,
      isPaging: true,
      orderBy: "",
      isSort: false,
      pageLimitItem: 10,
      pageNumber: 0,
      seachValue: ""
    },
    selectedBrand: {
      id: "",
      description: "",
      name: "",
      isApprove: false,
      locations: [],
    },

    updateBrandParam: {
      description: "",
      id: "",
      name: ""
    },

    addNewBrandModal: {
      isLoading: false,
      visible: false
    },

    editBrandModal: {
      isLoading: false,
      visible: false
    }
  },

  effects: {
    *getListBrands({ payload }, { call, put }) {
      const { data } = yield call(GetListBrand, payload);
      
      yield put({
        type: "setListBrandsReducer",
        payload: data.result.data.map((item: any) => {
          return {
            ...item,
            key: item.id
          }
        })
      })

      yield put({
        type: "setTotalItemReducer",
        payload: data.result.totalItem
      })

      yield put({
        type: "setGetListBrandsParamReducer",
        payload
      })
    },

    *createBrand({ payload }, { call }) {
      yield call(CreateBrand, payload);
    },

    *updateBrand({ payload }, { call }) {
      yield call(UpdateBrand, payload);
    },

    *removeBrand({ payload }, { call }) {
      yield call(RemoveBrand, payload);
    }
  },

  reducers: {
    setListBrandsReducer(state, { payload }) {
      return {
        ...state,
        listBrand: payload
      }
    },

    setBrandsTableLoadingReducer(state, { payload }) {
      return {
        ...state,
        brandsTableLoading: payload
      }
    },
    setTotalItemReducer(state, { payload }) {
      return {
        ...state,
        totalItem: payload
      }
    },
    setCreateBrandParamReducer(state, { payload }) {
      return {
        ...state,
        createBrandParam: {
          ...state?.createBrandParam,
          ...payload
        }
      }
    },

    setGetListBrandsParamReducer(state, { payload }) {
      return {
        ...state,
        getListBrandParam: {
          ...state?.getListBrandParam,
          ...payload
        }
      }
    },

    setSelectedBrandReducer(state, { payload }) {
      return {
        ...state,
        selectedBrand: {
          ...state?.selectedBrand,
          ...payload
        }
      }
    },

    setUpdateBrandParamReducer(state, { payload }) {
      return {
        ...state,
        updateBrandParam: {
          ...state?.updateBrandParam,
          ...payload
        }
      }
    },
    setAddNewBrandModalReducer(state, { payload }) {
      return {
        ...state,
        addNewBrandModal: {
          ...state?.addNewBrandModal,
          ...payload
        }
      }
    },

    setEditBrandModalReducer(state, { payload }) {
      return {
        ...state,
        editBrandModal: {
          ...state?.editBrandModal,
          ...payload
        }
      }
    },

    clearGetListBrandsParamReducer(state) {
      return {
        ...state,
        getListBrandParam: {
          isDescending: false,
          isPaging: true,
          isSort: false,
          orderBy: "",
          pageLimitItem: 10,
          pageNumber: 0,
          seachValue: ""
        }
      }
    }
  }
}

export default BrandStore;