import {
  DeleteDevice,
  GetDeviceParams,
  GetDevices,
  GetListTypes,
  UpdateDevice,
  UpdateDeviceParams,
  UpdateListDevices,
  UpdateListDevicesParam,
} from '@/services/DevicePageService';
import moment from 'moment';
import type { Effect, Reducer } from 'umi';

export type DeviceType = {
  key: string;
  resolution: string;
  name: string;
  description: string;
  macaddress: string;
  id: string;
  isPublished: boolean;
  dateFilter: string[];
  timeFilter: string[];
  startDate?: string;
  endDate?: string;
  latitude: string;
  longitude: string;
  minBid: number;
  isActive: boolean;
  createTime: string;
  type: {
    id: string;
    typeName: string;
  };
};

export type DeviceModelState = {
  selectedDevice: DeviceType;
  listDevices: any[];
  listDeviceTypes: any[];
  editDeviceVisible: boolean;
  selectedDevices: any[];
  editMultipleDevicesDrawerVisible: boolean;

  // Update Drawer Model State
  isUpdateMultiple: boolean;
  updateDevicesState: UpdateListDevicesParam;
  getDevicesParam: GetDeviceParams;
  totalItem: number;
};

export type DeviceModelType = {
  // 1. Namespace
  namespace: string;

  // 2. State
  state: DeviceModelState;

  // 3. Effects
  effects: {
    setListDevices: Effect;
    getDevices: Effect;
    updateDevice: Effect;
    getListDevicesOnCurrentPage: Effect;
    deleteDevice: Effect;
    getDeviceType: Effect;
    updateListDevice: Effect;
    setGetDevicesParam: Effect;
  };

  // 4. Reducers
  reducers: {
    setDevices: Reducer<DeviceModelState>;
    setCurrentDevice: Reducer<DeviceModelState>;
    setEditModalVisible: Reducer<DeviceModelState>;
    setSelectedDevices: Reducer<DeviceModelState>;
    setEditMultipleDevicesDrawerVisible: Reducer<DeviceModelState>;
    setUpdateDevicesState: Reducer<DeviceModelState>;
    setListDeviceTypes: Reducer<DeviceModelState>;
    clearUpdateDevicesDrawer: Reducer<DeviceModelState>;
    setMultipleUpdateMode: Reducer<DeviceModelState>;
    setGetDevicesParamReducer: Reducer<DeviceModelState>;
    clearGetDevicesParam: Reducer<DeviceModelState>;
    setTotalItemReducer: Reducer<DeviceModelState>;
  };
};

const DeviceModel: DeviceModelType = {
  //

  namespace: 'deviceStore',

  //
  state: {
    listDevices: [],
    selectedDevice: {
      key: '',
      resolution: '',
      description: '',
      macaddress: '',
      name: '',
      createTime: '',
      id: '',
      isPublished: false,
      dateFilter: [],
      timeFilter: [],
      endDate: '',
      isActive: true,
      latitude: '',
      longitude: '',
      minBid: 0,
      startDate: '',
      type: {
        id: '',
        typeName: '',
      },
    },
    getDevicesParam: {
      isDescending: false,
      isPaging: true,
      isSort: false,
      orderBy: '',
      pageLimitItem: 10,
      pageNumber: 1,
      name: '',
      typeId: null,
    },
    listDeviceTypes: [],
    editDeviceVisible: false,
    selectedDevices: [],
    editMultipleDevicesDrawerVisible: false,

    // Update Drawer Model State
    isUpdateMultiple: true,
    updateDevicesState: {
      dateFilter: ['0', '0', '0', '0', '0', '0', '0'],
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      isPublished: false,
      idList: [],
      typeId: '',
      minBid: 0,
      timeFilter: [
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
      ],
      currentType: '',
    },

    //--------------

    totalItem: 0,
    //----------------
  },

  //
  effects: {
    *setListDevices({ payload }, { put }) {
      yield put({
        type: 'setDevices',
        payload,
      });
    },

    *getDevices({ payload }, { call, put }) {
      let param: GetDeviceParams = {
        isDescending: false,
        isPaging: true,
        isSort: false,
        orderBy: '',
        pageLimitItem: 10,
        pageNumber: 1,
        name: '',
        typeId: null,
      };
      if (payload) {
        param = payload;
      }

      yield put({
        type: 'setGetDevicesParamReducer',
        payload,
      });

      let res = null;
      res = yield call(GetDevices, param);
      yield put({
        type: 'setTotalItemReducer',
        payload: res.result.totalItem,
      });
      res = res.result.data.map((d: any) => {
        return {
          key: d.id,
          ...d,
          dateFilter: d.dateFilter?.split(''),
          timeFilter: d.timeFilter?.split(''),
          createTime: moment(d.createTime).format('YYYY-MM-DD'),
        };
      });
      console.log(res);
      yield put({
        type: 'setDevices',
        payload: res,
      });
    },

    *updateDevice({ payload }, { call }) {
      const param: UpdateDeviceParams = {
        dateFilter: payload.dateFilter.toString().replaceAll(',', ''),
        description: payload.description,
        endDate: payload.endDate,
        minBid: 0,
        isPublished: payload.isPublished,
        startDate: payload.startDate,
        timeFilter: payload.timeFilter.toString().replaceAll(',', ''),
        name: payload.name,
        typeId: payload.type.id,
      };
      yield call(UpdateDevice, param, payload.id);
    },

    *updateListDevice({ payload }, { call }) {
      const param: UpdateListDevicesParam = {
        currentType: '',
        dateFilter: payload.updateDevicesState.dateFilter.toString().replaceAll(',', ''),
        timeFilter: payload.updateDevicesState.timeFilter.toString().replaceAll(',', ''),
        startDate: payload.updateDevicesState.startDate,
        endDate: payload.updateDevicesState.endDate,
        idList: payload.listId,
        minBid: payload.updateDevicesState.minBid,
        typeId: payload.updateDevicesState.typeId,
        isPublished: payload.isPublish
      };
      yield call(UpdateListDevices, param);
    },

    *setGetDevicesParam({ payload }, { call, put }) {
      yield call(GetDevices, payload);

      yield put({
        type: 'setGetDevicesParamReducer',
        payload,
      });
    },

    *getListDevicesOnCurrentPage({ payload }, { call, put }) {
      const param: GetDeviceParams = {
        isDescending: payload.isDesc,
        isPaging: true,
        isSort: false,
        orderBy: '',
        pageLimitItem: payload.limit,
        pageNumber: payload.currentPage,
        name: '',
        typeId: null,
      };
      let res = yield call(GetDevices, param);
      res = res.map((device: any) => {
        return {
          key: device.id,
          ...device,
          dateFilter: device.dateFilter?.split(''),
          timeFilter: device.timeFilter?.split(''),
          createTime: moment(device.creataTime).format('YYYY-MM-DDD'),
          typeName: device.type.typeName,
        };
      });

      yield put({
        type: 'setDevices',
        payload: res,
      });
    },

    *deleteDevice({ payload }, { call }) {
      yield call(DeleteDevice, payload);
    },

    *getDeviceType(_, { call, put }) {
      const data = yield call(GetListTypes);
      yield put({
        type: 'setListDeviceTypes',
        payload: data.result.data.map((item: any) => {
          return {
            key: item.id,
            ...item
          }
        }),
      });
    },
  },

  //
  reducers: {
    setDevices(state, { payload }) {
      // console.log("Current State Of Device Store >>>>", state);

      return {
        ...state,
        listDevices: payload,
      };
    },

    setCurrentDevice(state, { payload }: any) {
      console.log('Current State Of Device Store >>>>', state, payload);
      return {
        ...state,
        selectedDevice: payload,
      };
    },

    setEditModalVisible(state, { payload }: any) {
      // console.log("Current State Of Device Store >>>>", state);
      return {
        ...state,
        editDeviceVisible: payload,
      };
    },

    setSelectedDevices(state, { payload }: any) {
      // console.log("Set selected Device >>>>", payload);

      //  console.log("Current State Of Device Store >>>>", state);
      return {
        ...state,
        selectedDevices: payload,
      };
    },

    setEditMultipleDevicesDrawerVisible(state, { payload }) {
      return {
        ...state,
        editMultipleDevicesDrawerVisible: payload,
      };
    },

    setUpdateDevicesState(state, { payload }) {
      console.log('Update Reducer >>>', payload);

      return {
        ...state,
        updateDevicesState: payload,
      };
    },

    setListDeviceTypes(state, { payload }) {
      return {
        ...state,
        listDeviceTypes: payload,
        updateDevicesState: {
          ...state.updateDevicesState,
          currentType: payload[0].typeName,
        },
      };
    },
    clearUpdateDevicesDrawer(state) {
      return {
        ...state,
        selectedDevices: [],
        updateDevicesState: {
          currentType: '',
          dateFilter: ['0', '0', '0', '0', '0', '0', '0'],
          endDate: moment(Date.now()).format('YYYY-MM-DD'),
          idList: [],
          minBid: 0,
          startDate: moment(Date.now()).format('YYYY-MM-DD'),
          timeFilter: [
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
          ],
          typeId: '',
        },
      };
    },

    setMultipleUpdateMode(state, { payload }) {
      return {
        ...state,
        isUpdateMultiple: payload,
      };
    },

    setGetDevicesParamReducer(state, { payload }) {
      console.log('Get Param >>>>', payload);

      return {
        ...state,
        getDevicesParam: payload,
      };
    },

    clearGetDevicesParam(state) {
      return {
        ...state,
        getDevicesParam: {
          isDescending: false,
          isPaging: true,
          isSort: false,
          orderBy: '',
          pageLimitItem: 10,
          pageNumber: 1,
          searchValue: '',
        },
      };
    },

    setTotalItemReducer(state, { payload }) {
      return {
        ...state,
        totalItem: payload,
      };
    },
  },
};

export default DeviceModel;
