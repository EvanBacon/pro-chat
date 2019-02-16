import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Alert, Text, View } from 'react-native';

import ReportList from '../components/ReportList';
// <ReportList
// data={Offenses}
// onPress={this._onPressItem}
// title={`What did ${name} do to you?`}
// />
import Offenses from '../constants/Offenses';
import Fire from '../Fire';

// import ReportUser from '../components/ReportUser';

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
    Alert.alert('This user will be investigated with surgical precision.');
  };

  // <MaterialIcons size={36} color="#34495e" name="security" />
  //         <Text style={styles.header}>Report {name}</Text>
  render() {
    // const { name } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <ReportList navigation={this.props.navigation} />
        </View>
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
