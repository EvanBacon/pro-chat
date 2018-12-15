import { connectActionSheet } from '@expo/react-native-action-sheet';
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import Relationship from '../models/Relationship';
import NavigationService from '../navigation/NavigationService';
import { dispatch } from '../rematch/dispatch';
import reportUser from '../utils/reportUser';
import shareUser from '../utils/shareUser';
import AButton from './AButton';

const { width } = Dimensions.get('window');

@connectActionSheet
class Footer extends Component {
  state = {};

  componentWillMount() {
    this.updateRelationship(this.props.uid);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid !== this.props.uid) {
      this.updateRelationship(nextProps.uid);
    }
  }

  updateRelationship = async (uid) => {
    if (uid && typeof uid === 'string') {
      dispatch.relationships.getAsync({ uid });
    }
  };

  render() {
    const purple = '#703af7';
    const { relationship } = this.props;
    return (
      <View
        pointerEvents={this.props.footerVisible ? 'auto' : 'none'}
        style={[
          {
            flex: 0.35,
            opacity: this.props.footerVisible ? 1 : 0,
            alignItems: 'center',
            justifyContent: 'center',
          },
          this.props.style,
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-around',
            width: width - 40,
          }}
        >
          {!this.props.hideRevert && (
            <AButton
              size={70}
              color={purple}
              activeColor={purple}
              icon="more-horiz"
              onPress={() => reportUser({
                uid: this.props.uid,
                showActionSheetWithOptions: this.props
                  .showActionSheetWithOptions,
                reportUser: () => {
                  console.warn('rpu', this.props.uid);
                  NavigationService.navigateToUserSpecificScreen(
                    'ReportUser',
                    this.props.uid,
                  );
                },
              })
              }
            />
          )}

          <AButton
            size={90}
            color={relationship === Relationship.dislike ? '#ef1d1d' : purple}
            activeColor="#ef1d1d"
            icon="thumb-down"
            onPress={async () => {
              await this.props.onDislike();
            }}
          />
          <AButton
            size={90}
            color={relationship === Relationship.like ? '#33c4e2' : purple}
            activeColor="#33c4e2"
            icon="thumb-up"
            onPress={async () => {
              await this.props.onLike();
            }}
          />
          {!this.props.hideShuffle && (
            <AButton
              size={70}
              color={purple}
              activeColor={purple}
              icon="share"
              onPress={() => shareUser(this.props.uid)}
            />
          )}
        </View>
      </View>
    );
  }
}

const mergeProps = (state, actions, localProps) => {
  const { relationships, ...props } = state;
  const { uid } = localProps;
  const relationship = (relationships || {})[uid];

  return {
    ...props,
    ...localProps,
    ...actions,
    relationship,
    uid,
  };
};

export default connect(
  ({ relationship = {} }) => ({
    relationships: relationship.uid,
  }),
  {
    // getRelationshipWithUser,
    navigate: (routeName, params) => dispatch => dispatch(NavigationActions.navigate({ routeName, params })),
  },
  mergeProps,
)(Footer);
