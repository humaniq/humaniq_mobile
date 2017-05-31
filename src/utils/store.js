import { createStore, applyMiddleware, compose } from 'redux';
// import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import reducer from '../reducers';

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      logger,
      // thunkMiddleware,
    ),
  );
  return createStore(reducer, initialState, enhancer);
}
const store = configureStore({});
export default store;

