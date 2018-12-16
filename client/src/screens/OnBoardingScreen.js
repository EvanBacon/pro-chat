import React from 'react';

import OnBoardSlider from '../components/OnBoardSlider';
import NavigationService from '../navigation/NavigationService';

export default class OnBoardingScreen extends React.Component {
  static navigationOptions = {
    title: '',
  };
  render() {
    const { style, navigation } = this.props;

    return (
      <OnBoardSlider
        style={style}
        onSettingSelected={({ key }) => {
          if (key === 'finished') {
            NavigationService.navigate('App');
          }
        }}
      />
    );
  }
}
