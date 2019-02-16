import React from 'react';

import OnBoardSlider from '../components/OnBoardSlider';

export default class ChooseInterestScreen extends React.Component {
  static navigationOptions = {
    title: 'Choose Your Intrest',
  };
  render() {
    const { style, navigation } = this.props;

    return (
      <OnBoardSlider
        style={style}
        onSettingSelected={({ key }) => {
          if (key === 'interest') {
            navigation.goBack();
          }
        }}
        include={['interest']}
      />
    );
  }
}
