import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';

function primaryAccount(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_PRIMARY_ACCOUNT:
      // return action.path;
      return state;
    default:
      return state;
  }
}

function secondaryAccounts(state = [], action) {
  switch (action.type) {
    case ActionTypes.ADD_SECONDARY_ACCOUNT:
      // return action.path;
      return state;
    default:
      return state;
  }
}

export const accounts = combineReducers({
  primaryAccount,
  secondaryAccounts,
});
