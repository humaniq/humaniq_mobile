import { combineReducers } from 'redux';
import * as initReducer from './init';
import * as userReducer from './user';

export default combineReducers(Object.assign(
  initReducer,
  userReducer,
));
