import * as types from '../actions/types';

export default function init(state = false, action) {
  switch (action.type) {
    case types.INIT_APP:
      return !state;
    default:
      return state;
  }
}
