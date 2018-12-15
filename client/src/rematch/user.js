import { Alert } from 'react-native';
import { dispatch } from './dispatch';
import firebase from '../universal/firebase';

import Settings from '../constants/Settings';
import Fire from '../Fire';
import NavigationService from '../navigation/NavigationService';
import { Constants } from '../universal/Expo';
import PantryStorage from '../universal/PantryStorage';
import getDeviceInfo from '../utils/getUserInfo';

function clearNativeProfile() {
  firebase
    .auth()
    .currentUser.updateProfile({ displayName: null, photoURL: null });
}

export function reduceFirebaseUser(user) {
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
      console.log('native profile', { possibleUpdates });
      firebase.auth().currentUser.updateProfile(possibleUpdates);
    }
    // //DEBUG Clear
    // clearNativeProfile();
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

function getUserRef() {
  return firebase
    .firestore()
    .collection(Settings.refs.users)
    .doc(Fire.shared.uid);
}

function uploadEntryInLocalDatabase(updates) {
  dispatch.users.update({ uid: Fire.shared.uid, user: updates });
}
const user = {
  state: null,
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => null,
  },
  effects: {
    updateProfileImage: () => {},
    updateUserProfile: updates => {
      console.log('TODO: user.updateUserProfile: Test');
      // Set the local database
      dispatch.user.update(updates);
      // // Update the users database
      uploadEntryInLocalDatabase(updates);
      // Update the remote database
      getUserRef().set(updates, { merge: true });
    },
    changeRating: () => {
      console.warn('TODO: user.changeRating');
    },
    observeAuth: () => {
      firebase.auth().onAuthStateChanged(auth => {
        if (!auth) {
          // TODO: Evan: Y tho...
          dispatch.user.clear();
          dispatch.auth.signInAnonymously();
          NavigationService.navigate('Auth');
        } else {
          dispatch.user.getAsync();
          dispatch.popular.getAsync();
          dispatch.iid.setAsync();
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
        console.warn(
          "models: Shouldn't call user.getAsync until the user is authed",
        );
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
      console.log('Main:userdata:', combinedUserData);
      if (Settings.isCacheProfileUpdateActive) {
        const shouldUpdateKey = '@Bute/shouldUpdateProfile';
        const something = await PantryStorage.getItemWithExpiration(
          shouldUpdateKey,
        );
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
    syncLocalToFirebase: async (
      props,
      { user: { additionalUserInfo, credential, user, ...otherUserProps } },
    ) => {
      console.log('user.syncLocalToFirebase', otherUserProps);
      const doc = getUserRef();
      doc.set(otherUserProps, { merge: true });
    },
  },
};
export default user;
