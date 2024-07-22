import {createSelector} from 'reselect';
import objectPath from 'object-path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import {put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {IAction} from './store';
import {BASE_URL} from './ApiUrl';

export type TPhase =
  | null
  | 'loading'
  | 'adding'
  | 'updating'
  | 'deleting'
  | 'error'
  | 'adding-success'
  | 'deleted-success'
  | 'success';

export interface ICurrency {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

interface ICurrencyState {
  currencies: ICurrency[];
  phase: TPhase;
}

type TActionAllState = ICurrencyState & {
  id: number;
  currency: ICurrency;
  currencyInfo: Partial<ICurrency>;
};

export const actionTypes = {
  PULL_CURRENCIES: 'currencies/PULL_CURRENCIES',
  SET_CURRENCIES: 'currencies/SET_CURRENCIES',
  SET_PHASE: 'currencies/SET_PHASE',
};

export const initialState: ICurrencyState = {
  currencies: [],
  phase: null,
};

export const currenciesSelector = createSelector(
  (state: ICurrencyState) =>
    objectPath.get(state, ['currencies', 'currencies']),
  (currencies: ICurrency[]) => currencies,
);

export const currenciesPhaseSelector = createSelector(
  (state: ICurrencyState) => objectPath.get(state, ['currencies', 'phase']),
  (phase: string) => phase,
);

export const currencyReducer = persistReducer(
  {storage: AsyncStorage, key: 'currencies'},
  (
    state: ICurrencyState = initialState,
    action: IAction<TActionAllState>,
  ): ICurrencyState => {
    switch (action.type) {
      case actionTypes.SET_CURRENCIES: {
        const {currencies} = action.payload;
        return {...state, currencies};
      }
      case actionTypes.SET_PHASE: {
        const {phase} = action.payload;
        return {...state, phase};
      }
      default:
        return state;
    }
  },
);

export const currencyActions = {
  pullCurrencies: (): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_CURRENCIES,
  }),
  setCurrencies: (
    currencies: ICurrency[],
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_CURRENCIES,
    payload: {currencies},
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: {phase},
  }),
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_CURRENCIES,
    function* pullCurrenciesSaga({payload}: IAction<Partial<TActionAllState>>) {
      yield put(currencyActions.setPhase('loading'));

      const response = yield axios.get(`${BASE_URL}/get-currencies`);

      if (response === undefined) {
        yield put(currencyActions.setPhase('error'));
        return;
      } else if (response.status !== 200) {
        yield put(currencyActions.setPhase('error'));
        return;
      }

      const {currencies} = response.data;

      yield put(currencyActions.setCurrencies(currencies));
      yield put(currencyActions.setPhase('success'));
    },
  );
}
