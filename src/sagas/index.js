/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all, takeLatest } from 'redux-saga/effects';
import { api } from '../utils/index';
import * as actions from '../actions';

function* fetchEntity(entity, apiFn, body) {
  // yield put(entity.request(...));
  // console.log('request ready', body);
  const { response, error } = yield call(apiFn, body);
  if (response) {
    console.log('response ok', response);
    yield put(entity.success(response));
  } else {
    console.log('response fail', error);
    yield put(entity.failure(error));
  }
}

export const fetchValidate = fetchEntity.bind(null, actions.validate, api.validate);
export const fetchLogin = fetchEntity.bind(null, actions.login, api.login);
export const fetchSignup = fetchEntity.bind(null, actions.signup, api.signup);
export const fetchPhoneNumberCreate = fetchEntity.bind(
  null,
  actions.phoneNumberCreate,
  api.phoneNumberCreate,
);

function* validate({ facial_image }) {
  // do we need cache? place it here and wrap with conditional statement below call
  yield call(fetchValidate, { facial_image });
}

function* login({ facial_image_id, password, device_imei }) {
  // console.log('inaction', action);
  const body = {
    facial_image_id,
    password,
    metadata: {
      react_native_imei: {
        device_imei,
      },
    },
  };
  yield call(fetchLogin, body);
}

function* signup({ facial_image_id, password, device_imei }) {
  const body = {
    facial_image_id,
    password,
    metadata: {
      react_native_imei: {
        device_imei,
      },
    },
  };
  console.log('body', body);
  yield call(fetchSignup, body);
}

function* phoneNumberCreate({ phone_number, account_id }) {
  const code = phone_number.toString().slice(0, 1);
  const number = phone_number.toString().slice(1);
  const body = {
    account_id,
    phone_number: {
      country_code: code,
      // country_code: '1',
      phone_number: number,
      // phone_number: '5035863325',
    },
  };
  yield call(fetchPhoneNumberCreate, body);
}

// function* phoneNumberValidate(phoneNumber) {
//   let code = phoneNumber.toString().slice(0, 1);
//   let number = phoneNumber.toString().slice(1);
//   const body = {
//     phone_number: {
//       country_code: code,
//       phone_number: number,
//     },
//   };
//   console.log('body', body);
//   yield call(fetchSignup, body);
// }

// WATCHERS

function* watchValidate() {
  yield takeLatest(actions.VALIDATE.REQUEST, validate);
}

function* watchLogin() {
  yield takeLatest(actions.LOGIN.REQUEST, login);
}

function* watchSignup() {
  yield takeLatest(actions.SIGNUP.REQUEST, signup);
}

function* watchPhoneNumberCreate() {
  yield takeLatest(actions.PHONE_NUMBER_CREATE.REQUEST, phoneNumberCreate);
}

// function* watchPhoneNumberValidate() {
//   yield takeLatest(actions.PHONE_NUMBER_VALIDATE.REQUEST, phoneNumberValidate);
// }

export default function* root() {
  yield all([
    fork(watchValidate),
    fork(watchSignup),
    fork(watchLogin),
    fork(watchPhoneNumberCreate),
  ]);
}
