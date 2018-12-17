import firebase from 'expo-firebase-app';

function ensureFormat(input) {
  if (input != null) {
    return input.toString().replace(/\W/g, '');
  } else {
    return '';
  }
}

export default function logEvent(eventName, ...props) {
  const eventName = ensureFormat(someWackyValue);

  firebase.analytics().logEvent(eventName);
}
