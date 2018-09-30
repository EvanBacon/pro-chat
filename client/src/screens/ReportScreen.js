// @flow
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import ReportList from '../components/ReportList';
import Offenses from '../constants/Offenses';
import Fire from '../ExpoParty/Fire';

export default class ReportScreen extends React.Component {
  static navigationOptions = {
    title: 'Report',
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  _onPressItem = ({ name }) => {
    const { uid } = this.props.navigation.state.params;
    Fire.shared.submitComplaint(uid, name);
    this.props.navigation.goBack();
    alert('This user will be investigated with surgical precision.');
  };

  render() {
    const { name } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <MaterialIcons size={36} color="#34495e" name="security" />
          <Text style={styles.header}>Report {name}</Text>
        </View>
        <ReportList data={Offenses} onPress={this._onPressItem} title={`What did ${name} do to you?`} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    margin: 24,
    marginLeft: 16,
  },
  header: {
    marginLeft: 12,
    marginTop: 4,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
