import * as ActionTypes from '../actions';
import { _contacts } from '../mocks/chatData';

const defaultState = _contacts;
const addContact = (all, contact) => {
  const finded = all.find(cnt => cnt.id === contact.id);
  const filtered = all.filter(cnt => cnt.id !== contact.id);
  filtered.push(finded ? { ...finded, ...contact } : contact);
  return filtered;
};

export function contacts(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_CONTACT:
      return addContact(state, action.contact);
    default:
      return state;
  }
}
