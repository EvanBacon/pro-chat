import React from 'react';
import Icon from './ToggleIcon';
import Images from '../../Images';

export default props => (
  <Icon
    {...props}
    noShadow
    active={Images.chat_active}
    inactive={Images.chat_inactive}
  />
);
