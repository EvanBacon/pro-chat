import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import NavigationService from '../../navigation/NavigationService';
import Meta from '../../constants/Meta';
import Relationship from '../../models/Relationship';
import { dispatch } from '../../rematch/dispatch';
import firebase from 'expo-firebase-app';
@connectActionSheet
class ChatOptions extends React.PureComponent {
  render() {
    const {
      onPress,
      showActionSheetWithOptions,
      uid,
      style,
      ...props
    } = this.props;
    return (
      <TouchableOpacity
        style={style}
        onPress={() => {
          showActionSheetWithOptions(
            {
              options: [
                'Report User',
                'Block User',
                Meta.select_image_option_destructive,
              ],
              cancelButtonIndex: 2,
            },
            buttonIndex => {
              switch (buttonIndex) {
                case 0:
                  {
                    // const { option, input } = this.state;
                    // if (!this.validInput) {
                    //   return;
                    // }
                    const report = {
                      target_uid: uid,
                      type: 'none',
                      //   report: input,
                      timestamp: new Date().getTime(),
                    };

                    firebase
                      .database()
                      .ref(`reports/${firebase.auth().currentUser.uid}`)
                      .push(report);
                    firebase.analytics().logEvent('reported_user', report);
                    this.props.navigation.goBack();

                    //   NavigationService.navigateToUserSpecificScreen(
                    //     'ReportUser',
                    //     uid,
                    //   );
                  }
                  break;
                case 1:
                  dispatch.relationships.updateAsync({
                    uid,
                    type: Relationship.blocking,
                  });
                  this.props.navigation.goBack();

                  //   NavigationService.navigateToUserSpecificScreen(
                  //     'BlockUser',
                  //     uid,
                  //   );
                  break;
                default:
                  break;
              }
            },
          );
        }}
      >
        <MaterialIcons
          style={{ backgroundColor: 'transparent' }}
          name="more"
          color="white"
          size={24}
        />
      </TouchableOpacity>
    );
  }
}

export default ChatOptions;
