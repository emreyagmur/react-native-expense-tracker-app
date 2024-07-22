import {combineReducers} from 'redux';
import {authReducer} from '../screens/auth/_store/auth';
import {currencyReducer} from './currency';

const RootReducer = combineReducers({
  auth: authReducer,
  currencies: currencyReducer,
});

export default RootReducer;
