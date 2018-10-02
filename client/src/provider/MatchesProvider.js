import firebase from 'firebase';
// import { acknowledgeNewMatch, foundNewMatch, foundMatch, removedMatch } from './redux/match';

import { store } from './App';
import Fire from '../Fire';

const key = 'relationships';

const _receivedMatch = (snapshot) => {
  const match = snapshot.val();
  const uid = snapshot.key;

  console.log('Found Match', uid, match);
  const { read } = match;

  const user = { uid, ...match };

  if (read == null) {
    const timestamp = new Date().getTime();
    firebase
      .database()
      .ref(`${key}/${Fire.shared.uid}/${uid}`)
      .update({ read: timestamp });
    store.dispatch(foundNewMatch({ user }));
  } else {
    store.dispatch(foundMatch({ user }));
  }
};

const _removedMatch = (snapshot) => {
  const match = snapshot.val();
  const uid = snapshot.key;
  const user = { uid, ...match };

  store.dispatch(removedMatch({ user }));
};

export const subscribeToMatches = () => {
  const profileRef = firebase.database().ref(`${key}/${Fire.shared.uid}`);
  profileRef
    .orderByChild('relationship')
    .equalTo('match')
    .on('child_added', _receivedMatch);
  profileRef
    .orderByChild('relationship')
    .equalTo('match')
    .on('child_removed', _removedMatch);
};

export const unsubscribeToMatches = () => {
  const profileRef = firebase.database().ref(`${key}/${Fire.shared.uid}`);
  profileRef
    .orderByChild('relationship')
    .equalTo('match')
    .off('child_added', _receivedMatch);
  profileRef
    .orderByChild('relationship')
    .equalTo('match')
    .off('child_removed', _removedMatch);
};
