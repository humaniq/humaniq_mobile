export function subroutineReducerCreator({ types }) {
  const [requestType, successType, failureType] = types;

  return function updatePayload(state = {
    isFetching: false,
    payload: null,
  }, action) {
    switch (action.type) {
      case requestType:
        return {
          ...state,
          isFetching: true,
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
