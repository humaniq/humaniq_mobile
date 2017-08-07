import * as ActionTypes from '../actions';
import { _messages } from '../mocks/chatData';

const defaultState = _messages;

export function messages(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_MESSAGE:
      return [...state];
    default:
      return state;
  }
}
