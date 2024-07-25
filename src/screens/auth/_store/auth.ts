import {createSelector} from 'reselect';
import objectPath from 'object-path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import {put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {ICurrency} from '../../../store/currency';
import i18n from '../../../lang/_i18n';
import {BASE_URL} from '../../../store/ApiUrl';
import {IAction} from '../../../store/store';
import {ICountry} from '../../../store/shared-types';

export type TPhase =
  | null
  | 'loading'
  | 'adding'
  | 'updating'
  | 'deleting'
  | 'error'
  | 'success';

export interface IUserType {
  id: number;
  user_type_title: string;
}

export interface IUserLocale {
  countryCode?: string;
  isRTL?: boolean;
  languageCode?: string;
  languageTag?: string;
}

export interface IUser {
  id: number;
  name?: string;
  email?: string;
  user_type_title?: string;
  user_type_id?: number;
  is_active?: string;
  profile_pic?: string;
  country?: ICountry;
  country_id?: string;
  currency_id?: string;
  currency?: ICurrency;
  pwd_plain: string;
}

interface IAuthState {
  user?: IUser;
  accessToken?: string;
  userLocale?: IUserLocale;
  theme?: string;
  currency?: ICurrency;
  lang?: string;
  error?: string;
  phase?: TPhase;
}

interface IParentAuthState {
  auth: IAuthState;
}

type TActionAllState = IAuthState & {
  id: number;
  name: string;
  email: string;
  password: string;
  newPassowrd: string;
};

export const actionTypes = {
  AUTH_LOGIN: 'auth/LOGIN',
  SET_LOGIN_USER: 'auth/SET_LOGIN',
  SET_PHASE: 'auth/SET_PHASE',
  SET_THEME: 'auth/SET_THEME',
  SET_CURRENCY: 'auth/SET_CURRENCY',
  SET_CURRENCY_STORE: 'auth/SET_CURRENCY_STORE',
  SET_LANG: 'auth/SET_LANG',
  SET_ACTION_PHASE: 'auth/SET_ACTION_PHASE',
  SET_REGISTER: 'auth/SET_REGISTER',
  AUTH_LOGOUT: 'auth/AUTH_LOGOUT',
  DELETE_USER: 'auth/DELETE_USER',
  UPDATE_USER_PASSWORD: 'auth/UPDATE_USER_PASSWORD',
  UPDATE_USER_INFO: 'auth/UPDATE_USER_INFO',
  SET_USER_LOCALE: 'auth/SET_USER_LOCALE',
  UPDATE_USER: 'auth/UPDATE_USER',
};

export const initialAuthState: IAuthState = {
  user: null,
  accessToken: null,
  userLocale: null,
  theme: 'dark',
  currency: null,
  lang: 'en',
  phase: null,
  error: null,
};

export const authSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth']),
  (auth: IAuthState) => auth,
);
export const authAccessTokenSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'accessToken']),
  (accessToken: string) => accessToken,
);
export const userLocaleSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'userLocale']),
  (userLocale: IUserLocale) => userLocale,
);
export const authThemeSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'theme']),
  (theme: string) => theme,
);
export const authCurrencySelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'currency']),
  (currency: ICurrency) => currency,
);
export const authLangSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'lang']),
  (lang: string) => lang,
);
export const authUserSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'user']),
  (authUser: IUser) => authUser,
);
export const authPhaseSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'phase']),
  (authPhase: string) => authPhase,
);
export const authErrorSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ['auth', 'error']),
  (authError: string) => authError,
);

export const authReducer = persistReducer(
  {storage: AsyncStorage, key: 'auth'},
  (
    state: IAuthState = initialAuthState,
    action: IAction<TActionAllState>,
  ): IAuthState => {
    switch (action.type) {
      case actionTypes.AUTH_LOGIN: {
        return {...state};
      }
      case actionTypes.SET_LOGIN_USER: {
        const {accessToken, user} = action.payload;
        return {...state, accessToken, user};
      }
      case actionTypes.UPDATE_USER_INFO: {
        const {user} = action.payload;
        return {...state, user};
      }
      case actionTypes.AUTH_LOGOUT: {
        return {
          ...state,
          accessToken: null,
          phase: null,
          error: null,
          user: null,
          currency: null,
        };
      }
      case actionTypes.SET_PHASE: {
        const {phase, error} = action.payload;
        return {...state, phase, error};
      }
      case actionTypes.SET_THEME: {
        const {theme} = action.payload;
        return {...state, theme};
      }
      case actionTypes.SET_CURRENCY: {
        const {currency, user} = action.payload;
        return {...state, currency, user};
      }
      case actionTypes.SET_CURRENCY_STORE: {
        const {currency} = action.payload;
        return {...state, currency};
      }
      case actionTypes.SET_USER_LOCALE: {
        const {userLocale} = action.payload;
        return {...state, userLocale};
      }
      case actionTypes.SET_LANG: {
        const {lang} = action.payload;
        i18n.locale = lang;
        return {...state, lang};
      }
      default:
        return state;
    }
  },
);

export const authActions = {
  login: (email: string, password: string) => ({
    type: actionTypes.AUTH_LOGIN,
    payload: {email, password},
  }),
  setUserInfo: (user: IUser, accessToken: string) => ({
    type: actionTypes.SET_LOGIN_USER,
    payload: {user, accessToken},
  }),
  updateUserInfo: (user: IUser) => ({
    type: actionTypes.UPDATE_USER_INFO,
    payload: {user},
  }),
  updateUser: (user: IUser, email: string, name: string) => ({
    type: actionTypes.UPDATE_USER,
    payload: {user, email, name},
  }),
  deleteUser: (user: IUser) => ({
    type: actionTypes.DELETE_USER,
    payload: {user},
  }),
  updateUserPassword: (user: IUser, newPassowrd: string) => ({
    type: actionTypes.UPDATE_USER_PASSWORD,
    payload: {user, newPassowrd},
  }),
  register: (name: string, email: string, password: string) => ({
    type: actionTypes.SET_REGISTER,
    payload: {name, email, password},
  }),
  logout: () => ({
    type: actionTypes.AUTH_LOGOUT,
  }),
  setPhase: (phase: string, error: string) => ({
    type: actionTypes.SET_PHASE,
    payload: {phase, error},
  }),
  setTheme: (theme: string) => ({
    type: actionTypes.SET_THEME,
    payload: {theme},
  }),
  setUserLocale: (userLocale: IUserLocale) => ({
    type: actionTypes.SET_USER_LOCALE,
    payload: {userLocale},
  }),
  setCurrency: (currency: ICurrency, user: IUser) => ({
    type: actionTypes.SET_CURRENCY,
    payload: {currency, user},
  }),
  setCurrencyStore: (currency: ICurrency) => ({
    type: actionTypes.SET_CURRENCY_STORE,
    payload: {currency},
  }),
  setLang: (lang: string) => ({
    type: actionTypes.SET_LANG,
    payload: {lang},
  }),
};

export function* saga() {
  yield takeLatest(
    actionTypes.AUTH_LOGIN,
    function* loginSaga({payload}: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('loading', null));
      const {email, password} = payload;
      const response = yield axios.post(`${BASE_URL}/login`, {email, password});

      if (response === undefined) {
        yield put(authActions.setPhase('error', 'api_error'));
        return;
      } else if (response.data.error) {
        yield put(authActions.setPhase('error', response.data.error));
        return;
      }

      const {access_token, user} = response.data;

      yield put(authActions.setUserInfo(user, access_token));
      yield put(authActions.setPhase('success', null));
    },
  );

  yield takeLatest(
    actionTypes.SET_REGISTER,
    function* registerSaga({payload}: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('loading', null));

      const {name, email, password} = payload;
      const response = yield axios.post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      });

      if (response === undefined) {
        yield put(authActions.setPhase('error', 'api_error'));
        return;
      } else if (response.data.name) {
        yield put(authActions.setPhase('error', response.data.name));
        return;
      } else if (response.data.email) {
        yield put(authActions.setPhase('error', response.data.email));
        return;
      } else if (response.data.password) {
        yield put(authActions.setPhase('error', response.data.password));
        return;
      }

      const {access_token, user} = response.data;

      yield put(authActions.setUserInfo(user, access_token));
      yield put(authActions.setPhase('success', null));
    },
  );

  yield takeLatest(
    actionTypes.DELETE_USER,
    function* deleteUsesrSaga({payload}: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('user-deleting', null));

      const {user} = payload;

      const response = yield axios.post(`${BASE_URL}/delete-user/${user.id}`);

      if (response.status !== 200) {
        yield put(authActions.setPhase('user-deleting-error', 'api_error'));
        return;
      } else if (response.data.error) {
        yield put(
          authActions.setPhase('user-updating-error', response.data.error),
        );
        return;
      } else {
        yield put(authActions.logout());
        yield put(authActions.setPhase('success', null));
      }
    },
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_PASSWORD,
    function* updateUserPasswordSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('user-updating-password', null));

      const {user, newPassowrd} = payload;
      const response = yield axios.post(`${BASE_URL}/updateUserPassword`, {
        userId: user.id,
        newPassword: newPassowrd,
      });

      if (response.data.error) {
        yield put(
          authActions.setPhase('user-updating-password-error', 'api_error'),
        );
        return;
      } else {
        const {userData} = response.data;
        yield put(authActions.updateUserInfo(userData));
        yield put(authActions.setPhase('user-updating-password-success', null));
      }
    },
  );

  yield takeLatest(
    actionTypes.SET_CURRENCY,
    function* setCurrencySaga({payload}: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('currency-updating', null));

      const {currency, user} = payload;

      const response = yield axios.post(
        `${BASE_URL}/update-currency/${user.id}`,
        {
          currency_id: currency.id,
        },
      );

      if (response === undefined) {
        yield put(authActions.setPhase('currency-updating-error', 'api_error'));
        return;
      } else if (response.data.error) {
        yield put(
          authActions.setPhase('currency-updating-error', response.data.error),
        );
        return;
      }

      const {userData} = response.data;

      yield put(authActions.updateUserInfo(userData));
      yield put(authActions.setPhase('currency-updating-success', null));
    },
  );

  yield takeLatest(
    actionTypes.UPDATE_USER,
    function* updataUserSaga({payload}: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase('user-updating', null));

      const {user, email, name} = payload;
      const response = yield axios.post(
        `${BASE_URL}/update-user-info/${user.id}`,
        {
          name: name,
          email: email,
        },
      );

      if (response === undefined) {
        yield put(authActions.setPhase('user-updating-error', 'api_error'));
        return;
      } else if (response.data.error) {
        yield put(
          authActions.setPhase('user-updating-error', response.data.error),
        );
        return;
      }

      const {userData} = response.data;

      yield put(authActions.updateUserInfo(userData));
      yield put(authActions.setPhase('user-updating-success', null));
    },
  );
}
