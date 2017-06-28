import * as types from '../actions/types';

export function user(state = {}, action) {
  switch (action.type) {
    case types.UPDATE_REGISTRATION_STATUS:
      return {
        ...state,
        registered: action.status,
      };
    case types.SET_AVATAR_PATH:
      return {
        ...state,
        avatar: action.path,
      };
    case types.SAVE_USER_ID:
      return {
        ...state,
        id: action.id,
      };
    case types.SAVE_USER_IMEI:
      return {
        ...state,
        imei: action.imei,
      };
    case types.SAVE_USER_PASSWORD:
      return {
        ...state,
        password: action.password,
      };
    case types.SAVE_USER_PHONE:
      return {
        ...state,
        phone: action.phone,
      };
    case types.SAVE_USER_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
}
