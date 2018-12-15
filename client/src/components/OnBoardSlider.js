import { connectActionSheet } from '@expo/react-native-action-sheet';
import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { dispatch } from '../rematch/dispatch';
import { Permissions } from '../universal/Expo';
import Meta from '../constants/Meta';
import Settings from '../constants/Settings';
import Images from '../Images';
import Gender from '../models/Gender';
import selectImage from '../utils/SelectImage';
import Button from './Button';
import Gradient from './Gradient';
import OnBoardSliderCard from './OnBoardSliderCard';

// import { getLocationPermission } from '../redux/permissions';
// import { updateUserProfile } from '../redux/profiles';
const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Arrow = () => (
  <View
    style={{
      alignItems: 'center',
      flex: 1,
      minHeight: 85,
      justifyContent: 'flex-end',
    }}
  >
    <Image
      style={{
        resizeMode: 'contain',
        width: 36,
      }}
      source={Images.arrow_right}
    />
  </View>
);

@connectActionSheet
class Edit extends React.Component {
  render = () => (
    <Button.Outline
      onPress={() => {
        selectImage(
          this.props.showActionSheetWithOptions,
          async image => {
            if (image) {
              try {
                this.props.setupImage(image);

                dispatch.user.updateProfileImage(image, this.props.onProgress);
                this.props.onComplete(image.uri || image);
              } catch (error) {
                if (this.props.onError) this.props.onError(error);
                // TODO: Handle Image upload failure
              }
            }
          },
          this.props.onSelectCamera,
        );
      }}
      title="Add Your Booty"
      style={[{ flex: 1 }, this.props.style]}
    />
  );
}

const Select = ({ onSelect, canSelect, children, style }) => (
  <View style={[{ flex: 1, minHeight: 85, justifyContent: 'flex-end' }, style]}>
    <View style={{ flexDirection: 'row', minHeight: 40, marginBottom: 4 }}>
      {children}
    </View>
    <Button.Outline
      on={canSelect}
      disabled={!canSelect}
      onPress={onSelect}
      title="Select"
      style={{ flex: 1 }}
    />
  </View>
);

class Slider extends React.Component {
  static defaultProps = {
    onSelectIndex: index => {},
  };
  page = 0;
  scroll = new Animated.Value(0);
  state = {
    width: 0,
    itemWidth: width * 0.7,
  };
  _onLayout = ({ nativeEvent: { layout } }) => this.setState({ ...layout });

  scrollToNext = () => {
    if (isNaN(this.page)) {
      return;
    }
    const nextIndex = Math.min(this.page + 1, this.props.items.length - 1);
    this.flatlist
      .getNode()
      .scrollToIndex({ animated: true, index: nextIndex, viewPosition: 0 });
  };

  renderItem = ({ item, index }) => (
    <OnBoardSliderCard
      onPress={() => item.pushNext && this.scrollToNext()}
      index={index}
      scroll={this.scroll}
      itemWidth={this.state.itemWidth}
      title={item.title}
      subtitle={item.subtitle}
      image={item.image}
      accessoryView={item.accessoryView}
    />
  );

  _onScrollEnd = event => {
    const offset = { ...event.nativeEvent.contentOffset };
    const page = this._calculateCurrentPage(offset.x);
    this.page = page;

    const item = this.props.items[page] || {};
    this.props.onSelectIndex(page, item.key || item);
  };
  _calculateCurrentPage = offset => {
    const { itemWidth } = this.state;
    return Math.floor(offset / itemWidth);
  };

  render() {
    const { items, style } = this.props;
    const { width, itemWidth } = this.state;
    const centerOffset = (width - itemWidth) * 0.5;

    return (
      <Gradient style={[{ flex: 1 }, style]}>
        <AnimatedFlatList
          ref={ref => {
            this.flatlist = ref;
            this.props.listRef && this.props.listRef(ref);
          }}
          overScrollMode="never"
          style={[{ flex: 1 }]}
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
              width: itemWidth * items.length + centerOffset * 2,
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
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.scroll,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
          renderItem={this.renderItem}
          data={items}
        />
      </Gradient>
    );
  }
}

class OnboardSlider extends React.Component {
  static defaultProps = {
    onSelectIndex: (index, key) => {},
  };

  componentWillMount() {
    // dispatch.permissions.getAsync(Permissions.LOCATION);
  }

  gatherItems = () => {
    const {
      loggedIn,
      knowsAboutMatching,
      knowsAboutSwiping,
      knowsAboutAnon,
      gender,
      interestedIn,
      image,
      locationPermission,
      getLocationPermission,
    } = this.props;

    if (loggedIn) {
      const items = [];

      if (!knowsAboutMatching) {
        items.push('matching');
      }
      if (locationPermission !== 'granted') {
        items.push('location');
      }
      if (!knowsAboutSwiping) {
        items.push('swiping');
      }
      if (!gender) {
        items.push('gender');
      }
      if (!knowsAboutAnon) {
        items.push('anon');
      }
      if (!image && Settings.needsProfileImage) {
        items.push('profilePicture');
      }
      if (!interestedIn) {
        items.push('interest');
      }

      // TODO: I dont like this...
      if (items.length == 0) {
        return ['finished'];
      }
      return items;
    }
    return ['signIn'];
  };

  render() {
    const {
      onSelectIndex,
      style,
      contentContainerStyle,
      include,
      onSettingSelected,
    } = this.props;

    const items = include || this.gatherItems();
    return (
      <InputSlider
        interest={this.props.interestedIn}
        include={items}
        updateProfileImage={dispatch.user.updateProfileImage}
        updateUserProfile={dispatch.user.updateUserProfile}
        style={style}
        onSelectCamera={this.props.onSelectCamera}
        onSettingSelected={onSettingSelected}
        onSelectIndex={onSelectIndex}
        contentContainerStyle={contentContainerStyle}
      />
    );
  }
}

class InputSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interest: props.interest,
    };
  }
  scrollToNext = () => {
    if (isNaN(this.page)) {
      return;
    }
    const nextIndex = Math.min(this.page + 1, this.items.length - 1);
    this.flatlist
      .getNode()
      .scrollToIndex({ animated: true, index: nextIndex, viewPosition: 0 });
  };
  cards = {
    signIn: {
      key: 'signIn',
      image: Images.onboard.booty,
      title: Meta.on_boarding_signin_title,
      subtitle: Meta.on_boarding_signin_subtitle,
      accessoryView: <Button.Facebook />,
    },
    matching: {
      key: 'knowsAboutMatching',
      image: Images.onboard.message,
      title: Meta.on_boarding_matching_title,
      pushNext: true,
      subtitle: Meta.on_boarding_matching_subtitle,
      accessoryView: <Arrow />,
    },
    anon: {
      key: 'knowsAboutAnon',
      image: Images.onboard.anon,
      title: Meta.on_boarding_anon_title,
      pushNext: true,
      subtitle: Meta.on_boarding_anon_subtitle,
      accessoryView: <Arrow />,
    },
    location: () => {
      const { locationPermission, getLocationPermission } = this.props;
      const meta = {
        undetermined: Meta.on_boarding_location_subtitle_undetermined,
        denied: Meta.on_boarding_location_subtitle_denied,
      };

      return {
        key: 'location',
        image: Images.onboard.location,
        title: Meta.on_boarding_location_title,
        subtitle: meta[locationPermission],
        accessoryView: (
          <Button.Location
            proceed={() => {
              this.scrollToNext();
              getLocationPermission && getLocationPermission();
              this.onSettingSelected({ key: 'location' });
            }}
          />
        ),
      };
    },

    gender: () => {
      const intoBoth = this.state.gender == Gender.both;
      const intoMen = intoBoth || this.state.gender == Gender.male;
      const intoWomen = intoBoth || this.state.gender == Gender.female;

      return {
        key: 'gender',
        image: Images.onboard.question,
        title: Meta.on_boarding_gender_title,
        subtitle: Meta.on_boarding_gender_subtitle,
        accessoryView: (
          <Select
            style={{
              flex: 1,
              justifyContent: 'flex-start',
            }}
            canSelect={intoWomen || intoMen}
            onSelect={() => {
              this.props.updateUserProfile({ gender: this.state.gender });
              this.onSettingSelected({ key: 'gender' });
              this.scrollToNext();
              // this.flatlist.getNode().scrollToIndex({ animated: true, index: this.page + 1, viewPosition: 0 })
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                flexDirection: 'row',
                minHeight: 40,
                maxHeight: 40,
              }}
            >
              <Button.Outline
                on={intoMen}
                onPress={() => {
                  if (intoBoth) {
                    this.setState({ gender: Gender.female });
                  } else if (intoMen) {
                    {
                      /* this.setState({gender: null}) */
                    }
                  } else {
                    this.setState({ gender: Gender.male });
                  }
                }}
                title={Meta.male}
                style={{ flex: 1, marginRight: 2 }}
              />
              <Button.Outline
                on={intoWomen}
                onPress={() => {
                  if (intoBoth) {
                    this.setState({ gender: Gender.male });
                  } else if (intoWomen) {
                    {
                      /* this.setState({gender: null}) */
                    }
                  } else {
                    this.setState({ gender: Gender.female });
                  }
                }}
                title={Meta.female}
                style={{
                  flex: 1,
                  marginLeft: 2,
                }}
              />
            </View>
          </Select>
        ),
      };
    },
    interest: () => {
      const intoBoth = this.state.interest == 'both';
      const intoMen = intoBoth || this.state.interest == Gender.male;
      const intoWomen = intoBoth || this.state.interest == Gender.female;
      return {
        key: 'interest',
        image: Images.onboard.gender,
        title: Meta.on_boarding_interest_title,
        subtitle: Meta.on_boarding_interest_subtitle,
        accessoryView: (
          <Select
            style={{ minHeight: 85 }}
            canSelect={intoWomen || intoMen}
            onSelect={() => {
              this.props.updateUserProfile({ interest: this.state.interest });
              this.onSettingSelected({ key: 'interest' });
              this.scrollToNext();
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                minHeight: 40,
                maxHeight: 40,
              }}
            >
              <Button.Outline
                on={intoMen}
                onPress={() => {
                  if (intoBoth) {
                    this.setState({ interest: Gender.female });
                  } else if (intoMen) {
                    this.setState({ interest: null });
                  } else if (intoWomen) {
                    this.setState({ interest: Gender.both });
                  } else {
                    this.setState({ interest: Gender.male });
                  }
                }}
                title={Meta.men}
                style={{ flex: 1, marginRight: 2 }}
              />
              <Button.Outline
                on={intoWomen}
                onPress={() => {
                  if (intoBoth) {
                    this.setState({ interest: Gender.male });
                  } else if (intoWomen) {
                    this.setState({ interest: null });
                  } else if (intoMen) {
                    this.setState({ interest: Gender.both });
                  } else {
                    this.setState({ interest: Gender.female });
                  }
                }}
                title={Meta.women}
                style={{ flex: 1, marginLeft: 2 }}
              />
            </View>
          </Select>
        ),
      };
    },
    swiping: {
      key: 'knowsAboutSwiping',
      image: Images.onboard.card,
      title: Meta.on_boarding_swiping_title,
      pushNext: true,
      subtitle: Meta.on_boarding_swiping_subtitle,
      accessoryView: <Arrow />,
    },
    profilePicture: () => ({
      key: 'profilePicture',
      image: this.state.image || Images.onboard.naked,
      title: Meta.on_boarding_picture_title,
      subtitle: Meta.on_boarding_picture_subtitle,
      accessoryView: (
        <Select
          style={{ flex: 1 }}
          canSelect={this.state.image}
          onSelect={() => {
            this.onSettingSelected({ key: 'profilePicture' });
            this.scrollToNext();
          }}
        >
          <Edit
            updateProfileImage={dispatch.user.updateProfileImage}
            onSelectCamera={this.props.onSelectCamera}
            setupImage={image => {
              // this.setState({image})
            }}
            onComplete={image => {
              console.log('On Complete onboard:image', image);
              this.setState({ image });
            }}
            onError={error => {}}
            onProgress={progress => {}}
          />
        </Select>
      ),
    }),
    finished: {
      key: 'finished',
      image: Images.onboard.naked,
      title: Meta.on_boarding_finished_title,
      subtitle: Meta.on_boarding_finished_subtitle,
      accessoryView: (
        <Select
          style={{ flex: 1 }}
          canSelect
          onSelect={() => {
            this.onSettingSelected({ key: 'finished' });
          }}
        />
      ),
    },
  };

  onSettingSelected = ({ key, ...item }) =>
    this.props.onSettingSelected &&
    this.props.onSettingSelected({ key, ...item });

  gatherItems = include => {
    const items = [];
    for (const key of include) {
      const item = this.cards[key];
      if (item instanceof Function) {
        items.push(item());
      } else {
        items.push(item);
      }
    }
    return items;
  };
  render() {
    const { include, onSettingSelected, ...props } = this.props;

    this.items = this.gatherItems(include);

    return (
      <Slider
        {...props}
        listRef={ref => (this.flatlist = ref)}
        items={this.items}
      />
    );
  }
}

export default connect(({ permissions: { location }, user }) => ({
  locationPermission: location,
  interestedIn: user.interest,
}))(OnboardSlider);
