import { dispatch } from './dispatch';
import { Notifications, Permissions } from '../universal/Expo';

import firebase from 'expo-firebase-app';

// Optional: Flow type
import type {
  Notification,
  NotificationOpen,
} from 'expo-firebase-notifications';

import NavigationService from '../navigation/NavigationService';

const notifications = {
  state: {
    status: null,
  },
  reducers: {
    setStatus: (state, status) => ({ ...state, status }),
  },
  effects: {
    registerAsync: async () => {
      console.log('registerAsync');
      const { status: existingStatus } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS,
      );
      let finalStatus = existingStatus;
      console.log('registerAsync:B', existingStatus);
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS,
        );
        finalStatus = status;
      }
      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        console.log('registerAsync:C', existingStatus);
        return;
      }
      // Get the token that uniquely identifies this device
      const token = await Notifications.getExpoPushTokenAsync();
      console.log({ token });
      dispatch.notifications.setStatus(finalStatus);
    },
    getPendingNavigationFromNotification: (notification: Notification) => {
      if (notification.data.screen) {
        global._pendingNavigation = notification.data;
        dispatch.notifications.commitPendingNavigation();
      }
    },
    commitPendingNavigation: () => {
      console.log('commitPendingNavigation:', !!global._pendingNavigation);
      if (global._pendingNavigation) {
        if (NavigationService.canNavigateWithinApp()) {
          const {
            screen,
            senderId,
            navigationParams,
          } = global._pendingNavigation;
          NavigationService.navigateToUserSpecificScreen(
            screen,
            senderId,
            navigationParams,
          );
          global._pendingNavigation = null;
        }
      }
    },
    attemptToParseInitialNotification: async () => {
      const notificationOpen: NotificationOpen = await firebase
        .notifications()
        .getInitialNotification();
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;

        dispatch.notifications.getPendingNavigationFromNotification(
          notification,
        );
      }
    },
  },
};
export default notifications;
