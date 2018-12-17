import React from 'react';
import {
  Alert, Linking, StyleSheet, Text,
} from 'react-native';

import Meta from '../constants/Meta';
import firebase from '../universal/firebase';
import Links from '../constants/Links';

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
  const url = Links.privacy
  firebase.analytics().logEvent('opened_privacy');
  try {
    openUrlAsync(Links.privacy)
  } catch (error) {
    Alert.alert(Meta.privacy_policy_error);
  }
}

async function openTermsOfServiceAsync() {
  firebase.analytics().logEvent('opened_terms');
  try {
    openUrlAsync(Links.terms)
  } catch (error) {
    Alert.alert(Meta.terms_of_service_error);
  }
}

async function openUrlAsync(url) {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
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
