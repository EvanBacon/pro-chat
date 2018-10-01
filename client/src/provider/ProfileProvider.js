import firebase from 'firebase';

import bootyWord from './booty_word_list';

export const Gender = {
  male: 'male',
  female: 'female',
  both: 'both',
};

export const getProfileForUser = async ({ uid }) => {
  const ref = firebase.database().ref(`users/${uid}`);
  const snapshot = await new Promise((resolve, reject) => ref.once('value', resolve).catch(reject));
  return snapshot.val();
};

export const getPropertyForUser = async ({ uid, property }) => {
  const ref = firebase.database().ref(`users/${uid}/${property}`);
  const snapshot = await new Promise((resolve, reject) => ref.once('value', resolve).catch(reject));
  return snapshot.val();
};

export const observePropertyForUser = ({ uid, property, callback }) => {
  const ref = firebase.database().ref(`users/${uid}/${property}`);
  ref.on('value', callback);
};
export const unobservePropertyForUser = ({ uid, property, callback }) => {
  const ref = firebase.database().ref(`users/${uid}/${property}`);
  ref.off('value', callback);
};

export const updateUserProfile = async (updates) => {
  const uid = firebase.uid();
  if (!uid) return;
  const ref = firebase.database().ref(`users/${uid}`);
  return await ref.update(updates);
};

// listen for changes to firebase and dispatch actions to update app state
export function subscribeToProfile({ callback }) {
  const uid = firebase.uid();
  if (!uid) return;
  const ref = firebase.database().ref(`users/${uid}`);
  ref.on('value', snapshot => callback(snapshot.val()));
}
export function changeRating() {
  updateUserProfile({ rating: bootyWord() });
}

// remove listeners
export function unsubscribeToProfile() {
  const uid = firebase.uid();
  if (!uid) return;
  const ref = firebase.database().ref(`users/${uid}`);
  ref.off();
}
