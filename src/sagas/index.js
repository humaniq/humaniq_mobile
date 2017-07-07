/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all, takeLatest } from 'redux-saga/effects';
import { api } from '../utils/index';
import * as actions from '../actions';

function* fetchEntity(entity, apiFn, body) {
  // yield put(entity.request(...));
  console.log('request ready', body);
  const { response, error } = yield call(apiFn, body);
  if (response) {
    console.log('response ok', response.payload.errors);
    yield put(entity.success(response));
  } else {
    console.log('response fail', error);
    yield put(entity.failure(error));
  }
}

export const fetchValidate = fetchEntity.bind(null, actions.validate, api.validate);
export const fetchLogin = fetchEntity.bind(null, actions.login, api.login);
export const fetchSignup = fetchEntity.bind(null, actions.signup, api.signup);

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

export default function* root() {
  yield all([
    fork(watchValidate),
    fork(watchSignup),
    fork(watchLogin),
  ]);
}
