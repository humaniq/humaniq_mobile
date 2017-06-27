import * as types from './types';

export function updateUserRegStatus(status) {
  return {
    type: types.UPDATE_REGISTRATION_STATUS,
    status,
  };
}

export function setAvatarPath(path) {
  return {
    type: types.SET_AVATAR_PATH,
    path,
  };
}

export function saveUserId(id) {
  return {
    type: types.SAVE_USER_ID,
    id,
  };
}

// to device
export function saveUserImei(imei) {
  return {
    type: types.SAVE_USER_IMEI,
    imei,
  };
}

export function saveUserPassword(password) {
  return {
    type: types.SAVE_USER_PASSWORD,
    password,
  };
}

export function saveUserPhone(phone) {
  return {
    type: types.SAVE_USER_PHONE,
    phone,
  };
}

// session
export function saveUserToken(token) {
  return {
    type: types.SAVE_USER_TOKEN,
    token,
  };
}