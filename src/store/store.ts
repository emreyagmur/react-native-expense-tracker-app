import RootReducer from './rootReducer';
import createSagaMiddleware from 'redux-saga';
import {Action, configureStore, Store} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import {all} from 'redux-saga/effects';
import * as auth from '../screens/auth/_store/auth';
import * as currency from './currency';
import * as userTransactions from '../screens/transaction/_store/transaction';
import logger from 'redux-logger';

export function* rootSaga() {
  const mainSagas = [auth.saga(), currency.saga(), userTransactions.saga()];
  yield all(mainSagas);
}

const sagaMiddleware = createSagaMiddleware();

const store: Store = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      thunk: true,
    }).concat(sagaMiddleware, logger),
});

export const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type TPhase =
  | null
  | 'loading'
  | 'adding'
  | 'updating'
  | 'deleting'
  | 'error'
  | 'success';

export type AppError = {
  key: string;
  title: string;
};
export interface IAction<T> extends Action<string> {
  type: string;
  payload?: T;
}

export default store;
