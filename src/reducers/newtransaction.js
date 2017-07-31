import * as ActionTypes from '../actions';

const defaultState = {
  contactID: '',
  phone: '',
  adress: '',
  amount: 0.0,
};

export function newtransaction(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.SET_TR_ADRESS:
      alert(JSON.stringify(action));
      return { adress: action.adress, phone: '', contactID: '' };
    case ActionTypes.SET_TR_PHONE:
      alert(JSON.stringify(action));
      return { adress: '', phone: action.phone, contactID: '' };
    case ActionTypes.SET_TR_CONTACT:
      alert(JSON.stringify(action));
      return { adress: '', phone: '', contactID: action.contactID };
    case ActionTypes.SET_TR_AMOUNT:
      alert(JSON.stringify(action));
      return { ...state, amount: action.amount };
    default:
      return state;
  }
}
