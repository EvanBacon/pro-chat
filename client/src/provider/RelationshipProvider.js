import { Haptic } from 'expo';
import firebase from 'firebase';
import { Platform } from 'react-native';

import formatDate from '../utils/formatDate';

export const Relationship = {
  like: 'like',
  dislike: 'dislike',
  match: 'match',
  none: 'none',
  blocked: 'blocked',
  blocking: 'blocking',
};

const isIos = Platform.OS === 'ios';

export function addLike(uid) {
  if (isIos) Haptic.impact();

  return updateRelationship(uid, Relationship.like);
}
export function addDislike(uid) {
  if (isIos) Haptic.selection();

  return updateRelationship(uid, Relationship.dislike);
}
export function removeRating(uid) {
  return updateRelationship(uid, Relationship.none);
}

export function updateRelationship(uid, type) {
  // like, dislike, none

  switch (type) {
    case Relationship.blocking:
      firebase.analytics().logEvent('user_blocked_another_user', { uid });
      break;
    case Relationship.like:
      if (isIos) Haptic.impact();
      break;
    case Relationship.dislike:
      if (isIos) Haptic.selection();
      break;
    default:
      break;
  }

  if (!firebase.uid()) {
    console.warn('User is not yet initialized, cannot set: ', type);
    return;
  }

  const _uid = firebase.uid();

  console.warn('Update Relationship', _uid, uid, type);
  if (_uid && uid && type && _uid !== uid) {
    const profileRef = firebase.database().ref(`relationships/${_uid}/${uid}`);
    if (type === Relationship.none) {
      return profileRef.remove();
    }
    return profileRef.update({ relationship: type, timestamp: Date.now(), read: null });
  }
  console.warn(`Cannot Add ${uid} to your ${type}`);
  return null;
}

export const isMatched = async (uid) => {
  if (!uid || uid === firebase.uid()) {
    return null;
  }
  const relationship = await getRelationshipWithUser({ uid });
  return relationship === Relationship.match;
};

export const getRelationshipWithUser = async ({ uid }) => {
  const _uid = firebase.uid();
  if (uid === _uid) {
    return null;
  }
  const ref = firebase.database().ref(`relationships/${_uid}/${uid}/relationship`);
  const snapshot = await new Promise((resolve, reject) => ref.once('value', resolve).catch(reject));
  return snapshot.val();
};

export const whenWasUserRated = async ({ uid }) => {
  const ref = firebase.database().ref(`relationships/${firebase.uid()}/${uid}/timestamp`);
  const snapshot = await new Promise((resolve, reject) => ref.once('value', resolve).catch(reject));
  const v = snapshot.val();
  if (v) {
    return formatDate(v);
  }
};

export const getRelationships = async ({ type }) => {
  if (!(type in Relationship)) {
    console.error(type, 'is not a valid relationship');
    return;
  }
  const ref = firebase.database().ref(`relationships/${firebase.uid()}`);
  const snapshot = await new Promise((resolve, reject) =>
    ref
      .orderByChild('relationship')
      .equalTo(type)
      .once('value', resolve)
      .catch(reject));
  return snapshot.val();
};
