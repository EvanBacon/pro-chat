import { dispatch } from '@rematch/core';

import Settings from '../constants/Settings';
import Fire from '../Fire';
import firebase from '../universal/firebase';

const observers = {};

function ensureObserverIsAvailable(groupId) {
  if (observers[groupId]) {
    observers[groupId]();
  }
}

export default {
  state: {},
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
  },
  effects: {
    setAsync: ({ isTyping, groupId }) => {
      const route = `${Settings.refs.channels}/${groupId}/is_typing/${
        Fire.shared.uid
      }`;
      const ref = firebase.database().ref(route);
      if (isTyping) {
        ref.set(isTyping);
      } else {
        ref.remove();
      }
    },
    removeAll: () => {
      for (const unsubscribe of Object.values(observers)) {
        unsubscribe();
      }
    },
    // TODO: unsubscribe...
    unsubscribe: ({ groupId }) => {
      ensureObserverIsAvailable(groupId);
      // const uid = IdManager.getOtherUserFromChatGroup(groupId);
      // const route = `${Settings.refs.channels}/${groupId}/is_typing/${uid}`;
      // const ref = firebase.database().ref(route);
    },
    observe: ({ groupId, uid }) => {
      ensureObserverIsAvailable(groupId);
      // console.warn("TODO: observeTyping")
      const route = `${Settings.refs.channels}/${groupId}/is_typing/${uid}`;
      const ref = firebase.database().ref(route);
      observers[groupId] = ref.on('value', (snapshot) => {
        const isTyping =
          snapshot && snapshot.val && snapshot.val() ? true : null;
        dispatch.isTyping.update({ [groupId]: isTyping });
      });

      stopTypingIfConnectionIsLost(groupId);
    },
  },
};

// TODO: Remember to disconnect these...

function stopTypingIfConnectionIsLost(groupId) {
  const userRoute = `${Settings.refs.channels}/${groupId}/is_typing/${
    Fire.shared.uid
  }`;
  // Monitor connection state on browser tab
  firebase
    .database()
    .ref('.info/connected')
    .on('value', (snap) => {
      if (snap.val()) {
        // if we lose network then remove this user from the list
        firebase
          .database()
          .ref(userRoute)
          .onDisconnect()
          .remove();
      }
    });
}
