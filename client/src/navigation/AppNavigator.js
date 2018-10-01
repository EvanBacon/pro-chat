import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

import AccountUnderReviewScreen from '../screens/AccountUnderReviewScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import CameraScreen from '../screens/CameraScreen';
import ChatScreen from '../screens/ChatScreen';
import CommunicationsScreen from '../screens/CommunicationsScreen';
import DevTeamScreen from '../screens/DevTeamScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportScreen from '../screens/ReportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SignInScreen from '../screens/SignInScreen';
import UnderAgeScreen from '../screens/UnderAgeScreen';
import WebsiteScreen from '../screens/WebsiteScreen';

const MainTab = createBottomTabNavigator({
  MainProfile: ProfileScreen,
  Main: HomeScreen,
  Communications: CommunicationsScreen,
});

const AppStack = createStackNavigator({
  Main: MainTab,
  AccountUnderReview: AccountUnderReviewScreen,
  Camera: CameraScreen,
  Chat: ChatScreen,
  Communications: CommunicationsScreen,
  DevTeam: DevTeamScreen,
  Explore: ExploreScreen,
  Messages: MessagesScreen,
  Profile: ProfileScreen,
  Report: ReportScreen,
  Settings: SettingsScreen,
  UnderAge: UnderAgeScreen,
  Website: WebsiteScreen,
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
