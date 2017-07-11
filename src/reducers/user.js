import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';
import { subroutineReducerCreator } from './subroutineReducerCreator';

/*
let initialState = {
  registration: {
    code: '',
    message: '',
    payload: {
      errors: null,
    },
    loading: false,
    loaded: false,
  },
  photo: {
    path: '',
    // base64: '', // don't need it anymore due to user id
  },
};
*/

function photo(state = '', action) {
  switch (action.type) {
    case ActionTypes.SET_AVATAR_LOCAL_PATH:
      return action.path;
    default:
      return state;
  }
}

function password(state = '', action) {
  switch (action.type) {
    case ActionTypes.SET_PASSWORD:
      return action.password;
    default:
      return state;
  }
}

function account(state = {
  isFetching: false,
  payload: null,
}, action) {
  switch (action.type) {
    case ActionTypes.LOGIN.REQUEST:
    case ActionTypes.SIGNUP.REQUEST:
      return {
        ...state,
        isFetching: true,
        payload: null,
      };
    case ActionTypes.LOGIN.SUCCESS:
    case ActionTypes.SIGNUP.SUCCESS:
      return {
        ...state,
        isFetching: false,
        payload: action.response,
      };
    case ActionTypes.LOGIN.FAILURE:
    case ActionTypes.SIGNUP.FAILURE:
      return {
        ...state,
        isFetching: false,
        payload: action.error,
      };
    default:
      return state;
  }
}

function phone(state = {
  isFetching: false,
  payload: null,
}, action) {
  switch (action.type) {
    case ActionTypes.PHONE_NUMBER_CREATE.REQUEST:
    case ActionTypes.PHONE_NUMBER_VALIDATE.REQUEST:
      return {
        ...state,
        isFetching: true,
        payload: null,
      };
    case ActionTypes.PHONE_NUMBER_CREATE.SUCCESS:
    case ActionTypes.PHONE_NUMBER_VALIDATE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        payload: action.response,
      };
    case ActionTypes.PHONE_NUMBER_CREATE.FAILURE:
    case ActionTypes.PHONE_NUMBER_VALIDATE.FAILURE:
      return {
        ...state,
        isFetching: false,
        payload: action.error,
      };
    default:
      return state;
  }
}

export const user = combineReducers({
  validate: subroutineReducerCreator({
    types: [
      ActionTypes.VALIDATE.REQUEST,
      ActionTypes.VALIDATE.SUCCESS,
      ActionTypes.VALIDATE.FAILURE,
    ],
  }),
  phone,
  account,
  photo,
  password,
});
