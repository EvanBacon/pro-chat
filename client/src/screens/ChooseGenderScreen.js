import React from 'react';

import OnBoardSlider from '../components/OnBoardSlider';

export default class ChooseGender extends React.Component {
  static navigationOptions = {
    title: 'Select Your Gender',
  };
  render() {
    const { style, navigation } = this.props;

    return (
      <OnBoardSlider
        style={style}
        onSettingSelected={({ key }) => {
          if (key === 'gender') {
            navigation.goBack();
          }
        }}
        include={['gender']}
      />
    );
  }
}
