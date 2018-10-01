import React from 'react';
import { View } from 'react-native';

import './utils/disableLogs';

import Assets from './Assets';
import Settings from './constants/Settings';
import Fire from './Fire';
import Navigation from './navigation';
import Gate from './rematch/Gate';
import AssetUtils from './universal/AssetUtils';
import { AppLoading } from './universal/Expo';

console.ignoredYellowBox = Settings.ignoredYellowBox;

export default class App extends React.Component {
  state = { loading: true };

  get loadingScreen() {
    if (Settings.debug) {
      return <View />;
    }
    return <AppLoading />;
  }

  get screen() {
    return (
      <Gate>
        <Navigation />
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

  componentWillMount() {
    console.time('Startup');
    this._setupExperienceAsync();
  }

  componentDidMount() {
    Fire.shared.init();
  }

  componentWillUnmount() {}

  _setupExperienceAsync = async () => {
    await Promise.all([this._preloadAsync()]);
    console.timeEnd('Startup');
    this.setState({ loading: false });
  };

  async _preloadAsync() {
    await AssetUtils.cacheAssetsAsync({
      fonts: this.fonts,
      files: this.files,
    });
  }

  render() {
    return this.state.loading ? this.loadingScreen : this.screen;
  }
}
