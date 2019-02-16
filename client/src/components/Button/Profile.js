import React from 'react';
import Icon from './ToggleIcon';
import Images from '../../Images';

export default props => (
  <Icon
    {...props}
    noShadow
    active={Images.profile_active}
    inactive={Images.profile_inactive}
  />
);
