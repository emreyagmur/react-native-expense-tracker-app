import {createSelector} from 'reselect';
import objectPath from 'object-path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import {put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {ICurrency} from '../../../store/currency';
import {IUser} from '../../auth/_store/auth';
import {IAction} from '../../../store/store';
import {BASE_URL} from 'src/store/ApiUrl';
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
  incomeExpenses: ITransaction[];
  phase: TPhase;
}

type TActionAllState = ITransactionState & {
  id: number;
  user: IUser;
  currency: ICurrency;
  incomeExpense: ITransaction;
  incomeExpenseInfo: Partial<ITransaction>;
};

export const actionTypes = {
  PULL_INCOME_EXPENSES: 'incomeExpenses/PULL_INCOME_EXPENSES',
  SET_INCOME_EXPENSES: 'incomeExpenses/SET_INCOME_EXPENSES',
  ADD_INCOME_EXPENSE: 'incomeExpenses/ADD_INCOME_EXPENSE',
  UPDATE_INCOME_EXPENSE: 'incomeExpenses/UPDATE_INCOME_EXPENSE',
  DELETE_INCOME_EXPENSE: 'incomeExpenses/DELETE_INCOME_EXPENSE',
  REMOVE_INCOME_EXPENSE: 'incomeExpenses/REMOVE_INCOME_EXPENSE',
  SET_INCOME_EXPENSE: 'incomeExpenses/SET_INCOME_EXPENSE',
  SET_PHASE: 'incomeExpenses/SET_PHASE',
};

export const initialState: ITransactionState = {
  incomeExpenses: [],
  phase: null,
};

export const incomeExpensesSelector = createSelector(
  (state: ITransactionState) =>
    objectPath.get(state, ['incomeExpenses', 'incomeExpenses']),
  (incomeExpenses: ITransaction[]) => incomeExpenses,
);

export const incomeExpensesPhaseSelector = createSelector(
  (state: ITransactionState) =>
    objectPath.get(state, ['incomeExpenses', 'phase']),
  (phase: string) => phase,
);

export const incomeExpenseReducer = persistReducer(
  {storage: AsyncStorage, key: 'income-expense'},
  (
    state: ITransactionState = initialState,
    action: IAction<TActionAllState>,
  ): ITransactionState => {
    switch (action.type) {
      case actionTypes.SET_INCOME_EXPENSES: {
        const {incomeExpenses} = action.payload;
        return {...state, incomeExpenses};
      }
      case actionTypes.SET_INCOME_EXPENSE: {
        const {incomeExpense} = action.payload;
        return produce(state, draftState => {
          const index = draftState.incomeExpenses.findIndex(
            d => d.id === incomeExpense.id,
          );
          if (index > -1) {
            draftState.incomeExpenses[index] = incomeExpense;
          } else {
            draftState.incomeExpenses.unshift(incomeExpense);
          }
        });
      }
      case actionTypes.REMOVE_INCOME_EXPENSE: {
        const {id} = action.payload;
        const incomeExpenses = {...state}.incomeExpenses.filter(
          d => d.id !== id,
        );
        return {...state, incomeExpenses};
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

export const incomeExpensesActions = {
  pullIncomeExpenses: (user: IUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_INCOME_EXPENSES,
    payload: {user},
  }),
  setIncomeExpenses: (
    incomeExpenses: ITransaction[],
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_INCOME_EXPENSES,
    payload: {incomeExpenses},
  }),
  addIncomeExpense: (
    incomeExpenseInfo: Partial<ITransaction>,
    user: IUser,
    currency: ICurrency,
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_INCOME_EXPENSE,
    payload: {incomeExpenseInfo, user, currency},
  }),
  updateIncomeExpense: (
    incomeExpenseInfo: Partial<ITransaction>,
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_INCOME_EXPENSE,
    payload: {incomeExpenseInfo},
  }),
  deleteIncomeExpense: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_INCOME_EXPENSE,
    payload: {id},
  }),
  removeIncomeExpense: (id: number): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_INCOME_EXPENSE,
    payload: {id},
  }),
  setIncomeExpense: (
    incomeExpense: ITransaction,
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_INCOME_EXPENSE,
    payload: {incomeExpense},
  }),
  setPhase: (phase: TPhase): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: {phase},
  }),
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_INCOME_EXPENSES,
    function* pullIncomeExpenseSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(incomeExpensesActions.setPhase('loading'));

      const {user} = payload;
      const response = yield axios.get(`${BASE_URL}/get-expenses/${user.id}`);

      if (response === undefined) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      } else if (response.status !== 200) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      }

      const {expenses} = response.data;

      yield put(incomeExpensesActions.setIncomeExpenses(expenses));
      yield put(incomeExpensesActions.setPhase('success'));
    },
  );

  yield takeLatest(
    actionTypes.ADD_INCOME_EXPENSE,
    function* addIncomeExpensesSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(incomeExpensesActions.setPhase('loading'));

      const {incomeExpenseInfo, user, currency} = payload;

      console.log(incomeExpenseInfo, currency);

      const response = yield axios.post(`${BASE_URL}/create-expense`, {
        title: incomeExpenseInfo.title,
        amount: incomeExpenseInfo.amount.toString(),
        type: incomeExpenseInfo.type,
        category_id: incomeExpenseInfo.category_id,
        user_id: user.id,
        currency_id: currency.id,
        created_at: incomeExpenseInfo.created_at,
      });

      if (response.status !== 200 || response === undefined) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      }

      const {expenses} = response.data;

      yield put(incomeExpensesActions.setIncomeExpense(expenses));
      yield put(incomeExpensesActions.setPhase('adding-success'));
    },
  );

  yield takeLatest(
    actionTypes.UPDATE_INCOME_EXPENSE,
    function* updateAccountCodeSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(incomeExpensesActions.setPhase('updating'));

      const {incomeExpenseInfo} = payload;
      const response = yield axios.patch(
        `${BASE_URL}/update-expense/${incomeExpenseInfo.id}`,
        {
          title: incomeExpenseInfo.title,
          amount: incomeExpenseInfo.amount.toString(),
        },
      );

      if (response.status !== 200 || response === undefined) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      }

      const {expense} = response.data;

      yield put(incomeExpensesActions.setIncomeExpense(expense));
      yield put(incomeExpensesActions.setPhase('success'));
    },
  );

  yield takeLatest(
    actionTypes.DELETE_INCOME_EXPENSE,
    function* deleteAccountCodeSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(incomeExpensesActions.setPhase('loading'));

      const {id} = payload;
      const response = yield axios.post(`${BASE_URL}/delete-expense/${id}`);

      if (response.status !== 200) {
        yield put(incomeExpensesActions.setPhase('error'));
        return;
      }
      yield put(incomeExpensesActions.removeIncomeExpense(id));
      yield put(incomeExpensesActions.setPhase('deleted-success'));
    },
  );
}
