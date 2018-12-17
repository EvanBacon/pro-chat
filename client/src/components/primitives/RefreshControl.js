import React from 'react';
import { RefreshControl as ReactNativeRefreshControl } from 'react-native';

import Meta from '../../constants/Meta';
import Colors from '../../constants/Colors';

class RefreshControl extends React.Component {
  static defaultProps = {
    color: Colors.white,
  };
  render() {
    const { color, ...props } = this.props;

    return (
      <ReactNativeRefreshControl
        title={Meta.updating}
        tintColor={color}
        titleColor={color}
        {...props}
      />
    );
  }
}

export default RefreshControl;
