import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';
import subroutineReducerCreator from './subroutineReducerCreator';

function photo(state = '', action) {
  switch (action.type) {
    case ActionTypes.SET_AVATAR_LOCAL_PATH:
      return action.path;
    default:
      return state;
  }
}

function tempPhoto(state = '', action) {
  switch (action.type) {
    case ActionTypes.SET_TEMP_LOCAL_PATH:
      return action.path;
    default:
      return state;
  }
}

function profile(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_PROFILE:
      return action.profile;
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

function phoneNumber(state = '', action) {
  switch (action.type) {
    case ActionTypes.SAVE_PHONE:
      return action.number;
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

export const user = combineReducers({
  validate: subroutineReducerCreator({
    types: [
      ActionTypes.VALIDATE.REQUEST,
      ActionTypes.VALIDATE.SUCCESS,
      ActionTypes.VALIDATE.FAILURE,
    ],
  }),
  phoneValidate: subroutineReducerCreator({
    types: [
      ActionTypes.PHONE_NUMBER_VALIDATE.REQUEST,
      ActionTypes.PHONE_NUMBER_VALIDATE.SUCCESS,
      ActionTypes.PHONE_NUMBER_VALIDATE.FAILURE,
    ],
  }),
  phoneCreate: subroutineReducerCreator({
    types: [
      ActionTypes.PHONE_NUMBER_CREATE.REQUEST,
      ActionTypes.PHONE_NUMBER_CREATE.SUCCESS,
      ActionTypes.PHONE_NUMBER_CREATE.FAILURE,
    ],
  }),
  faceEmotionValidate: subroutineReducerCreator({
    types: [
      ActionTypes.FACE_EMOTION_VALIDATE.REQUEST,
      ActionTypes.FACE_EMOTION_VALIDATE.SUCCESS,
      ActionTypes.FACE_EMOTION_VALIDATE.FAILURE,
    ],
  }),
  faceEmotionCreate: subroutineReducerCreator({
    types: [
      ActionTypes.FACE_EMOTION_CREATE.REQUEST,
      ActionTypes.FACE_EMOTION_CREATE.SUCCESS,
      ActionTypes.FACE_EMOTION_CREATE.FAILURE,
    ],
  }),
  smsCodeRepeat: subroutineReducerCreator({
    types: [
      ActionTypes.SMS_CODE_REPEAT.REQUEST,
      ActionTypes.SMS_CODE_REPEAT.SUCCESS,
      ActionTypes.SMS_CODE_REPEAT.FAILURE,
    ],
  }),
  account,
  photo,
  password,
  phoneNumber,
  profile,
  tempPhoto,
});
