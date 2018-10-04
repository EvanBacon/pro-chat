import React from 'react';
import { RefreshControl } from 'react-native';

import Meta from '../constants/Meta';

class ButeRefreshControl extends React.Component {
  static defaultProps = {
    color: 'white',
  };
  render() {
    const { color, ...props } = this.props;

    return (
      <RefreshControl
        title={Meta.updating}
        tintColor={color}
        titleColor={color}
        {...props}
      />
    );
  }
}

export default ButeRefreshControl;
