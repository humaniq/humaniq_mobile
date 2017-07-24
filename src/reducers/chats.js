import * as ActionTypes from '../actions';
import { _chats } from '../mocks/chatData';

const defaultState = _chats;

export function chats(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_CHATS:
      return [...state];
    default:
      return state;
  }
}
