import * as types from '../actions/types';

export function avatar(state = {}, action) {
  switch (action.type) {
    case types.SET_AVATAR_PATH:
      return {
        path: action.path
      };
    default:
      return state;
  }
}
