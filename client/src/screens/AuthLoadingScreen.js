import React from 'react';
import { StyleSheet } from 'react-native';

import { AppLoading } from '../universal/Expo';

// import Loading from '../components/Loading';
export default class Screen extends React.Component {
  static navigationOptions = { title: 'Loading' };

  render() {
    return <AppLoading />;
    // return (
    //   <View style={styles.container}>
    //     <StatusBar barStyle="default" />
    //     <ActivityIndicator />
    //     <Text style={styles.text}>Loading</Text>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#331a71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});
