import { createStore, applyMiddleware, compose } from 'redux';
// import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducer from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      // logger,
      sagaMiddleware,
      // thunkMiddleware,
    ),
  );
  return createStore(reducer, initialState, enhancer);
}
const store = configureStore({});
sagaMiddleware.run(rootSaga);
console.log('🗽 current state', store.getState());
export default store;

