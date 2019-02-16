import React from 'react';
import { dispatch } from '../../rematch/dispatch';

import Icon from './Icon';

class Home extends React.Component {
  onPress = () => {
    dispatch.game.menu();
    if (this.props.onPress) this.props.onPress();
  };

  render() {
    const { onPress, name, ...props } = this.props;
    return <Icon onPress={this.onPress} name="home" {...props} />;
  }
}

export default Home;
