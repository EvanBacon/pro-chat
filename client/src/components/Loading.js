import React from 'react';
import { Image } from 'react-native';
import { Constants } from 'expo';
import Assets from '../Assets';
import { AppLoading } from '../universal/Expo';

export default class Loading extends React.PureComponent {
  render() {
    return <AppLoading />;
    // return (
    //   <Image
    //     style={{
    //       resizeMode: 'cover',
    //       flex: 1,
    //       width: '100%',
    //       height: '100%',
    //       backgroundColor: Constants.manifest.tintColor,
    //     }}
    //     source={Assets.images.splash}
    //   />
    // );
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
