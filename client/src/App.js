import './utils/disableLogs';

import React from 'react';
import { StatusBar } from 'react-native';
import { dispatch } from './rematch/dispatch';

import Assets from './Assets';
import Settings from './constants/Settings';
import Fire from './Fire';
import Navigation from './navigation';
import Gate from './rematch/Gate';
import { ActionSheetProvider } from './universal/ActionSheet';
import AssetUtils from './universal/AssetUtils';
import { AppLoading } from './universal/Expo';
import { Assets as StackAssets } from 'react-navigation-stack';
import { Asset } from 'expo';

// Optional: Flow type
import type {
  Notification,
  NotificationOpen,
} from 'expo-firebase-notifications';

import firebase from 'expo-firebase-app';

console.ignoredYellowBox = Settings.ignoredYellowBox;

function logger(...props) {
  if (__DEV__) {
    console.log('App: ', ...props);
  }
}
export default class App extends React.Component {
  state = { loading: true };

  get loadingScreen() {
    return <AppLoading />;
  }

  get screen() {
    return (
      <Gate>
        <ActionSheetProvider>
          <Navigation />
        </ActionSheetProvider>
      </Gate>
    );
  }

  get fonts() {
    const items = {};
    const keys = Object.keys(Assets.fonts || {});
    for (const key of keys) {
      const item = Assets.fonts[key];
      const name = key.substr(0, key.lastIndexOf('.'));
      items[name] = item;
    }
    return [items];
  }

  get files() {
    return AssetUtils.arrayFromObject(Assets.images);
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    this._setupExperienceAsync();
    for (const permission of Settings.permissions) {
      dispatch.permissions.getAsync({ permission });
    }
    Fire.shared.init();

    this.setupNotifications();
  }

  setupNotifications = async () => {
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.

        logger('onNotificationDisplayed', notification);
      });
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        // Process your notification as required
        logger('onNotification', notification);
      });
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        logger('onNotificationOpened', notificationOpen);
      });

    const notificationOpen: NotificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      logger('getInitialNotification', notificationOpen);
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
    }
  };

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }

  _setupExperienceAsync = async () => {
    await Promise.all(this._preloadAsync());
    // await Promise.all([...this._preloadAsync(), Asset.loadAsync(StackAssets)]);
    // console.timeEnd('Startup');
    this.setState({ loading: false });
  };

  _preloadAsync() {
    return AssetUtils.cacheAssetsAsync({
      fonts: this.fonts,
      // files: this.files,
    });
  }

  render() {
    return this.state.loading ? this.loadingScreen : this.screen;
  }
}
