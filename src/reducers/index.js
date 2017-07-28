import { combineReducers } from 'redux';
import * as userReducer from './user';
import * as accountsReducer from './accounts';
import * as chatsReducer from './chats';
import * as messagesReducer from './messages';
import * as contactsReducer from './contacts';

export default combineReducers(Object.assign(
  userReducer,
  accountsReducer,
  chatsReducer,
  messagesReducer,
  contactsReducer,
));
