import type { AuthenticationRequest } from './../services/login';
import EtherService from '@/configs/Support';
import { GoogleLogin, PostAuthentication } from '@/services/login';
import type { Effect, Reducer } from 'umi';
import {history} from 'umi';
import jwt_decode from "jwt-decode";
import firebase from '@/services/FirebaseService/firebase';
import { CreateFolder, GetFolders } from '@/services/PublitioService/PublitioService';
import { GetAccountById } from '@/services/AccountService/Account';

export type CurrentUser = {
  id: string | null;
  name: string | null;
  userId: string | null;
  avatar: string | null;
  email: string | null;
  ether: EtherService | null;
  rootFolderId: string | null;
}
// Create state type
export type UserTestModelState = {
  currentUser: CurrentUser
}

// Create Model
export type UserModelType = {
  // 1. Namespace
  namespace: string
  // 2. State
  state: UserTestModelState
  // 3. Effects
  effects: {
    // Effect receive 2 param are: action with AnyAction type and Effect command (put, call, takeEvery, ...)
    setUser: Effect;
    readJWT: Effect;
    getCurrentUser: Effect;
  }
  // 4. Reducers
  reducers: {
    setCurrentUser: Reducer<UserTestModelState>;

  }
}


const UserModel: UserModelType = {
  namespace: "userTest",
  state: {
    currentUser: {
      id: "",
      avatar: "",
      email: "",
      ether: null,
      name: "",
      userId: "",
      rootFolderId: null,
    },
  },
  effects: {

    *setUser(_, { call, put }) {
      
      const firebaseResponse = yield call(GoogleLogin);
      console.log(firebaseResponse);
      const ether = yield EtherService.build();
      const tokenFirebase = yield firebase.auth().currentUser?.getIdToken(); // Mac ke
      // console.log(tokenFirebase);
      if (firebaseResponse.additionalUserInfo.isNewUser) {
        const res = yield call(CreateFolder, { name: firebaseResponse.user.uid });
        yield ether.createAccount();
        const walletKeyStore: any = yield ether.createKeyStoreJson(firebaseResponse.user.uid);
        const param: AuthenticationRequest = {
          firebaseToken: tokenFirebase,
          uid: firebaseResponse.user.uid,
          walletKeyStore,
          walletAddress: ether.wallet.address,
          rootFolderId: res.id
        }
        // console.log(param);
        
        yield call(PostAuthentication, param);
        
      } else {
        
        const decoded: any = jwt_decode(tokenFirebase);
        
        console.log(decoded);
        // .user_id
        // yield call(PostAuthentication, param);
        yield ether.readKeyStoreJson(decoded.WalletKeyStore, firebaseResponse.user.uid)
        const res = yield call(GetFolders, { parent_id: null });
        console.log(res);
        
      }
      console.log('====================================');
      console.log("EtherService >>>>", ether);
      console.log('====================================');
      yield ether.initContracts();
      
      const again = yield firebase.auth().currentUser?.getIdToken();
      console.log(jwt_decode(again));
      const decoded: any = jwt_decode(again);
      localStorage.setItem("JWT", again);
      
      yield put({
        type: "setCurrentUser",
        payload: {
          id: decoded.Id,
          email: decoded.email,
          name: decoded.name,
          avatar: decoded.picture,
          uid: decoded.user_id,
          ether
        }
      });

      history.replace("/welcome");
      
    },

    *readJWT(_, { put }) {
      const token = yield localStorage.getItem("JWT");
      // const res = yield call(CreateFolder, { name: token.user_id });
      // console.log("Create Folder >>>>", res);
      if (token) {
        const decode = yield jwt_decode(token);
        const ether = yield EtherService.build();
        yield ether.readKeyStoreJson(decode.WalletKeyStore, decode.user_id)
        yield ether.initContracts();
        console.log(decode);
        yield put({
          type: "setCurrentUser",
          payload: {
            id: decode.Id,
            name: decode.name,
            avatar: decode.photoURL,
            email: decode.email,
            userId: decode.user_id,
            ether
          }
        })
      }
    },

    *getCurrentUser(_, { call, put }) {
      const {data} = yield call(GetAccountById);
      console.log(data.result);
      
      yield put({
        type: "setCurrentUser",
        payload: data.result
      })

      return data.result;
    }
  },
  reducers: {
    setCurrentUser(state, { payload }) {

      return {
        ...state,
        currentUser: {
          ...state?.currentUser,
          ...payload
        }
      };
    },

  }
}

export default UserModel;