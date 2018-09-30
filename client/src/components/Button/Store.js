import React from 'react';

import Icon from './Icon';

class Store extends React.Component {
  static defaultProps = {
    onPress: () => {},
  };
  render() {
    return <Icon {...this.props} name="unlock" />;
  }
}

export default Store;
