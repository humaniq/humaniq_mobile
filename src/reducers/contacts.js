import * as ActionTypes from '../actions';
import { _contacts } from '../mocks/chatData';

const defaultState = _contacts;

export function contacts(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_CONTACT:
      return [...state];
    default:
      return state;
  }
}
