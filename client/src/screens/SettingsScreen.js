import Expo from 'expo';
import React from 'react';
import {
  Animated,
  Text,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import Gradient from '../components/Gradient';
import Colors from '../constants/Colors';
import firebase from 'firebase';
import Images from '../Images';
import Meta from '../constants/Meta';
// import { signOutUser } from '../redux/auth';
// import { updateUserProfile } from '../redux/profiles';
import emailSupport, { Subjects } from '../utils/emailSupport';
import transformInterestTitle from '../utils/transformInterestTitle';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedText = Animated.createAnimatedComponent(DinPro.Medium);
const ModelInfo = () => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      paddingHorizontal: 32,
      height: 80,
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        backgroundColor: 'transparent',
        fontSize: 16,
        color: 'white',
      }}
    >
      {Meta.app_name}
    </Text>
    <Text
      style={{
        backgroundColor: 'transparent',
        fontSize: 16,
        color: 'white',
      }}
    >
      {Meta.version}
    </Text>
    <Text
      style={{
        backgroundColor: 'transparent',
        fontSize: 16,
        color: 'white',
      }}
    >
      {Meta.settings_build}
    </Text>
  </View>
);

class Carousel extends React.Component {
  scroll = new Animated.Value(0);
  state = {
    width: 0,
    itemWidth: 130,
  };

  _onLayout = ({ nativeEvent: { layout } }) => this.setState({ ...layout });

  renderItem = ({ item, index }) => {
    const { itemWidth } = this.state;
    const center = index * itemWidth;

    const inputRange = [center - itemWidth, center, center + itemWidth];

    const inputRangeLonger = [
      center - itemWidth * 1.5,
      center - itemWidth,
      center,
      center + itemWidth,
      center + itemWidth * 1.5,
    ];

    const inputRangeFiner = [
      center - itemWidth,
      center - itemWidth * 0.5,
      center,
      center + itemWidth * 0.5,
      center + itemWidth,
    ];

    const _scale = 0.33;
    const _translate = 75;

    const scale = this.scroll.interpolate({
      inputRange,
      outputRange: [_scale, 1, _scale],
      extrapolate: 'clamp',
    });
    const translateX = this.scroll.interpolate({
      inputRange: inputRangeLonger,
      outputRange: [
        -_translate * 2.5,
        -_translate,
        0,
        _translate,
        _translate * 2.5,
      ],
    });
    const opacity = this.scroll.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
    });
    const subtitleTranslateY = this.scroll.interpolate({
      inputRange,
      outputRange: [-8, 0, -8],
    });

    const invertedOpacity = this.scroll.interpolate({
      inputRange: inputRangeFiner,
      outputRange: [0.45, 0, 0, 0, 0.45],
      extrapolate: 'clamp',
    });
    const dotTranslateY = this.scroll.interpolate({
      inputRange,
      outputRange: [0, 16, 0],
      extrapolate: 'clamp',
    });

    const animated = {
      transform: [{ scale }, { translateX }],
    };
    const style = {
      width: itemWidth,
      backgroundColor: 'transparent',
    };

    const animatedText = {
      opacity,
      transform: [{ translateY: subtitleTranslateY }],
    };

    const animatedDot = {
      opacity: invertedOpacity,
      backgroundColor: 'white',
      width: 16,
      height: 16,
      borderRadius: 8,
      transform: [{ translateY: dotTranslateY }],
    };

    return (
      <Animated.View style={StyleSheet.flatten([animated, style])}>
        <Text style={{ fontSize: 100, color: 'white', textAlign: 'center' }}>
          {item}
        </Text>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <AnimatedText
            style={StyleSheet.flatten([
              {
                marginTop: -16,
                fontSize: 16,
                textAlign: 'center',
                color: 'white',
              },
              animatedText,
            ])}
          >
            Miles
          </AnimatedText>
          <View
            style={StyleSheet.flatten([
              StyleSheet.absoluteFill,
              { justifyContent: 'center', alignItems: 'center' },
            ])}
          >
            <Animated.View style={animatedDot} />
          </View>
        </View>
      </Animated.View>
    );
  };

  _onScrollEnd = (event) => {
    const offset = { ...event.nativeEvent.contentOffset };
    const page = this._calculateCurrentPage(offset.x);
    // estimatedPage = page
    this.props.onSelectIndex(page, this.props.data[page]);
    // this._setCurrentPage(page);

    if (Platform.os === 'ios') {
      ReactNativeHaptic.generate('selection');
    }
  };
  _calculateCurrentPage = (offset) => {
    const { itemWidth } = this.state;
    return Math.floor(offset / itemWidth);
  };

  render() {
    const { data } = this.props;
    const { width, itemWidth } = this.state;
    const centerOffset = (width - itemWidth) * 0.5;

    return (
      <AnimatedFlatList
        ref={this.props.getRef}
        style={this.props.style}
        horizontal
        keyExtractor={(item, index) => `tuner-card-${index}`}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        scrollEventThrottle={1}
        decelerationRate={0}
        contentContainerStyle={StyleSheet.flatten([
          this.props.contentContainerStyle,
          {
            marginLeft: centerOffset,
            alignItems: 'center',
            width: itemWidth * data.length + centerOffset * 2,
            // height: size.height,
          },
        ])}
        getItemLayout={(data, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        onMomentumScrollEnd={this._onScrollEnd}
        onLayout={this._onLayout}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: this.scroll } } }],
          { useNativeDriver: true },
        )}
        renderItem={this.renderItem}
        data={data}
      />
    );
  }
}

const Arrow = () => (
  <Image
    style={{
      width: 19,
      height: 19,
      overflow: 'visible',
      resizeMode: 'contain',
    }}
    source={Images.arrow_right}
  />
);

const TableRowCell = ({ title, onPress, accessoryView = null }) => (
  <TouchableHighlight
    underlayColor={Colors.lightUnderlay}
    style={{ flex: 1 }}
    onPress={onPress}
  >
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        height: 80,
        alignItems: 'center',
      }}
    >
      <DinPro.Medium
        style={{
          fontSize: 16,
          color: 'white',
        }}
      >
        {title}
      </DinPro.Medium>
      {accessoryView}
    </View>
  </TouchableHighlight>
);

const ItemDivider = () => (
  <View
    style={{
      width: '100%',
      height: StyleSheet.hairlineWidth,
      backgroundColor: 'rgba(255,255,255,0.5)',
    }}
  />
);

const ArrowCell = ({ title, onPress }) => (
  <TableRowCell title={title} onPress={onPress} accessoryView={<Arrow />} />
);

class SwitchCell extends React.Component {
  state = { on: false };

  render() {
    const { title, onPress, enabled } = this.props;

    const switchComponent = (
      <Switch
        onValueChange={this.props.onValueChange}
        onTintColor={Colors.white}
        thumbTintColor={enabled ? Colors.tintColor : Colors.white}
        tintColor={Colors.white}
        value={enabled}
      />
    );
    return (
      <TableRowCell
        title={title}
        onPress={_ => this.props.onValueChange(!enabled)}
        accessoryView={switchComponent}
      />
    );
  }
}

const urls = {
  support: 'support',
  privacy: 'privacy',
  terms: 'terms',
  contact: 'contact',
  // licenses: "licenses",
  eula: 'eula',
};

class SettingsScreen extends React.Component {
  ranges = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  setCarousel = false;
  constructor(props) {
    super(props);
    const { searchRange } = props;
    const rangeIndex = this.ranges.indexOf(searchRange || 50);
    this.state = {
      searchRange: rangeIndex || this.ranges.length - 1,
      notificationsEnabled: props.notificationsEnabled,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.interest != this.props.interest &&
      this.props.interest &&
      nextProps.interest
    ) {
      dispatch.location.getAsync();
    }
  }

  // updateUserProfile = (updates) => {
  //   InteractionManager.runAfterInteractions(_ => {
  //     this.props.updateUserProfile(updates)
  //   });
  // }

  openWeb = (url, title) =>
    this.props.navigation.navigate('Website', {
      url: `http://bootyalert.net/${url}`,
      title,
    });

  render() {
    const onPress = {
      privacy: () => {},
      eula: () => this.openWeb(urls.eula, Meta.eula),
      team: (_) => {
        this.props.navigation.navigate('Team', {});
      },
      interest: () => {
        this.props.navigation.navigate('ChooseInterest', {});
      },
      logout: this.props.signOutUser,
      delete: () => {},
      update: () => Expo.Util.reload(),
      privacypolicy: _ => this.openWeb(urls.privacy, Meta.privacy_policy),
      tos: _ => this.openWeb(urls.terms, Meta.terms_of_service),
      licenses: _ => this.openWeb(urls.licenses, Meta.licenses),
      help: _ => this.openWeb(urls.contact, Meta.contact),
      contact: _ => emailSupport({ subject: Subjects.general }),
    };

    return (
      <Gradient style={StyleSheet.absoluteFill}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 128 - 81 }}
        >
          <Carousel
            style={{ paddingBottom: 32 }}
            data={this.ranges}
            getRef={(val) => {
              const milesIndex = 2; // / this.props.milesIndex;
              this.scrollView = val;
              if (val && !this.setCarousel) {
                this.setCarousel = true;

                setTimeout((_) => {
                  const node = ((val || {}).getNode && val.getNode()) || {};
                  node.scrollToOffset &&
                    node.scrollToOffset({
                      animated: true,
                      offset: this.state.searchRange * 130,
                    });
                }, 5);
              }
            }}
            onSelectIndex={(index, searchRange) =>
              this.props.updateUserProfile({ searchRange })
            }
          />
          {/* {<View style={{justifyContent: 'center', alignItems: 'center'}}>

            <Button.Outline
              style={{}}
              onPress={_ => {

              }}>Select Range<Button.Outline>

          </View>} */}
          <ItemDivider />
          {/* <ArrowCell title={"Privacy Settings"} onPress={onPress.privacy} /> */}
          <SwitchCell
            title={Meta.notifications}
            onValueChange={(notificationsEnabled) => {
              if (notificationsEnabled) {
                firebase.messaging().requestPermissions();
              }

              this.setState({ notificationsEnabled }, _ =>
                this.props.updateUserProfile({ notificationsEnabled }));
            }}
            onPress={null}
            enabled={this.state.notificationsEnabled}
          />

          <ArrowCell title={Meta.the_team} onPress={onPress.team} />
          <ArrowCell title={Meta.eula} onPress={onPress.eula} />
          <ArrowCell
            title={Meta.privacy_policy}
            onPress={onPress.privacypolicy}
          />
          <ArrowCell title={Meta.terms_of_service} onPress={onPress.tos} />
          <ArrowCell title={Meta.licenses} onPress={onPress.licenses} />

          <ArrowCell title={Meta.help_support} onPress={onPress.help} />

          <TableRowCell
            title={Meta.interested_in}
            onPress={onPress.interest}
            accessoryView={
              <DinPro.Light
                style={{
                  color: 'white',
                  fontSize: 16,
                  textAlign: 'right',
                }}
              >
                {transformInterestTitle(this.props.interest || '')}
              </DinPro.Light>
            }
          />

          <ItemDivider />
          {/* <ArrowCell title={"Check Updates"} onPress={onPress.update} /> */}
          <ArrowCell title={Meta.log_out} onPress={onPress.logout} />
          {/* <ArrowCell title={"Delete Account"} onPress={onPress.delete} /> */}

          <ItemDivider />
          <ModelInfo />
        </ScrollView>
      </Gradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    paddingTop: 128,
  },
});

const mergeProps = (state, actions, localProps) => {
  const uid = Fire.shared.uid;

  const { users, ...props } = state;

  const user = users[uid] || {};
  // const image = images[uid];

  return {
    ...localProps,
    ...props,
    uid,
    interest: user.interest,
    searchRange: user.searchRange,
    notificationsEnabled: user.notificationsEnabled,
    ...actions,
  };
};

export default connect(
  ({ profiles: { users } }) => ({
    users,
  }),
  { },
  mergeProps,
)(SettingsScreen);
