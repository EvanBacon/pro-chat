import React from 'react';
import {
  Alert, Linking, StyleSheet, Text,
} from 'react-native';

import Meta from '../constants/Meta';
import firebase from '../universal/firebase';

export default class EULA extends React.PureComponent {
  render() {
    const { style } = this.props;

    return (
      <Text style={[style, styles.text]}>
        {Meta.eula_statement}
        <Text onPress={openTermsOfServiceAsync} style={styles.subtext}>
          {Meta.terms_of_service}
        </Text>
        {Meta.and_our}
        <Text onPress={openPrivacyAsync} style={styles.subtext}>
          {Meta.privacy_policy}
        </Text>
        .
      </Text>
    );
  }
}

async function openPrivacyAsync() {
  const url = 'http://bootyalert.net/privacy'; // / <- Refactor this if its not EULA dont link it to there
  firebase.analytics().logEvent('opened_privacy');
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert(Meta.privacy_policy_error);
  }
}

async function openTermsOfServiceAsync() {
  const url = 'http://bootyalert.net/terms'; // / <- Refactor this if its not EULA dont link it to there
  firebase.analytics().logEvent('opened_terms');
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch ({ message }) {
    Alert.alert(message);
  }
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'transparent',
    fontSize: 12,
    textAlign: 'center',
    color: '#ddd',
  },
  subtext: {
    color: 'white',
    fontSize: 13,
  },
});
