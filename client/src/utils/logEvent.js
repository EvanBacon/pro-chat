import firebase from 'expo-firebase-app';

function ensureFormat(input) {
  if (input != null) {
    return input.toString().replace(/\W/g, '');
  } else {
    return '';
  }
}

export default function logEvent(inputEventName, ...props) {
  const eventName = ensureFormat(inputEventName);

  return firebase.analytics().logEvent(eventName);
}
