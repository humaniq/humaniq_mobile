import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';

function primaryAccount(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_PRIMARY_ACCOUNT:
      return {
        ...state,
        ...action.account,
      };
    default:
      return state;
  }
}

function secondaryAccounts(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_SECONDARY_ACCOUNT:
      return [
        ...state,
        action.account,
      ];
    default:
      return state;
  }
}

function savePrimaryPhoneNumber(state, action) {
  switch (action.type) {
    case ActionTypes.SAVE_PHONE:
      return {
        ...state,
        primaryAccount: {
          ...state.primaryAccount,
          phone: action.number,
        },
      };
    default:
      return state;
  }
}

const defaultState = {
  primaryAccount: null,
  secondaryAccounts: [],
  saved: null,
};

export function accounts(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_PRIMARY_ACCOUNT:
      return {
        ...state,
        primaryAccount: primaryAccount(state.primaryAccount, action),
      };
    case ActionTypes.ADD_SECONDARY_ACCOUNT:
      return {
        ...state,
        secondaryAccounts: secondaryAccounts(state.secondaryAccounts, action),
      };
    case ActionTypes.SAVE_PHONE:
      return savePrimaryPhoneNumber(state, action);
    default:
      return state;
  }
}
