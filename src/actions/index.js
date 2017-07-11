const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
}

export const VALIDATE = createRequestTypes('VALIDATE');
export const LOGIN = createRequestTypes('LOGIN');
export const SIGNUP = createRequestTypes('SIGNUP');
export const PHONE_NUMBER_CREATE = createRequestTypes('PHONE_NUMBER_CREATE');
export const PHONE_NUMBER_VALIDATE = createRequestTypes('PHONE_NUMBER_VALIDATE');

export const SET_AVATAR_LOCAL_PATH = 'SET_AVATAR_LOCAL_PATH';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SAVE_PHONE = 'SAVE_PHONE';

function action(type, payload = {}) {
  return { type, ...payload };
}

export const validate = {
  // TODO: remove obj as
  request: facial_image => action(VALIDATE[REQUEST], { facial_image }),
  success: response => action(VALIDATE[SUCCESS], { response }),
  failure: error => action(VALIDATE[FAILURE], { error }),
};

export const login = {
  request: request => action(LOGIN[REQUEST], request),
  success: response => action(LOGIN[SUCCESS], { response }),
  failure: error => action(LOGIN[FAILURE], { error }),
};

export const signup = {
  request: request => action(SIGNUP[REQUEST], request),
  success: response => action(SIGNUP[SUCCESS], { response }),
  failure: error => action(SIGNUP[FAILURE], { error }),
};

export const phoneNumberCreate = {
  request: request => action(PHONE_NUMBER_CREATE[REQUEST], request),
  success: response => action(PHONE_NUMBER_CREATE[SUCCESS], { response }),
  failure: error => action(PHONE_NUMBER_CREATE[FAILURE], { error }),
};

export const phoneNumberValidate = {
  request: request => action(PHONE_NUMBER_VALIDATE[REQUEST], request),
  success: response => action(PHONE_NUMBER_VALIDATE[SUCCESS], { response }),
  failure: error => action(PHONE_NUMBER_VALIDATE[FAILURE], { error }),
};

export const setAvatarLocalPath = path => action(SET_AVATAR_LOCAL_PATH, { path });
export const setPassword = password => action(SET_PASSWORD, { password });
export const savePhone = number => action(SAVE_PHONE, { number });
