import React from 'react';
import Icon from './ToggleIcon';
import Images from '../../Images';

export default props => (
  <Icon
    {...props}
    noShadow
    active={Images.gallery}
    inactive={Images.gallery}
  />
);
