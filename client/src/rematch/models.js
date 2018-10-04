import { dispatch } from '@rematch/core';
import firebase from 'firebase';
import moment from 'moment';
import { Alert } from 'react-native';

import Settings from '../constants/Settings';
import Fire from '../Fire';
import IdManager from '../IdManager';
import Relationship from '../models/Relationship';
import NavigationService from '../navigation/NavigationService';
import { Constants, Facebook, Notifications, Permissions } from '../universal/Expo';
import PantryStorage from '../universal/PantryStorage';
import getGithubTokenAsync from '../utils/getGithubTokenAsync';
import getPermission from '../utils/getPermission';
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

export const location = {
  state: {},
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => {},
  },
  effects: {
    getAsync: async () => {
      const hasit = await getPermission(Permissions.LOCATION);
      if (!hasit) {
        return null;
      }
      if (Settings.simulator && Settings.debuggingLocation) {
        // return syncCoords(
        //   false,
        //   { latitude: 30.14728379721442, longitude: -97.77971597219003 },
        //   new Date().getTime(),
        // );
      }
    
      const { coords, timestamp } = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = coords;
// Add to user profile
    },
  },
};

function reduceFirebaseUser(user) {
  const nextUser = user;
  const possibleUpdates = {};

  if (user.providerData && user.providerData.length > 0) {
    const facebookData = user.providerData[0];
    console.log("ugh, provider", facebookData)
    nextUser.fbuid = facebookData.uid;
    const keysToCheck = ['displayName', 'photoURL'];
    for (const key of keysToCheck) {
      if (!nextUser[key] && facebookData[key]) {
        possibleUpdates[key] = facebookData[key];
      }
    }
    if (Object.keys(possibleUpdates).length > 0) {
      // const user = firebase.auth().currentUser;
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


export const popular = {
  state: {},
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => {},
  },
  effects: {
    getAsync: () => {},
  },
};

export const onBoarding = {
  state: {},
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => {},
  }
};

export const user = {
  state: null,
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => null,
  },
  effects: {
    updateUserProfile: () => {
      console.warn("TODO: user.updateUserProfile")
    },
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
    changeRating: () => {},
    observeAuth: () => {
      firebase.auth().onAuthStateChanged((auth) => {
        if (!auth) {
          // TODO: Evan: Y tho...
          dispatch.user.clear();
          // dispatch.user.signInAnonymously();
          NavigationService.navigate('Auth');
        } else {

          dispatch.user.getAsync();
          dispatch.popular.getAsync();
          Fire.shared.getMessageList();
          NavigationService.navigate('App');

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
          combinedUserData[key] !== undefined &&
          combinedUserData[key] !== nextLocalUserData[key]
        ) {
          updates[key] = combinedUserData[key];
        }
      }
      if (Object.keys(updates).length > 0) {
        dispatch.user.update(updates);
      }
      // dispatch.dailyStreak.compareDaily();
      dispatch.users.update({
        uid: combinedUserData.uid,
        user: combinedUserData,
      });
      

      console.log("Main:userdata:", combinedUserData)
      if (Settings.isCacheProfileUpdateActive) {
        const shouldUpdateKey = '@Bute/shouldUpdateProfile';
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
        .collection(Settings.refs.users)
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
        .collection(Settings.refs.users)
        .doc(Fire.shared.uid);
      doc.set(otherUserProps, { merge: true });
    },
  },
};

export const notifications = {
  state: {
    status: null
  },
  reducers: {
    setStatus: (state, status) => ({ ...state, status })
  },
  effects: {
    registerAsync: async () => {
      console.log("registerAsync")
      const { status: existingStatus } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS,
      );
      let finalStatus = existingStatus;
      console.log("registerAsync:B", existingStatus)
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
    
      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        console.log("registerAsync:C", existingStatus)
        return;
      }
    
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.log({token});
      dispatch.notifications.setStatus(finalStatus);
    },
  },
};

export const relationships = {
  state: {},
  reducers: {
    set: (state, props) => props,
  },
  effects: {
    whenWasUserRated: () => {},
    updateAsync: async ({ uid: otherId, type }) => {
      const userId = IdManager.uid;
      if (!IdManager.isInteractable(otherId)) {
        console.warn("Cannot Rate urself")
        return;
      }

      const isPerformingInvalidAction = type === Relationship.blocked || type === Relationship.matched;

      if (isPerformingInvalidAction) {
        throw new Error(`Cannot set relationship to ${type} in the client`);
      }

      const groupId = IdManager.getGroupId(userId, otherId);
      console.log('relationships.updateAsync', { otherId, type, groupId });

      // const props = {
      //   members: [userId, otherId],
      //   status: {
      //     [userId]: type,
      //   },
      //   timestamp: {
      //     [userId]: Date.now(),
      //   },
      // };

      const doc = await firebase.firestore().collection(Settings.refs.relationships).doc(groupId);

      function createGroupAsync(...ids) {
        const members = IdManager.sortIDs(...ids);
        console.log("Relationship.updateAsync: createGroupAsync", {members})

        return doc.set({ members });
      }
      async function checkGroupExistenceAsync() {
        console.log("Relationship.updateAsync: checkGroupExistenceAsync")
        const _doc = await doc.get();
        return _doc.exists;
      }

      async function ensureGroupExistenceAsync() {
        const exists = await checkGroupExistenceAsync();
        console.log("Relationship.updateAsync: ensureGroupExistenceAsync", {exists})

        if (!exists) {
          await createGroupAsync(userId, otherId);
        }
      }


      function getNewStatusGivenCurrentStatus({ currentUserStatus, otherUserStatus, inputStatus }) {
        const isNoChange = currentUserStatus === inputStatus;
        const isUserBlockedByOther = currentUserStatus === Relationship.blocked;
        const isUserBlockingOther = currentUserStatus === Relationship.blocking;
        const isUserMatchedToOther = currentUserStatus === Relationship.matched && otherUserStatus === Relationship.match;
        const otherUserLikesYou = otherUserStatus === Relationship.like || otherUserStatus === Relationship.match;

        console.log("Relationship.updateAsync: getNewStatusGivenCurrentStatus", {isNoChange,
          isUserBlockedByOther,
          isUserBlockingOther,
          isUserMatchedToOther,
          otherUserLikesYou,})

        if (!isNoChange && !isUserBlockedByOther) {
          // Something is gonna happen...
          let nextTypeForOtherUser = otherUserStatus;
          let nextTypeForUser = inputStatus;

          // We've already prevented default. This means any action must be unblocking.
          if (isUserBlockingOther) {
            nextTypeForOtherUser = Relationship.none;
          } else {
            switch (inputStatus) {
              case Relationship.like:
                if (!isUserMatchedToOther && otherUserLikesYou) {
                  nextTypeForOtherUser = Relationship.match;
                  nextTypeForUser = Relationship.match;
                }
                break;
              case Relationship.none:
              case Relationship.dislike:
                if (isUserMatchedToOther) {
                  nextTypeForOtherUser = Relationship.like;
                }
                break;
              case Relationship.blocking:
                nextTypeForOtherUser = Relationship.blocked;
                break;
              default:
                break;
            }
          }

          return {
            [otherId]: nextTypeForOtherUser,
            [userId]: nextTypeForUser,
          };
        }
        return null;
      }


      async function relationshipTransaction(transaction, inputDoc) {
        if (!inputDoc.exists) {
          throw new Error('Document does not exist!');
        }

        const data = inputDoc.data();
        const currentTimestamps = data.timestamps || {};
        const currentStatus = data.status || {};
        const otherUserStatus = currentStatus[otherId] || Relationship.none;
        const currentUserStatus = currentStatus[userId] || Relationship.none;

        const nextStatus = getNewStatusGivenCurrentStatus({ currentUserStatus, otherUserStatus, inputStatus: type });

        if (nextStatus) {
          const timestamp = Date.now();
          const timestamps = {
            [otherId]: currentTimestamps[otherId] || timestamp,
            [userId]: timestamp,
          };

          const updates = { status: nextStatus, timestamps };
          transaction.update(doc, updates);
          return updates;
        }
        return Promise.reject(new Error('Sorry! Population is too big.'));
      }


      await ensureGroupExistenceAsync();

      const db = firebase.firestore();
      const _status = await db.runTransaction(transaction => transaction.get(doc).then(sfDoc => relationshipTransaction(transaction, sfDoc)));

      console.log({_status});
    },
    getAsync: async ({ uid: otherId }) => {
      const userId = Fire.shared.uid;
      if (otherId === userId) return;
      // console.log({ uid });
      const groupId = IdManager.getGroupId(userId, otherId);

      const doc = await firebase.firestore().collection(Settings.refs.relationships).doc(groupId);

      const snapshot = await doc.get();
      if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
          const { status = {} } = data;
          const { [userId]: relationship } = status;
          console.log('do something', { relationship });
        }
      }
    },
    getAllOfTypeAsync: async ({ type }) => {
      console.log({ type });
      // const userId = Fire.shared.uid;

      // const doc = await firebase.firestore().collection(Settings.refs.relationships).where('members', 'array-contains', userId).where(`status.${userId}`, '==', type);

      // doc.get();
    },
    isMatched: ({ uid: otherId, shouldUpdate = false, callback }) => {
      const userId = Fire.shared.uid;
      if (otherId === userId) return;
      // const isMatched = getAsync() === Relationship.match;
      callback(false);
    },
  },
};


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


function filterUser(user) {
  function isV(s) {
    if (s && s !== "") return s;
    return null;
  }
 // Remove these....
 const { stsTokenManager, providerData, ..._userProps } = user;

 // Merge These...
 const { first_name, name: _name, displayName, deviceName, photoURL, image: _image, uid: _uid, key: _key, ...__userProps } = _userProps;

 const name = (isV(first_name) || isV(_name) || isV(displayName) || isV(deviceName) || Settings.noName);
 const image = isV(photoURL) || isV(_image);
 const uid = isV(_uid) || isV(_key);

 const nextUser = {
   ...__userProps,
   uid,
   name,
   image,
 };

 return nextUser;
}

const lessThanHoursAgo = (date, hours = 1) => {
  return moment(date).isAfter(moment().subtract(hours, 'hours'));
}


function isValidUser(user, fields = [ "name", "image", "uid" ]) {
  if (user == null || typeof user === "undefined") {
    return false;
  }

  // If user data couldn't be loaded for some reason, then pause to prevent loop. Check again sometime later.
  if (user.ensured && lessThanHoursAgo(user.ensured, 3)) {
    return true;
  }
  for (const field of fields) {
    if (!user[field] || typeof user[field] !== "string" || user[field] === '') {
      return false;
    }
  } 
  return true;
}

export const users = {
  state: {},
  reducers: {
    update: (state, { uid, user }) => {
      const { [uid]: currentUser = {}, ...otherUsers } = state;
      return {
        ...otherUsers,
        [uid]: { ...currentUser, ...user },
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
    debugLoadSomeUsersAsync: () => {
      dispatch.users.getPaged({size: 2})
    },
    getAsync: async ({ uid }) => {
      // dispatch.users.getPaged({size: 2})
    },
    ensureUserIsLoadedAsync: async ({ uid, callback }, { users }) => {
      let cb = callback || function() {}
      console.log("ensureUserIsLoadedAsync:A", !IdManager.isInteractable(uid));
      if (!IdManager.isInteractable(uid)) {
        // The current user should always be loaded and up to date.
        cb(null);
        return
      }

      const storedUser = users[uid];

      console.log("ensureUserIsLoadedAsync:B", !!storedUser, !isValidUser(storedUser));
      if (!isValidUser(storedUser)) {
        try {
          const snapshot = await Fire.shared._getUserInfoAsync({ uid });

          const userData = snapshot.data();
          if (userData) {
            console.log("userData", userData)
            const nextUser = {
              ...filterUser(userData),
              ensured: Date.now(),
            };
            dispatch.users.update({
              uid,
              user: nextUser,
            });
            cb(nextUser);
            return;
          }
        } catch ({ message }) {
          throw new Error(`getPropForUser ${message}`);
        }
      } 
      cb(storedUser);
    },
    getPaged: async ({ size, start }) => {
      const { data } = await Fire.shared.getUsersPaged({ size, start });
      for (const user of data) {
        dispatch.users.update({ uid, user: filterUser(user) });
      }
    },
    changeRating: () => {
      console.warn("TODO: changeRating");
    },
    update: ({ uid, user }, { users }) => {
      if (!uid || !user) {
        throw new Error(`dispatch.users.update: You must pass in a valid uid and user: ${uid} - ${JSON.stringify(user || {})}`);
      }
      const currentUser = users[uid] || {};
      dispatch.users.set({ uid, user: { ...currentUser, ...user } });
    },
    clearUser: ({ uid }) => dispatch.users.set({ uid, user: null }),
    getProfileImage: ({ uid, forceUpdate }) => {
      dispatch.users.getPropertyForUser({ uid, propName: 'photoURL', forceUpdate });
    },
    getPropertyForUser: async ({ propName, uid, forceUpdate, callback: _cb }, { users }) => {
      let callback = _cb || function() {}
      if (!IdManager.isValid(uid)) {
        console.warn('getPropertyForUser: Invalid Key', { uid });
        callback();
        return null;
      }
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

            callback(userData);
            return null;
          }
        } catch ({ message }) {
          throw new Error(`getPropForUser ${message}`);
        }
        callback(null);
        return null;
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

      const userRoute = `${Settings.refs.channels}/${groupId}/is_typing/${Fire.shared.uid}`;
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
    clear: (state, { uid }) => ({ ...state, [uid]: undefined }),
  },
  effects: {
    subscribeToChannel: () => { console.warn('TODO: subscribeToChannel'); },
    deleteMessageFromChannel: ({ groupId, key }) => { console.warn('TODO: deleteMessageFromChannel'); },
    loadEarlier: () => { console.warn('TODO: loadEarlier'); },

    updatedInputText: () => { console.warn('TODO: updatedInputText'); },
    getLastMessage: () => { console.warn('TODO: getLastMessage'); },
    deleteChannel: () => { console.warn('TODO: deleteChannel'); },

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

      console.log("Add Message", message.key);
      dispatch.chats.addMessages({
        groupId,
        messages: {
          [message.key]: transformMessageForGiftedChat({ message, user }),
        },
      });
    },
    startChatting: async ({ uids, callback }, { chats }) => {
      const groupId = Fire.shared.getGroupId(uids);
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


export { default as auth } from './auth';