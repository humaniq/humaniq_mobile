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

export const user = combineReducers({
  validate: subroutineReducerCreator({
    types: [
      ActionTypes.VALIDATE.REQUEST,
      ActionTypes.VALIDATE.SUCCESS,
      ActionTypes.VALIDATE.FAILURE,
    ]
  }),
  photo: photo,
  password: password,
});
