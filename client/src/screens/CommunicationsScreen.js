import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Text } from 'react-native';
import MatchesList from '../components/MatchesList';
import MessageList from '../components/MessageList';
import Colors from '../constants/Colors';
import Meta from '../constants/Meta';

const Tab = createMaterialTopTabNavigator(
  {
    Messages: MessageList,
    Matches: MatchesList,
  },
  {
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
    tabBarPosition: 'bottom',
    // Disable animation so that iOS/Android have same behaviors
    animationEnabled: true,
    // Don't show the labels
    tabBarOptions: {
      showLabel: false,
    },
  },
);

export default Tab;
