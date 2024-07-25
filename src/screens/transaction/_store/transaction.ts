import {createSelector} from 'reselect';
import objectPath from 'object-path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import {put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {ICurrency} from '../../../store/currency';
import {IUser} from '../../auth/_store/auth';
import {IAction} from '../../../store/store';
import {BASE_URL} from '../../../store/ApiUrl';
import {produce} from 'immer';

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

export interface ITransaction {
  id: number;
  title: string;
  amount: string;
  category_id: number;
  created_at: Date;
  user_id: number;
  type: string;
  currency_id: number;
  currency?: ICurrency;
}

interface ITransactionState {
  userTransactions: ITransaction[];
  phase: TPhase;
}

type TActionAllState = ITransactionState & {
  id: number;
  user: IUser;
  currency: ICurrency;
  userTransaction: ITransaction;
  userTransactionInfo: Partial<ITransaction>;
};

export const actionTypes = {
  PULL_USER_TRANSACTIONS: 'userTransactions/PULL_USER_TRANSACTIONS',
  SET_USER_TRANSACTIONS: 'userTransactions/SET_USER_TRANSACTIONS',
  ADD_USER_TRANSACTION: 'userTransactions/ADD_USER_TRANSACTION',
  UPDATE_USER_TRANSACTION: 'userTransactions/UPDATE_USER_TRANSACTION',
  DELETE_USER_TRANSACTION: 'userTransactions/DELETE_USER_TRANSACTION',
  REMOVE_USER_TRANSACTION: 'userTransactions/REMOVE_USER_TRANSACTION',
  SET_USER_TRANSACTION: 'userTransactions/SET_USER_TRANSACTION',
  SET_PHASE: 'userTransactions/SET_PHASE',
};

export const initialState: ITransactionState = {
  userTransactions: [],
  phase: null,
};

export const userTransactionsSelector = createSelector(
  (state: ITransactionState) =>
    objectPath.get(state, ['userTransactions', 'userTransactions']),
  (userTransactions: ITransaction[]) => userTransactions,
);

export const userTransactionsPhaseSelector = createSelector(
  (state: ITransactionState) =>
    objectPath.get(state, ['userTransactions', 'phase']),
  (phase: string) => phase,
);

export const userTransactionsReducer = persistReducer(
  {storage: AsyncStorage, key: 'userTransactions'},
  (
    state: ITransactionState = initialState,
    action: IAction<TActionAllState>,
  ): ITransactionState => {
    switch (action.type) {
      case actionTypes.SET_USER_TRANSACTIONS: {
        const {userTransactions} = action.payload;
        return {...state, userTransactions};
      }
      case actionTypes.SET_USER_TRANSACTION: {
        const {userTransaction} = action.payload;
        return produce(state, draftState => {
          const index = draftState.userTransactions.findIndex(
            d => d.id === userTransaction.id,
          );
          if (index > -1) {
            draftState.userTransactions[index] = userTransaction;
          } else {
            draftState.userTransactions.unshift(userTransaction);
          }
        });
      }
      case actionTypes.REMOVE_USER_TRANSACTION: {
        const {id} = action.payload;
        const userTransactions = {...state}.userTransactions.filter(
          d => d.id !== id,
        );
        return {...state, userTransactions};
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

export const userTransactionsActions = {
  pullUserTransactions: (user: IUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_USER_TRANSACTIONS,
    payload: {user},
  }),
  setUserTransactions: (
    userTransactions: ITransaction[],
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_USER_TRANSACTIONS,
    payload: {userTransactions},
  }),
  addUserTransaction: (
    userTransactionInfo: Partial<ITransaction>,
    user: IUser,
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_USER_TRANSACTION,
    payload: {userTransactionInfo, user},
  }),
  updateUserTransaction: (
    userTransactionInfo: Partial<ITransaction>,
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_TRANSACTION,
    payload: {userTransactionInfo},
  }),
  deleteUserTransaction: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_USER_TRANSACTION,
    payload: {id},
  }),
  removeUserTransaction: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_USER_TRANSACTION,
    payload: {id},
  }),
  setUserTransaction: (
    userTransaction: ITransaction,
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_USER_TRANSACTION,
    payload: {userTransaction},
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: {phase},
  }),
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_USER_TRANSACTIONS,
    function* pullUserTransactionsaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userTransactionsActions.setPhase('loading'));

      const {user} = payload;
      const response = yield axios.get(`${BASE_URL}/get-expenses/${user.id}`);

      if (response === undefined) {
        yield put(userTransactionsActions.setPhase('error'));
        return;
      } else if (response.status !== 200) {
        yield put(userTransactionsActions.setPhase('error'));
        return;
      }

      const {expenses} = response.data;

      yield put(userTransactionsActions.setUserTransactions(expenses));
      yield put(userTransactionsActions.setPhase('success'));
    },
  );

  yield takeLatest(
    actionTypes.ADD_USER_TRANSACTION,
    function* adduserTransactionsSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userTransactionsActions.setPhase('loading'));

      const {userTransactionInfo, user} = payload;

      const response = yield axios.post(`${BASE_URL}/create-expense`, {
        title: userTransactionInfo.title,
        amount: userTransactionInfo.amount.toString(),
        type: userTransactionInfo.type,
        category_id: userTransactionInfo.category_id,
        user_id: user.id,
        created_at: userTransactionInfo.created_at,
      });

      if (response.status !== 200 || response === undefined) {
        yield put(userTransactionsActions.setPhase('error'));
        return;
      }

      const {expenses} = response.data;

      yield put(userTransactionsActions.setUserTransaction(expenses));
      yield put(userTransactionsActions.setPhase('adding-success'));
    },
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_TRANSACTION,
    function* updateAccountCodeSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userTransactionsActions.setPhase('updating'));

      const {userTransactionInfo} = payload;
      const response = yield axios.patch(
        `${BASE_URL}/update-expense/${userTransactionInfo.id}`,
        {
          title: userTransactionInfo.title,
          amount: userTransactionInfo.amount.toString(),
        },
      );

      if (response.status !== 200 || response === undefined) {
        yield put(userTransactionsActions.setPhase('error'));
        return;
      }

      const {expense} = response.data;

      yield put(userTransactionsActions.setUserTransaction(expense));
      yield put(userTransactionsActions.setPhase('success'));
    },
  );

  yield takeLatest(
    actionTypes.DELETE_USER_TRANSACTION,
    function* deleteAccountCodeSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userTransactionsActions.setPhase('loading'));

      const {id} = payload;
      const response = yield axios.post(`${BASE_URL}/delete-expense/${id}`);

      if (response.status !== 200) {
        yield put(userTransactionsActions.setPhase('error'));
        return;
      }
      yield put(userTransactionsActions.removeUserTransaction(id));
      yield put(userTransactionsActions.setPhase('deleted-success'));
    },
  );
}
