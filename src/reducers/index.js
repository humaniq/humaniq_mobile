import { combineReducers } from 'redux';
import * as initReducer from './init';

export default combineReducers(Object.assign(
  initReducer,
));
