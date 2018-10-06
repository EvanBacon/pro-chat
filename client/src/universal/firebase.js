import { NativeModulesProxy } from 'expo-core';
// import firebase from 'firebase';
import firebase from 'expo-firebase-app';
import 'expo-firebase-analytics';
import 'expo-firebase-auth';
import 'expo-firebase-database';
import 'expo-firebase-firestore';
import 'expo-firebase-instance-id';
import 'expo-firebase-notifications';
import 'expo-firebase-messaging';
import 'expo-firebase-performance';
import 'expo-firebase-storage';

import Expo from './Expo';

if (!('analytics' in firebase) || !('logEvent' in firebase.analytics())) {
  firebase.analytics = function () {
    return {
      logEvent(event, params) {
        console.log('TODO: firebase.analytics().logEvent()', event, params);
      },
      setCurrentScreen(screenName, classOverride) {
        console.log(
          'TODO: firebase.analytics().setCurrentScreen()',
          screenName,
          classOverride,
        );
      },
    };
  };
}

if (!('messaging' in firebase) || !('onMessage' in firebase.messaging())) {
  firebase.messaging = function () {
    return {
      onMessage(handler) {
        return Expo.Notifications.addListener(handler);
      },
      setBadgeNumber(num) {
        return NativeModulesProxy.ExponentNotifications.setBadgeNumberAsync(num);
      },
      async requestPermissions() {
        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.NOTIFICATIONS);
        return status === 'granted';
      },
    };
  };
  console.log('shim firebase', firebase.messaging, firebase.messaging());
}

export default firebase;
