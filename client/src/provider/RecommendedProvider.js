import firebase from 'firebase';

import { store } from '../App';
import { foundNearbyUser, removeNearbyUser } from './redux/geo';

const key = 'recommended';
const _ref = () => firebase.database().ref(`${key}/${firebase.uid()}`);

let started = false;
export const start = () => {
  if (started) return;
  started = true;
  const ref = _ref();
  ref.orderByChild('timestamp').on('child_added', _added);
  ref.orderByChild('timestamp').on('child_removed', _removed);

  firebase
    .database()
    .ref('.info/connected')
    .on('value', (snap) => {
      if (snap.val()) {
        // if we lose network then remove this user from the list
        stop();
        console.log('Lost connection, stopping rec engine');
      }
    });
};

export const stop = () => {
  started = false;

  const ref = _ref();
  ref.orderByChild('timestamp').off('child_added', _added);
  ref.orderByChild('timestamp').off('child_removed', _removed);
};

const _added = (snapshot) => {
  const user = snapshot.val();
  const uid = snapshot.key;
  if (uid) {
    store.dispatch(foundNearbyUser({ uid, ...user }));
  }
};

const _removed = (snapshot) => {
  const user = snapshot.val();
  const uid = snapshot.key;
  store.dispatch(removeNearbyUser({ uid, ...user }));
};
