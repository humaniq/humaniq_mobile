import * as ActionTypes from '../actions';

const defaultState = {
  contactID: '',
  phone: '',
  qr: '',
};

export function newtransaction(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.SET_QR:
      alert(JSON.stringify(action))
      return { qr: action.qr, phone: '', contactID: '' };
    case ActionTypes.SET_TR_PHONE:
      alert(JSON.stringify(action))
      return { qr: '', phone: action.phone, contactID: '' };
    case ActionTypes.SET_TR_CONTACT:
      alert(JSON.stringify(action))
      return { qr: '', phone: '', contactID: action.contactID };
    default:
      return state;
  }
}
