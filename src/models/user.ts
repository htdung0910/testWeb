import jwt_decode from 'jwt-decode';
import  type{ Effect, Reducer } from 'umi';
import {history} from 'umi';
import { queryCurrent } from '@/services/user';
import EtherService from '@/configs/Support';
import { GoogleLogin, PostAuthentication } from '@/services/login';
import type { AuthenticationRequest } from '@/services/login';
import firebase from 'firebase';
import { CreateFolder, GetFolders } from '@/services/PublitioService/PublitioService';

export type CurrentUser = {
  avatar?: string;
  name?: string;
  email?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
  ethers?: EtherService
};

export type UserModelState = {
  currentUser?: CurrentUser;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      // const response = yield call(queryUsers);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });

      const firebaseResponse = yield call(GoogleLogin);
      console.log(firebaseResponse);
      const ether = yield EtherService.build();
      const tokenFirebase = yield firebase.auth().currentUser?.getIdToken(); // Mac ke
      
      if (firebaseResponse.additionalUserInfo.isNewUser) {
        const res = yield call(CreateFolder, { name: firebaseResponse.user.uid });
        yield ether.createAccount();
        const walletKeyStore: any = yield ether.createKeyStoreJson(firebaseResponse.user.uid);
        const param: AuthenticationRequest = {
          firebaseToken: tokenFirebase,
          uid: firebaseResponse.user.uid,
          walletKeyStore,
          walletAddress: ether.wallet.address,
          rootFolderId: res.id,
        };
        // console.log(param);

        yield call(PostAuthentication, param);
      } else {
        const decoded: any = jwt_decode(tokenFirebase);

        console.log(decoded);
        // .user_id
        // yield call(PostAuthentication, param);
        yield ether.readKeyStoreJson(decoded.WalletKeyStore, firebaseResponse.user.uid);
        const res = yield call(GetFolders, { parent_id: null });
        console.log(res);
      }

      yield ether.initContracts();
      const again = yield firebase.auth().currentUser?.getIdToken();
      console.log(jwt_decode(again));
      const decoded: any = jwt_decode(again);
      localStorage.setItem("JWT", again);
      
      yield put({
        type: "saveCurrentUser",
        payload: {
          id: decoded.Id,
          email: decoded.email,
          displayName: decoded.displayName,
          photoURL: decoded.picture,
          uid: decoded.user_id,
          ether
        }
      });

      history.replace("/welcome")
      
    },
    *fetchCurrent(_ , { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
