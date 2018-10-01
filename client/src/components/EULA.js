import firebase from 'firebase';
import React from 'react';
import { Alert, Linking, Text } from 'react-native';

import Meta from '../constants/Meta';

export default class EULA extends React.Component {
  render() {
    const { style } = this.props;

    return (
      <Text
        style={[
          style,
          {
            backgroundColor: 'transparent',
            fontSize: 12,
            textAlign: 'center',
            color: '#ddd',
          },
        ]}
      >
        {Meta.eula_statement}
        <Text
          onPress={async () => {
            const url = 'http://bootyalert.net/terms'; // / <- Refactor this if its not EULA dont link it to there
            firebase.analytics().logEvent('opened_terms');
            const supported = await Linking.canOpenURL(url);
            if (supported) return Linking.openURL(url);
            return null;
          }}
          style={{ color: 'white', fontSize: 13 }}
        >
          {Meta.terms_of_service}
        </Text>
        {Meta.and_our}
        <Text
          onPress={() => {
            const url = 'http://bootyalert.net/privacy'; // / <- Refactor this if its not EULA dont link it to there
            firebase.analytics().logEvent('opened_privacy');
            Linking.canOpenURL(url)
              .then((supported) => {
                if (supported) {
                  return Linking.openURL(url);
                }
                return null;
              })
              .catch((err) => {
                Alert.alert(Meta.privacy_policy_error);
                console.error('An error occurred', err);
              });
          }}
          style={{ color: 'white', fontSize: 13 }}
        >
          {Meta.privacy_policy}
        </Text>
        .
      </Text>
    );
  }
}
