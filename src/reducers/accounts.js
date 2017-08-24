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
          ...action.number,
        },
      };
    default:
      return state;
  }
}

function saveAvatar(state, action) {
  switch (action.type) {
    case ActionTypes.SAVE_AVATAR:
      return {
        ...state,
        primaryAccount: {
          ...state.primaryAccount,
          avatar: action.avatar,
        },
      };
    default:
      return state;
  }
}

function saveNames(state, action) {
  switch (action.type) {
    case ActionTypes.SAVE_NAMES:
      return {
        ...state,
        primaryAccount: {
          ...state.primaryAccount,
          person: action.names,
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
    case ActionTypes.SAVE_AVATAR:
      return saveAvatar(state, action);
    case ActionTypes.SAVE_NAMES:
      return saveNames(state, action);
    default:
      return state;
  }
}
