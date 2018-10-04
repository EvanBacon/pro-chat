import React from 'react';

import Images from '../../Images';
import Icon from './ToggleIcon';

export default props => (
  <Icon
    {...props}
    noShadow
    active={Images.settings}
    inactive={Images.settings}
  />
);
