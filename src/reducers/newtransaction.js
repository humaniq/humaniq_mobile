import * as ActionTypes from '../actions';

const defaultState = {
  contactID: '',
  phone: '',
  qr: '',
};

export function newtransaction(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.SET_QR:
      return { qr: action.qr, phone: '', contactID: '' };
    case ActionTypes.SET_TR_PHONE:
      return { qr: '', phone: action.phone, contactID: '' };
    case ActionTypes.SET_TR_CONTACT:
      return { qr: '', phone: '', contactID: action.contactID };
    default:
      return state;
  }
}
