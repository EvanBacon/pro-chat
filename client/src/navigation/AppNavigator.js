import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import { View } from 'react-native';
import Header from '../components/Header';
import AccountUnderReviewScreen from '../screens/AccountUnderReviewScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
// import CameraScreen from '../screens/CameraScreen';
import ChatScreen from '../screens/ChatScreen';
import CommunicationsScreen from '../screens/CommunicationsScreen';
// import DevTeamScreen from '../screens/DevTeamScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
// import ReportScreen from '../screens/ReportScreen';
// import SettingsScreen from '../screens/SettingsScreen';
import SignInScreen from '../screens/SignInScreen';
import { BAR_HEIGHT } from '../components/styles';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import HeaderButtons from 'react-navigation-header-buttons';
import Button from '../components/Button';
// import UnderAgeScreen from '../screens/UnderAgeScreen';
// import WebsiteScreen from '../screens/WebsiteScreen';

const MainTab = createBottomTabNavigator({
  MainProfile: ProfileScreen,
  Main: HomeScreen,
  Communications: CommunicationsScreen,
});

MainTab.navigationOptions = {
  title: 'Būte',
  headerRight: (
    <View style={{ marginRight: 16 }}>
      <Button.Chat selected />
    </View>
  ),
};

//   <HeaderButtons.Item
//     title="add"
//     iconName="md-add"
//     onPress={async () => {
//     }}
//   />

const AppStack = createStackNavigator({
  Main: MainTab,
  AccountUnderReview: AccountUnderReviewScreen,
  // Camera: CameraScreen,
  Chat: ChatScreen,
  Communications: CommunicationsScreen,
  // DevTeam: DevTeamScreen,
  Explore: ExploreScreen,
  Messages: MessagesScreen,
  Profile: ProfileScreen,
  // Report: ReportScreen,
  // Settings: SettingsScreen,
  // UnderAge: UnderAgeScreen,
  // Website: WebsiteScreen,
}, {
  cardStyle: {
    marginTop: BAR_HEIGHT - 30,
  },
  navigationOptions: {
    headerTransparent: true,
    headerBackground: <Header />,
    headerTitleStyle: {
      fontFamily: 'DINPro-Regular',
      fontSize: 20,
      color: Colors.white,
    },
  },

  // navigationOptions: ({ navigation }) => ({ headerBackground: <Header /> }),

});

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
