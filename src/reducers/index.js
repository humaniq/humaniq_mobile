import { combineReducers } from 'redux';
import * as userReducer from './user';
import * as accountsReducer from './accounts';

export default combineReducers(Object.assign(
  userReducer,
  accountsReducer,
));
