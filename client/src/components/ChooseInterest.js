import React from 'react';

import OnBoardSlider from './OnBoardSlider';

export default class ChooseInterest extends React.Component {
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
