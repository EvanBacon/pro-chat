import firebase from 'firebase';

export const getPopularUsers = async ({ limit = 1 }) => {
  const ref = firebase.database().ref('popularity');
  const snapshot = await new Promise((resolve, reject) =>
    ref
      .orderByChild('score')
      .limitToFirst(limit)
      .once('value', resolve)
      .catch(reject));
  return snapshot.val();
};
