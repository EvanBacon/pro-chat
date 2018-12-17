import React from 'react';
import { View } from 'react-native';
import {
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import Button from '../components/Button';
import ChooseInterest from '../screens/ChooseInterestScreen';
import Header from '../components/primitives/Header';
import LicensesScreen from '../components/licenses/Licenses';
import MessageScreen from '../components/MessageList';
import { BAR_HEIGHT } from '../components/styles';
import Colors from '../constants/Colors';
import Settings from '../constants/Settings';
import AccountUnderReviewScreen from '../screens/AccountUnderReviewScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ChatScreen from '../screens/ChatScreen';
import DevTeamScreen from '../screens/DevTeamScreen';
import HomeScreen from '../screens/HomeScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SignInScreen from '../screens/SignInScreen';
import UnderAgeScreen from '../screens/UnderAgeScreen';
import WebsiteScreen from '../screens/WebsiteScreen';
import NavigationService from './NavigationService';
import OnBoarding from '../screens/OnBoardingScreen';

import ChooseGender from '../screens/ChooseGenderScreen';
// import CameraScreen from '../screens/CameraScreen';
import ReportScreen from '../screens/ReportScreen';
import Fire from '../Fire';
// const { tintColor } = Constants.manifest;
const tintColor = '#52416A';

const MainTab = createMaterialTopTabNavigator(
  {
    // MainProfile: ProfileScreen,
    // Main: HomeScreen,
    Messages: MessageScreen,
  },
  {
    tabBarComponent: null,
    // initialRouteName: 'Main',
    cardStyle: {},
    navigationOptions: () => ({
      swipeEnabled: false,
      // Put tab bar on bottom of screen on both platforms
      // tabBarComponent: TabBarBottom,
      tabBarPosition: 'bottom',
      // Disable animation so that iOS/Android have same behaviors
      animationEnabled: true,
      lazy: true,
    }),
    tabBarOptions: {
      // tabBarButtonComponent: () => <Text>
      // activeTintColor: '#e91e63',
      // activeBackgroundColor: '#52416A',
      // inactiveBackgroundColor: tintColor,
      // inactiveTintColor: tintColor,
      showIcon: true,
      showLabel: false,

      labelStyle: {
        fontSize: 16,
        fontFamily: 'DIN-Pro-Medium',
        color: 'white',
      },
      tabStyle: {
        // backgroundColor: 'white',
        // padding: 0,
      },
      indicatorStyle: {
        backgroundColor: 'white',
      },
      style: {
        // padding: 0,
        backgroundColor: tintColor,
      },
    },
  },
);

MainTab.navigationOptions = {
  title: Settings.hideBooty ? 'Expo Chat' : 'Būte',
  headerRight: (
    <View style={{ marginRight: 24 }}>
      <Button.Settings
        selected
        onPress={() => {
          NavigationService.navigate('Settings');
        }}
      />
    </View>
  ),
  headerLeft: (
    <View style={{ marginLeft: 24 }}>
      <Button.Profile
        selected={false}
        onPress={() => {
          NavigationService.navigateToUserSpecificScreen(
            'Profile',
            Fire.shared.uid,
          );
          // NavigationService.navigate('Profile');
        }}
      />
    </View>
  ),
};

const AppStack = createStackNavigator(
  {
    MainTab: MainTab,
    ChooseGender,
    AccountUnderReview: AccountUnderReviewScreen,
    Chat: ChatScreen,
    Profile: ProfileScreen,
    Licenses: LicensesScreen,
    ChooseInterest,
    // Camera: CameraScreen,
    DevTeam: DevTeamScreen,
    // Explore: ExploreScreen,
    ReportUser: ReportScreen,
    Settings: SettingsScreen,
    UnderAge: UnderAgeScreen,
    Website: WebsiteScreen,
  },
  {
    initialRouteName: Settings.mainInitialRouteName,
    cardStyle: {
      // marginTop: BAR_HEIGHT - 30,
      marginTop: BAR_HEIGHT - 30,
    },
    navigationOptions: {
      headerTransparent: true,
      tintColor: 'white',
      headerTintColor: 'white',
      headerBackground: <Header />,
      headerTitleStyle: {
        // fontFamily: 'DINPro-Regular',
        fontSize: 20,
        color: Colors.white,
      },
    },

    // navigationOptions: ({ navigation }) => ({ headerBackground: <Header /> }),
  },
);

const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
});

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
    OnBoarding: OnBoarding,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
