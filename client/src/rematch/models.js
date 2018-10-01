import { dispatch } from '@rematch/core';
import firebase from 'firebase';
import { Alert } from 'react-native';

import Settings from '../constants/Settings';
import Fire from '../Fire';
import { Constants, Facebook } from '../universal/Expo';
import PantryStorage from '../universal/PantryStorage';
import getDeviceInfo from '../utils/getUserInfo';

// import GameStates from '../Game/GameStates';

// function mergeInternal(state, { uid, user }) {
//   const { [uid]: currentUser, ...otherUsers } = state;
//   return {
//     ...otherUsers,
//     [uid]: { ...(currentUser || {}), ...user },
//   };
// }

// function parseName(inputName, backupName) {
//   let name = inputName || backupName || 'Markipillar';
//   if (typeof name === 'string') {
//     name = name.trim();
//   }
//   return name;
// }

function reduceFirebaseUser(user) {
  const nextUser = user;
  const possibleUpdates = {};

  if (user.providerData && user.providerData.length > 0) {
    const facebookData = user.providerData[0];
    nextUser.fbuid = facebookData.uid;
    const keysToCheck = ['displayName', 'photoURL'];
    for (const key of keysToCheck) {
      if (!nextUser[key] && facebookData[key]) {
        possibleUpdates[key] = facebookData[key];
      }
    }
    if (Object.keys(possibleUpdates).length > 0) {
      const user = firebase.auth().currentUser;
      console.log({ possibleUpdates });
      firebase.auth().currentUser.updateProfile(possibleUpdates);
    }
    // //DEBUG Clear
    // firebase
    //   .auth()
    //   .currentUser.updateProfile({ displayName: null, photoURL: null });
  }

  const {
    uid,
    photoURL,
    phoneNumber,
    lastLoginAt,
    isAnonymous,
    fbuid,
    displayName,
    emailVerified,
    email,
    createdAt,
  } = nextUser;

  return {
    uid,
    photoURL: photoURL || '',
    phoneNumber,
    lastLoginAt,
    isAnonymous,
    fbuid,
    displayName: displayName || Constants.deviceName,
    emailVerified,
    email,
    createdAt,
    ...possibleUpdates,

    // stsTokenManager,
    // redirectEventId,
    // authDomain,
    // appName,
    // apiKey
  };
}


export const onBoarding = {
  state: {},
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => {},
  },
};

export const user = {
  state: null,
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => null,
  },
  effects: {
    logoutAsync: async () => {
      try {
        await firebase.auth().signOut();
      } catch ({ message }) {
        console.log('ERROR: user.logoutAsync: ', message);
        Alert.alert(message);
      }
    },
    signInAnonymously: () => {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        console.log('Error: signInAnonymously', message);
        Alert.alert(message);
      }
    },
    observeAuth: () => {
      firebase.auth().onAuthStateChanged((auth) => {
        if (!auth) {
          // TODO: Evan: Y tho...
          dispatch.user.clear();
          dispatch.user.signInAnonymously();
        } else {
          dispatch.user.getAsync();
          // dispatch.leaders.getAsync({ uid: user.uid });
        }
      });
    },
    getAsync: async (props, { user: localUserData }) => {
      const nextLocalUserData = localUserData || {};
      let combinedUserData = {};
      const firebaseAuthData = firebase.auth().currentUser.toJSON();

      if (firebaseAuthData == null) {
        console.warn("models: Shouldn't call user.getAsync until the user is authed");
        return;
      }
      const nextFirebaseAuthData = reduceFirebaseUser(firebaseAuthData);
      const deviceInfo = getDeviceInfo();

      combinedUserData = {
        ...deviceInfo,
        ...nextFirebaseAuthData,
      };

      const updates = {};
      for (const key of Object.keys(combinedUserData)) {
        if (
          combinedUserData[key] != undefined &&
          combinedUserData[key] !== nextLocalUserData[key]
        ) {
          updates[key] = combinedUserData[key];
        }
      }
      if (Object.keys(updates).length > 0) {
        dispatch.user.update(updates);
      }
      dispatch.dailyStreak.compareDaily();
      dispatch.players.update({
        uid: combinedUserData.uid,
        user: combinedUserData,
      });

      if (Settings.isCacheProfileUpdateActive) {
        const shouldUpdateKey = '@PillarValley/shouldUpdateProfile';
        const something = await PantryStorage.getItemWithExpiration(shouldUpdateKey);
        if (!something) {
          const some = await PantryStorage.setItemWithExpiration(
            shouldUpdateKey,
            { update: true },
            Settings.shouldDelayFirebaseProfileSyncInMinutes,
          );
          dispatch.user.syncLocalToFirebase();
        } else {
          console.log('Prevent: syncLocalToFirebase');
        }
      } else {
        dispatch.user.syncLocalToFirebase();
      }
    },
    mergeDataWithFirebase: async (props) => {
      const doc = await firebase
        .firestore()
        .collection('players')
        .doc(Fire.shared.uid);
      doc.set(props, { merge: true });
    },
    syncLocalToFirebase: async (
      props,
      {
        user: {
          additionalUserInfo, credential, user, ...otherUserProps
        },
      },
    ) => {
      console.log('syncLocalToFirebase', otherUserProps);
      const doc = await firebase
        .firestore()
        .collection('players')
        .doc(Fire.shared.uid);
      doc.set(otherUserProps, { merge: true });
    },
    setGameData: (props) => {
      const { uid, doc } = Fire.shared;
      if (!uid) {
        // todo: add error
        return;
      }
      doc.set(props, { merge: true });
    },

    updateRelationshipWithUser: async ({ uid, type }) => {
      console.log({ uid, type });
    }
  },
};

const FacebookLoginTypes = {
  Success: 'success',
  Cancel: 'cancel',
};

function deleteUserAsync(uid) {
  const db = firebase.firestore();

  return Promise.all([
    db
      .collection(Settings.slug)
      .doc(uid)
      .delete(),
    db
      .collection('players')
      .doc(uid)
      .delete(),
  ]);
}

export const facebook = {
  state: null,
  reducers: {
    set: (state, props) => props,
    setAuth: (state, props) => ({ ...(state || {}), auth: props }),
    setGraphResults: (state = {}, props) => {
      const { graph = {}, ...otherState } = state;
      return {
        ...otherState,
        graph: {
          ...graph,
          ...props,
        },
      };
    },
  },
  effects: {
    upgradeAccount: () => {
      dispatch.facebook.getToken(dispatch.facebook.upgradeAccountWithToken);
    },
    login: () => {
      dispatch.facebook.getToken(dispatch.facebook.loginToFirebaseWithToken);
    },
    getToken: async (callback) => {
      let auth;
      try {
        auth = await Facebook.logInWithReadPermissionsAsync(
          Constants.manifest.facebookAppId,
          Settings.facebookLoginProps,
        );
      } catch ({ message }) {
        Alert.alert('Facebook Login Error:', message);
      }
      if (auth) {
        const { type, expires, token } = auth;
        if (type === FacebookLoginTypes.Success) {
          dispatch.facebook.set({ expires, token });
        } else if (type === FacebookLoginTypes.Cancel) {
          // do nothing, user cancelled
        } else {
          // unknown type, this should never happen
          Alert.alert('Failed to authenticate', type);
        }
        if (callback) callback(token);
      }
    },
    upgradeAccountWithToken: async (token, { facebook }) => {
      if (!token && (!facebook || !facebook.token)) {
        console.warn("upgradeAccountWithToken: Can't upgrade account without a token");
        return;
      }
      const _token = token || facebook.token;
      try {
        const user = await linkAndRetrieveDataWithToken(_token);
        console.log('upgradeAccountWithToken: Upgraded Successful');
        dispatch.facebook.authorized(user);
      } catch ({ message, code, ...error }) {
        if (code === 'auth/credential-already-in-use') {
          // Delete current account while signed in
          // TODO: This wont work
          const { uid } = Fire.shared;
          if (uid) {
            console.log('Should delete:', uid);
            await deleteUserAsync(uid);
            console.log('All deleted');
          } else {
            console.log('??? do something:', uid);
          }
          await dispatch.facebook.loginToFirebaseWithToken(_token);
        } else {
          // If the account is already linked this error will be thrown
          console.log('Error: upgradeAccountWithToken', message);
          console.log('error', code, error);
          Alert.alert(message);
        }
      }
    },
    loginToFirebaseWithToken: async (token, { facebook }) => {
      if (!token && (!facebook || !facebook.token)) {
        console.warn("loginToFirebaseWithToken: Can't login to firebase without a token");
        return;
      }
      const _token = token || facebook.token;
      try {
        const user = await signInWithToken(_token);
        dispatch.facebook.authorized(user);
      } catch ({ message }) {
        console.log('Error: loginToFirebase');
        Alert.alert(message);
      }
    },
    callGraphWithToken: async ({ token, params, callback }, { facebook }) => {
      if (!token && (!facebook || !facebook.token)) {
        console.warn("callGraphWithToken: Can't call the Facebook graph API without a Facebook Auth token");
        return;
      }
      const _token = token || facebook.token;

      // const paramString = (params || ['id', 'name', 'email', 'picture']).join(',');
      let results;
      try {
        const response = await fetch(`https://graph.facebook.com/me?access_token=${_token}&fields=${params.join(',')}`);
        results = await response.json();
        dispatch.facebook.setGraphResults(results);
      } catch ({ message }) {
        console.log('Error: callGraphWithToken', message);
        Alert.alert(message);
      }
      if (callback) callback(results);
    },
    authorized: (user) => {
      console.log('Authorized Facebook', user);
      // dispatch.facebook.setAuth(user);
      let _user = user;
      if (_user.toJSON) {
        _user = user.toJSON();
      }
      dispatch.user.update(_user);
    },
  },
};

function linkAndRetrieveDataWithToken(token) {
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  return firebase
    .auth()
    .currentUser.linkAndRetrieveDataWithCredential(credential);
}

function signInWithToken(token) {
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  return firebase.auth().signInAndRetrieveDataWithCredential(credential);
}


function isValidKey(key) {
  return key && typeof key === 'string' && key !== '';
}

/*
image, name, message, timestamp, seen, sender, groupId
*/
export const messages = {
  state: {},
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
    set: (state, payload) => payload,
  },
};

export const users = {
  state: {},
  reducers: {
    update: (state, { uid, user }) => {
      const { [uid]: currentUser, ...otherUsers } = state;
      return {
        ...otherUsers,
        [uid]: { ...(currentUser || {}), ...user },
      };
    },
    set: (state, { uid, user }) => {
      const { [uid]: currentUser, ...otherUsers } = state;
      return {
        ...otherUsers,
        [uid]: user,
      };
    },
    clear: () => ({}),
  },
  effects: {
    update: ({ uid, user }, { users }) => {
      if (!uid || !user) {
        console.error('dispatch.users.update: You must pass in a valid uid and user');
        return;
      }
      const currentUser = users[uid] || {};
      dispatch.users.set({ uid, user: { ...currentUser, ...(user || {}) } });
    },
    clearUser: ({ uid }) => dispatch.users.set({ uid, user: null }),
    getProfileImage: ({ uid, forceUpdate }) => {
      dispatch.users.getPropertyForUser({ uid, propName: 'photoURL', forceUpdate });
    },
    getPropertyForUser: async ({ propName, uid, forceUpdate }, { users }) => {
      if (!isValidKey(uid)) {
        console.warn('getPropertyForUser: Invalid Key', { uid });
        return null;
      }

      console.log('getPropertyForUser', uid, users[uid]);
      if (
        forceUpdate === true ||
        !users[uid] ||
        Object.keys(users[uid]).length === 0 ||
        users[uid][propName] == null
      ) {
        try {
          const snapshot = await Fire.shared._getUserInfoAsync({ uid });

          const userData = snapshot.data();
          if (userData) {
            dispatch.users.update({
              uid,
              user: { [propName]: userData[propName] },
            });
          }
        } catch ({ message }) {
          throw new Error(`getPropForUser ${message}`);
        }
      }
    },
  },
};

// TODO
export const channelHasMore = {
  state: {

  },
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
  },
};

export const isLoadingEarlier = {
  state: {

  },
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
  },
};

export const firstMessage = {
  state: {

  },
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
  },
};

export const isTyping = {
  state: {

  },
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
  },
  effects: {
    setAsync: ({ isTyping, groupId }) => {
      const route = `${Settings.refs.channels}/${groupId}/is_typing/${Fire.shared.uid}`;
      if (isTyping) {
        firebase.database().ref(route).set(isTyping);
      } else {
        firebase.database().ref(route).remove();
      }
    },
    observe: ({ groupId, uid }) => {
      // console.warn("TODO: observeTyping")
      const route = `${Settings.refs.channels}/${groupId}/is_typing/${uid}`;
      const ref = firebase.database().ref(route);
      ref.on('value', (snapshot) => {
        const isTyping = snapshot && snapshot.val && snapshot.val() ? true : null;
        dispatch.isTyping.update({ [groupId]: isTyping });
      });

      const userRoute = `${Settings.refs.channels}/${groupId}/is_typing/${firebase.uid()}`;
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
    },
  },
};

export const chats = {
  state: {
    // [groupId]: {}
  },
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
    set: (state, payload) => payload,
    addMessages: (state, { groupId, messages }) => {
      if (!groupId || !messages) {
        return state;
      }

      const { [groupId]: currentMessages = {}, ...nextState } = state;

      // TODO: So bad, don't sort every time.
      const nextMessages = { ...currentMessages, ...messages };
      // .sort(
      //   (a, b) => a.createdAt < b.createdAt,
      // );
      return {
        ...nextState,
        [groupId]: nextMessages,
      };
    },
  },
  effects: {
    subscribeToChannel: () => { console.warn('TODO: subscribeToChannel'); },
    deleteMessageFromChannel: ({ groupId, key }) => { console.warn('TODO: deleteMessageFromChannel'); },
    loadEarlier: () => { console.warn('TODO: loadEarlier'); },

    updatedInputText: () => { console.warn('TODO: updatedInputText'); },

    updatedGifOpened: () => { console.warn('TODO: updatedGifOpened'); },
    didRecieveMessageKey: () => {
      console.warn('TODO: didRecieveMessageKey');
      // / Set the `seen` value
    },
    getChannelForUser: () => { console.warn('TODO: getChannelForUser'); },

    _parseMessage: async ({ message, groupId }, { chats }) => {
      if (chats[groupId] && chats[groupId][message.key]) {
        // prevent duplicates.
        // throw new Error('Found duplicated ' + message.key + ' ' + groupId);
        console.log('FIXME: Duplicate');
        return;
      }

      const { uid } = message;
      if (!uid || uid === '') {
        throw new Error("Invalid UID, can't parse message");
      }

      const user = await Fire.shared.getUserAsync({ uid });

      if (user == null) {
        throw new Error("Invalid User data found, can't parse message");
      }

      dispatch.chats.addMessages({
        groupId,
        messages: {
          [message.key]: transformMessageForGiftedChat({ message, user }),
        },
      });
    },
    startChatting: async ({ uids, callback }, { chats }) => {
      const groupId = Fire.shared.getChatGroupId(uids);
      console.log('start chatting');

      if (!chats[groupId]) {
        const exists = await Fire.shared.ensureChatGroupExists(uids);
        if (exists) {
          dispatch.chats.update({ [groupId]: {} });
        }
      }

      let startAt;
      if (chats[groupId]) {
        startAt = Object.keys(chats[groupId]).length;
      }
      console.log({ startAt });

      const unsubscribe = Fire.shared.subscribeToChatGroup({
        groupId,
        cursor: (cursorCollection[groupId] || {}).ref, // startAt,
      });
      callback(unsubscribe);
    },
    loadPrevious: async ({ groupId, callback }) => {
      if (firstCursorCollection[groupId]) {
        const startBefore = firstCursorCollection[groupId];
        firstCursorCollection[groupId] = undefined;
        Fire.shared.loadMoreFromChatGroup({ groupId, callback, startBefore });
      }
      // TODO: IDK
      callback(true);
    },
    receivedMessage: async ({ groupId, snapshot }, { chats }) => {
      if (!chats[groupId]) {
        // TODO: This seems leaky... make sure receivedMessage is only called from a subscription
        // const exists = await Fire.shared.ensureChatGroupExists(groupId);
        // if (exists) {
        dispatch.chats.update({ [groupId]: {} });
        // }
      }

      snapshot.docChanges().forEach(({ type, doc }) => {
        console.log(
          'Found message: parseMessagesSnapshot: ',
          type,
          doc.id,
          // doc.data(),
        );
        if (type === 'added') {
          const message = { key: doc.id, ...doc.data() };
          dispatch.chats._parseMessage({ message, groupId });
        } else {
          // removed
          console.log('TODO: parseMessagesSnapshot: ', type);
          // TODO: Maybe remove
        }
      });

      if (!firstCursorCollection[groupId]) {
        firstCursorCollection[groupId] = snapshot.docs[0];
      }

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      if (lastVisible) {
        const lastTimestamp = lastVisible.data().timestamp;
        if (
          !cursorCollection[groupId] ||
          lastTimestamp > cursorCollection[groupId].timestamp
        ) {
          cursorCollection[groupId] = {
            ref: lastVisible,
            timestamp: lastTimestamp,
          };
        }
      }
    },
  },
};

let firstCursorCollection = {};

let cursorCollection = {};

function transformMessageForGiftedChat({ message, user }) {
  const {
    key: _id, uid, timestamp: createdAt,
  } = message;
  return {
    ...message,
    _id,
    createdAt,
    user: {
      name: user.displayName,
      avatar: user.photoURL,
      _id: uid,
    },
  };
}
