import React from 'react';
import { View, StatusBar } from 'react-native';

import './utils/disableLogs';

import Assets from './Assets';
import Settings from './constants/Settings';
import Fire from './Fire';
import Navigation from './navigation';
import Gate from './rematch/Gate';
import AssetUtils from './universal/AssetUtils';
import { AppLoading } from './universal/Expo';
import { ActionSheetProvider } from './universal/ActionSheet';
import Loading from './components/Loading';
import { dispatch } from '@rematch/core';

console.ignoredYellowBox = Settings.ignoredYellowBox;

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
  }

  componentWillUnmount() {}

  _setupExperienceAsync = async () => {
    await Promise.all(this._preloadAsync());
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
