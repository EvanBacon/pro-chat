import React from 'react';
import { RefreshControl } from 'react-native';

import Meta from '../constants/Meta';

class BootyRefreshControl extends React.Component {
  render() {
    const { props } = this;

    return <RefreshControl title={Meta.updating} tintColor="white" titleColor="white" {...props} />;
  }
}

export default BootyRefreshControl;
