import React from 'react';
import { Image } from 'react-native';

import Assets from '../Assets';

export default class LoadingIndicator extends React.PureComponent {
  render() {
    return (
      <Image
        style={{
          resizeMode: 'cover',
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        source={Assets.images.splash}
      />
    );
  }
}

// export default LoadingIndicator = () => (
//   <PulseLoader
//     avatar={require('../assets/images/loading.png')}
//   />
// );

// export default () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <LoadingIndicator />
//   </View>
// );
