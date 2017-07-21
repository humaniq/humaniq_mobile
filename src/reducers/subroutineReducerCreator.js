export default function subroutineReducerCreator({ types }) {
  const [requestType, successType, failureType] = types;

  return function updatePayload(state = {
    isFetching: false,
    payload: {code: 0},
  }, action) {
    switch (action.type) {
      case requestType:
        return {
          ...state,
          isFetching: true,
          payload: null,
        };
      case successType:
        return {
          ...state,
          isFetching: false,
          payload: action.response,
        };

      case failureType:
        return {
          ...state,
          isFetching: false,
          payload: action.error,
        };
      default:
        return state;
    }
  };
}
