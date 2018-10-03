import React from 'react';
import { View } from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import { Constants } from '../universal/Expo';
import Button from '../components/Button';
import Header from '../components/Header';
import { BAR_HEIGHT } from '../components/styles';
import Colors from '../constants/Colors';
import AccountUnderReviewScreen from '../screens/AccountUnderReviewScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ChatScreen from '../screens/ChatScreen';
import CommunicationsScreen from '../screens/CommunicationsScreen';
// import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignInScreen from '../screens/SignInScreen';
import Settings from '../constants/Settings';

// import CameraScreen from '../screens/CameraScreen';
// import DevTeamScreen from '../screens/DevTeamScreen';
// import ReportScreen from '../screens/ReportScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import UnderAgeScreen from '../screens/UnderAgeScreen';
// import WebsiteScreen from '../screens/WebsiteScreen';

// const { tintColor } = Constants.manifest;
const tintColor = '#52416A';
const MainTab = createBottomTabNavigator(
  {
    MainProfile: ProfileScreen,
    Main: HomeScreen,
    Communications: CommunicationsScreen,
  },
  {
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      // tabBarButtonComponent: () => <Text>
      activeTintColor: '#e91e63',
      activeBackgroundColor: tintColor,
      inactiveBackgroundColor: tintColor,
      inactiveTintColor: tintColor,
      showIcon: true,
      labelStyle: {
        fontSize: 12,
        color: 'white',
      },
      tabStyle: {
        backgroundColor: tintColor,
      },
      style: {
        // backgroundColor: tintColor,
      },
    },
  },
);

MainTab.navigationOptions = {
  title: Settings.hideBooty ? 'Beauty' : 'Būte',
  // headerRight: (
  //   <View style={{ marginRight: 16 }}>
  //     <Button.Chat selected />
  //   </View>
  // ),
};

const AppStack = createStackNavigator(
  {
    Main: MainTab,
    AccountUnderReview: AccountUnderReviewScreen,
    Chat: ChatScreen,
    Communications: CommunicationsScreen,
    Messages: MessagesScreen,
    Profile: ProfileScreen,

    // Camera: CameraScreen,
    // DevTeam: DevTeamScreen,
    // Explore: ExploreScreen,
    // Report: ReportScreen,
    // Settings: SettingsScreen,
    // UnderAge: UnderAgeScreen,
    // Website: WebsiteScreen,
  },
  {
    cardStyle: {
      marginTop: BAR_HEIGHT - 30,
    },
    navigationOptions: {
      headerTransparent: true,
      tintColor: 'white',
      headerBackground: <Header />,
      headerTitleStyle: {
        fontFamily: 'DINPro-Regular',
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
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
