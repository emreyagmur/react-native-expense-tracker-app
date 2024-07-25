import {combineReducers} from 'redux';
import {authReducer} from '../screens/auth/_store/auth';
import {currencyReducer} from './currency';
import {userTransactionsReducer} from '../screens/transaction/_store/transaction';

const RootReducer = combineReducers({
  auth: authReducer,
  currencies: currencyReducer,
  userTransactions: userTransactionsReducer,
});

export default RootReducer;
