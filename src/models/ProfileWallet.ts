import { GetListTransactions } from "@/services/TOMOService";
import type { GetListTransactionParam } from '@/services/TOMOService';
import { diffTwoDate } from "@/utils/utils";
import moment from "moment";
import type { Effect, Reducer } from "umi";

export type TransactionType = {
  address: string;
  blockHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  value: string;
  valueNumber: number;
  symbol: string;
  decimals: string;
  blockTime: string;
}

export type ProfileWalletModelState = {
  listTransactions: TransactionType[],
  getTransactionsParam: GetListTransactionParam;
  balance: number;
  totalTransaction: number;
}



export type WalletStoreType = {
  namespace: string,
  
  state: ProfileWalletModelState,

  effects: {
    setListTransactions: Effect
  },

  reducers: {
    setListTransactionsReducer: Reducer<ProfileWalletModelState>,
    setCallTransactionsParamReducer: Reducer<ProfileWalletModelState>,
    setBalance: Reducer<ProfileWalletModelState>,
    setTotalTransaction: Reducer<ProfileWalletModelState>
  }

}

const WalletModel: WalletStoreType = {
  namespace: "profileWallet",

  state: {
    listTransactions: [],
    getTransactionsParam: {
      holder: "",
      limit: 10,
      page: 1,
    },

    balance: 0,

    totalTransaction: 0,
    
  },

  effects: {
    *setListTransactions({ payload }, { call, put }) {
      
      const result = yield call(GetListTransactions, payload);
      console.log("Profile Wallet >>>>", result, result.data);
      
      yield put({
        type: "setListTransactionsReducer",
        payload: result.data.items.map((item: TransactionType) => {
          const now = moment();
          const date = moment(item.timestamp);
          
          const diff = diffTwoDate(now, date);
          return {
            key: item.blockNumber,
            ...item,
            timestamp: moment(item.timestamp).format("YYYY-MM-DD"),
            age: diff,
          }
        })
      })

      yield put({
        type: "setTotalTransaction",
        payload: result.data.total,
      })

      yield put({
        type: "setCallTransactionsParamReducer",
        payload
      })
    }
  },

  reducers: {
    setListTransactionsReducer(state, { payload }) {
      return {
        ...state,
        listTransactions: payload
      }
    },

    setCallTransactionsParamReducer(state, { payload }) {
      return {
        ...state,
        getTransactionsParam: payload
      }
    },

    setBalance(state, { payload }) {
      return {
        ...state,
        balance: payload
      }
    },

    setTotalTransaction(state, { payload }) {
      return {
        ...state,
        totalTransaction: payload
      }
    }
  }
}

export default WalletModel;
