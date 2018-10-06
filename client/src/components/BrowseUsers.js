import { dispatch } from '@rematch/core';
import React, { Component } from 'react';
import { LayoutAnimation, View } from 'react-native';

import Assets from '../Assets';
import Meta from '../constants/Meta';
import EmptyListMessage from './EmptyListMessage';
import Footer from './Footer';
import Gradient from './Gradient';
import Section from './Section';
import Slider from './Slider';
import NavigationService from '../navigation/NavigationService';
import Settings from '../constants/Settings';

const Images = Assets.images;
// const debug = false;
// import Assets from '../'

export default class BrowseUsers extends Component {
  count = 0;
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      //   opacity: new Animated.Value(0),
      selectedData: Object.keys(props.users)[0],
      isSwipingBack: false,
    };
  }

  swipeBack = () => {
    if (!this.state.isSwipingBack) {
      this.setIsSwipingBack(true, () => {
        this.swiper.swipeBack(() => {
          this.setIsSwipingBack(false);
        });
      });
    }
  };

  setIsSwipingBack = (isSwipingBack, cb) => {
    this.setState(
      {
        isSwipingBack,
      },
      cb,
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;
    if (state.index !== nextState.index) {
      LayoutAnimation.easeInEaseOut();
    }
    return true;
  }

  _like = () => this.swiper.swipeRight();
  _dislike = () => this.swiper.swipeLeft();

  get users() {
    // let _users = {};
    // [
    //     "0a944021-1ba5-c51a-0e98-fc2dd3834eeb",
    //     // "102737ac-5af8-ac22-5e5c-cfef54ebefeb",
    //     // "18c8dc5d-de63-4b62-4868-acc0f4ebc935",
    //     // "3b2e13c6-f987-5b8c-01c9-f7b5a0e0790e",
    //     // "4e104b5c-ebe8-53d6-b55f-a92b75659190",
    //     // "5751c06d-6e5f-727b-fdf9-af30fb8ae87f",
    //     // "5e1d2071-825a-8896-81ee-9a4c3cb5503b",
    //     // "6c27c32d-37d9-6b26-477e-8ae93e7ae514",
    //     // "7d7e9fe3-6324-bd8f-ae1a-36a1309bcf7e",
    //     // "8pRkRQpqJoaxGQtx1dimxFrSrm73",
    //     // "KukzZOJZaAefeh334uqElUWDjc92",
    //     // "c1d9de6a-8f18-d096-4b83-17bf84d1d037",
    //     // "c54051c8-13c3-5807-bf0b-c3c54cd358ff",
    //     // "d8645b1a-fec3-8dea-3936-812827978177",
    //     // "ec132973-530c-30d3-c3b8-5b28e7b2d28a",
    //     // "fd0b9cc5-ff0a-534a-fa52-dadaa51010af",
    //     // "ffcac396-4f39-3e39-1cb9-0da2eeee6436"
    // ].map(v => {
    //     _users[v] = { uid: v };
    // })

    // return _users;

    return this.props.users;
  }

  render() {
    const { users } = this;
    const { selectedData } = this.state;

    // const keys = [
    //   'fake-03',
    //   'fake-033',
    //   'fake-0333',
    //   'fake-033333',
    //   'fake-0333432',
    // ];

    const keys = users; // Object.keys(users || {});

    if (!users || !keys.length) {
      if (Settings.hideBooty) {
        return null;
      }

      return (
        <Gradient
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 16,
          }}
        >
          <EmptyListMessage
            inverted
            onPress={() => {
              dispatch.location.getAsync();

              // {/* this.setState({ swipedAllCards: false });
              // this.updatedIndex(0); */}
            }}
            buttonTitle={Meta.try_again}
            color="white"
            image={Images.empty.users}
            title={Meta.no_more_booty_title}
            subtitle={Meta.no_more_booty_subtitle}
          />
        </Gradient>
      );
    }
    const footerVisible = this.state.index != null;
    const hideRevert = false; // !this.state.index || this.state.index === 0;
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Slider
          style={{
            marginTop: 30,
            overflow: 'visible',
          }}
          onIndexChange={(index) => {
            this.count += 1;
            const uid = keys[index];
            this.setState({
              index,
              selectedData: uid,
            });
            if (this.count >= 4) {
              this.props.onIndexChange(uid);
            }
          }}
          onPressItem={(uid) => {
            NavigationService.navigateToUserSpecificScreen('Profile', { uid });
          }}
          onLike={this.props.onLike}
          onDislike={this.props.onDislike}
          swiperRef={ref => (this.swiper = ref)}
          items={keys}
          onSelectIndex={(index) => {}}
        />
        <Section
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            opacity: footerVisible ? 1 : 0,
          }}
        >
          <Footer
            uid={this.state.selectedData}
            footerVisible={footerVisible}
            onLike={this._like}
            onDislike={this._dislike}
            onShuffle={() => {
              // / Share
            }}
            onRevert={() => {
              // More
            }}
          />
        </Section>
      </View>
    );
  }
}
