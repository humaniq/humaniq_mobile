import moment from 'moment';

const DEPRECATION_MESSAGE =
  'isSameUser and isSameDay should be imported from the utils module instead of using the props functions';

export function isSameDay(currentMessage = {}, diffMessage = {}) {
  const currentCreatedAt = moment(currentMessage.createdAt);
  const diffCreatedAt = moment(diffMessage.createdAt);

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }

  return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function isSameUser() {
  return false;
}

export function warnDeprecated(fn) {
  return (...args) => {
    console.warn(DEPRECATION_MESSAGE);
    return fn(...args);
  };
}
