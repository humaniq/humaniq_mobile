import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import filter from 'redux-localstorage-filter';
import { AsyncStorage } from 'react-native';
import persistState from 'redux-localstorage/src';
import adapter from 'redux-localstorage/src/adapters/AsyncStorage';
import mergePersistedState from 'redux-localstorage/src/mergePersistedState';

import rootReducer from '../reducers';
import rootSaga from '../sagas';


const reducer = compose(mergePersistedState())(rootReducer);
const sagaMiddleware = createSagaMiddleware();
const storage = compose(filter([
  'accounts',
]))(adapter(AsyncStorage));

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      logger,
      sagaMiddleware,
      // thunkMiddleware,
    ),
    persistState(storage),
  );
  return createStore(reducer, initialState, enhancer);
}
const store = configureStore({});
sagaMiddleware.run(rootSaga);
console.log('🗽 current state', store.getState());
export default store;

