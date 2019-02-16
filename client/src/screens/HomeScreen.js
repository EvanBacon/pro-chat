'use-strict';

import { Ionicons } from '@expo/vector-icons';
import { dispatch } from '../rematch/dispatch';
import React from 'react';
import { Alert } from 'react-native';
import HeaderButtons from 'react-navigation-header-buttons';
import { connect } from 'react-redux';

import Assets from '../Assets';
import BrowseUsers from '../components/BrowseUsers';
import Gradient from '../components/primitives/Gradient';
import tabBarImage from '../components/Tabs/tabBarImage';
import Meta from '../constants/Meta';
import Settings from '../constants/Settings';
import Fire from '../Fire';
import IdManager from '../IdManager';
import Relationship from '../models/Relationship';
import NavigationService from '../navigation/NavigationService';
import isUnderAge from '../utils/isUnderAge';

// [
//             "0a944021-1ba5-c51a-0e98-fc2dd3834eeb",
//             "102737ac-5af8-ac22-5e5c-cfef54ebefeb",
//             "18c8dc5d-de63-4b62-4868-acc0f4ebc935",
//             "3b2e13c6-f987-5b8c-01c9-f7b5a0e0790e",
//             "4e104b5c-ebe8-53d6-b55f-a92b75659190",
//             "5751c06d-6e5f-727b-fdf9-af30fb8ae87f",
//             "5e1d2071-825a-8896-81ee-9a4c3cb5503b",
//             "6c27c32d-37d9-6b26-477e-8ae93e7ae514",
//             "7d7e9fe3-6324-bd8f-ae1a-36a1309bcf7e",
//             "8pRkRQpqJoaxGQtx1dimxFrSrm73",
//             "KukzZOJZaAefeh334uqElUWDjc92",
//             "c1d9de6a-8f18-d096-4b83-17bf84d1d037",
//             "c54051c8-13c3-5807-bf0b-c3c54cd358ff",
//             "d8645b1a-fec3-8dea-3936-812827978177",
//             "ec132973-530c-30d3-c3b8-5b28e7b2d28a",
//             "fd0b9cc5-ff0a-534a-fa52-dadaa51010af",
//             "ffcac396-4f39-3e39-1cb9-0da2eeee6436"
//           ]
class HomeScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Explore',
    headerRight: (
      <HeaderButtons
        IconComponent={Ionicons}
        OverflowIcon={<Ionicons name="ios-more" size={23} color="blue" />}
        iconSize={23}
        color="blue"
      >
        <HeaderButtons.Item
          title="add"
          iconName="md-add"
          onPress={async () => {}}
        />
      </HeaderButtons>
    ),
  });

  componentWillMount() {
    // this.props.screenProps.getNavigation(this.props.navigation);
    // this.props.navigation.navigate("Map")
    // this.props.navigation.navigate("OtherProfile", {uid: "PWy2WOA1nFNc8vwMBDYeFmJIKoT2" })
  }

  async componentDidMount() {
    // const { data } = await Fire.shared.getUsersPaged({ size: 50 });
    // console.log({ BillyGoat: data });
    // dispatch.chats.set({});

    NavigationService.navigateToUserSpecificScreen(
      'ReportUser',
      'fHgE92IvgLbUmbG2nU7DOyLsk5e2',
    );

    // setTimeout(() => {
    //   if (Settings.debugGoToChat) {
    //     if (Fire.shared.uid === 'fHgE92IvgLbUmbG2nU7DOyLsk5e2') {
    //       NavigationService.navigateToUserSpecificScreen(
    //         'Chat',
    //         'pfrNeWLaXxMUnB2LBsG84OeSi732',
    //       );
    //     } else {
    //       NavigationService.navigateToUserSpecificScreen(
    //         'Chat',
    //         'fHgE92IvgLbUmbG2nU7DOyLsk5e2',
    //       );
    //     }
    //   }
    // }, 200);

    // firebase.messaging().requestPermissions();

    this.checkBanned((this.props.user || {}).isBlocked);
    this.checkUnderage((this.props.user || {}).birthday);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.user || {}).isBlocked !== (this.props.user || {}).isBlocked
    ) {
      this.checkBanned((nextProps.user || {}).isBlocked);
    }
    const nBirthday = (nextProps.user || {}).birthday;
    const oBirthday = (this.props.user || {}).birthday;
    if (nBirthday !== oBirthday) {
      this.checkUnderage(nBirthday);
      if (!isUnderAge(nBirthday) && isUnderAge(oBirthday)) {
        NavigationService.goBack();
      }
    }
  }
  checkBanned = isBlocked => {
    if (isBlocked) {
      NavigationService.navigate('AccountUnderReview');
    }
  };

  checkUnderage = birthday => {
    if (isUnderAge(birthday)) {
      NavigationService.navigate('UnderAge', { birthday });
    }
  };

  alert = (title, subtitle, buttonTitle) => {
    Alert.alert(title, subtitle, [{ text: buttonTitle, onPress: () => {} }], {
      cancelable: true,
    });
  };

  render() {
    const { firstLike, firstDislike, wantMoreInfo } = this.props;
    return (
      <Gradient style={{ flex: 1 }}>
        <BrowseUsers
          onLike={uid => {
            if (!firstLike) {
              dispatch.onBoarding.update({ firstLike: Date.now() });
              this.alert(
                Meta.meta_info_like_title,
                Meta.meta_info_like_subtitle,
                Meta.meta_info_like_action,
              );
              // if (firebase.analytics) { firebase.analytics().logEvent('first_like', { uid }); }
            }
            dispatch.relationships.updateAsync({
              uid,
              type: Relationship.like,
            });
          }}
          onDislike={uid => {
            if (!firstDislike) {
              dispatch.onBoarding.update({ firstDislike: Date.now() });
              this.alert(
                Meta.meta_info_dislike_title,
                Meta.meta_info_dislike_subtitle,
                Meta.meta_info_dislike_action,
              );
              // if (firebase.analytics) { firebase.analytics().logEvent('first_dislike', { uid }); }
            }
            dispatch.relationships.updateAsync({
              uid,
              type: Relationship.dislike,
            });
          }}
          onIndexChange={uid => {
            if (!wantMoreInfo) {
              dispatch.onBoarding.update({ wantMoreInfo: Date.now() });
              this.alert(
                Meta.meta_info_learn_more_title,
                Meta.meta_info_learn_more_subtitle,
                Meta.meta_info_learn_more_action,
              );
              //               if (firebase.analytics) {
              // firebase
              //                   .analytics()
              //                   .logEvent('user_was_informed_about_tapping_profile_card', {
              //                     uid,
              //                   });
              // }
            }
          }}
          users={this.props.users}
        />
      </Gradient>
    );
  }
}

const ConnectedHomeScreen = connect(
  ({
    user,
    users, // geo: { nearbyUsers: users },
    onBoarding: { firstLike, firstDislike, wantMoreInfo },
  }) => {
    const { [Fire.shared.uid]: currentUser, ...otherUsers } = users;

    console.log('otherUsers', { otherUsers });
    return {
      user,
      firstLike,
      firstDislike,
      wantMoreInfo,
      users: Object.values(otherUsers),
    };

    // return {
    //   user,
    //   users,
    //   firstLike,
    //   firstDislike,
    //   wantMoreInfo,
    // }
  },
)(HomeScreen);

ConnectedHomeScreen.navigationOptions = {
  title: 'Matches',
  tabBarIcon: tabBarImage({
    active: Assets.images.home_active,
    inactive: Assets.images.home_inactive,
  }),
};

export default ConnectedHomeScreen;
