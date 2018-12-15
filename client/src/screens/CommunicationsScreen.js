import React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';

import NewMatchesCarousel from '../components/NewMatchesCarousel';
import MatchesList from '../components/MatchesList';
import MessageList from '../components/MessageList';
import Colors from '../constants/Colors';
import Meta from '../constants/Meta';
import Settings from '../constants/Settings';
import { ScrollView } from 'react-native-gesture-handler';

const tabs = {};

if (Settings.isChatEnabled) {
  tabs.Messages = MessageList;
}
if (Settings.isMatchesEnabled) {
  tabs.Matches = MatchesList;
}

const Tab = createMaterialTopTabNavigator(tabs, {
  navigationOptions: ({ navigation }) => ({
    // Set the tab bar icon
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state;
      let title;
      switch (routeName) {
        case 'Messages':
          title = Meta.messages;
          break;
        case 'Matches':
          title = Meta.matches;
          break;
        default:
          break;
      }
      return (
        <Text
          style={{
            color: focused ? Colors.tabIconSelected : Colors.tabIconDefault,
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      );
    },
  }),
  swipeEnabled: true,
  // Put tab bar on bottom of screen on both platforms
  // tabBarComponent: TabBarBottom,
  tabBarPosition: 'top',
  // Disable animation so that iOS/Android have same behaviors
  animationEnabled: true,
  // Don't show the labels
  tabBarOptions: {
    showLabel: false,
  },
});

Tab.navigationOptions = { title: 'Chat' };

let screen = Tab;

if (Object.keys(tabs).length < 2) {
  if (Settings.isChatEnabled) {
    screen = MessageList;
  }
  if (Settings.isMatchesEnabled) {
    screen = MatchesList;
  }
}

export default MessageList;
