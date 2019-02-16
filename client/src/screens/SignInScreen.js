// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import { dispatch } from '../rematch/dispatch';
import { Svg } from 'expo';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

import Meta from '../constants/Meta';
import Images from '../Images';
import Settings from '../constants/Settings';
import Loading from '../components/primitives/Loading';

const { Defs, RadialGradient, Stop, G, Rect } = Svg;

const { width, height } = Dimensions.get('window');

export default class Screen extends React.Component {
  static navigationOptions = { header: null };
  render() {
    if (Settings.isInAppleReview) {
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        <Background />

        <View style={styles.welcomeContainer}>
          <Image source={Images.login_icon} style={styles.welcomeImage} />

          <Text style={styles.title}>{Meta.sign_in_title}</Text>
          <Text style={styles.subtitle}>{Meta.sign_in_subtitle}</Text>

          <FacebookButton />
        </View>
      </View>
    );
  }
}

const FacebookButton = () => (
  <TouchableBounce
    onPress={() => {
      dispatch.auth.login();
    }}
  >
    <Text
      style={{
        overflow: 'hidden',
        marginBottom: 12,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowColor: '#331a71',
        shadowOffset: { width: 0, height: 0 },
        backgroundColor: '#7076FE',
        fontSize: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        color: 'white',
      }}
    >
      {Meta.sign_in_action.toUpperCase()}
    </Text>
  </TouchableBounce>
);

const Background = () => (
  <Svg
    width={width}
    height={height}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }}
  >
    <Defs>
      <RadialGradient
        cx="50%"
        cy="25.8550412%"
        fx="50%"
        fy="25.8550412%"
        r="76.3510745%"
        transform={{
          translate: '-0.5, -0.258550',
          scale: '1, 0.562219',
          rotate: '90',
        }}
        id="radialGradient-1"
      >
        <Stop stopColor="#4E29B0" offset="0" />
        <Stop stopColor="#8E4CC2" offset="1" />
      </RadialGradient>
    </Defs>
    <G
      id="Screens"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <G id="2.-Sign_up" fill="url(#radialGradient-1)">
        <Rect
          id="Rectangle-13"
          transform={{
            translate: `${width}, ${height}`,
            rotate: '-180',
          }}
          x="2.27373675e-13"
          y="0"
          width={`${width * 2}`}
          height={`${height * 2}`}
        />
      </G>
    </G>
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'center',
    color: '#331a71',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'center',
    color: '#331a71',
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',

    borderRadius: 16,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    shadowOpacity: 0.2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    position: 'absolute',
    left: 24,
    right: 24,
    top: 150,
    bottom: 120,
  },
  welcomeImage: {
    flex: 1,
    maxHeight: 140,
    resizeMode: 'contain',
    // height: 34.5,
    marginTop: 10,
  },
});
