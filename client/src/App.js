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
