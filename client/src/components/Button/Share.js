import React from 'react';

import shareUser from '../../utils/shareUser';
import Icon from './Icon';

class ShareButton extends React.Component {
  render() {
    const { onPress, name, ...props } = this.props;
    return <Icon onPress={shareUser} name="share" {...props} />;
  }
}

export default ShareButton;
