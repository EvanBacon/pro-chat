import { dispatch } from '@rematch/core';
import React from 'react';
import { View } from 'react-native';

import EmptyListMessage from '../components/EmptyListMessage';
import Gradient from '../components/Gradient';
import Meta from '../constants/Meta';
import Images from '../Images';

class UnderAgeReview extends React.Component {
  render() {
    return (
      <Gradient style={{ justifyContent: 'flex-end' }}>
        <View style={{ height: '75%' }}>
          <EmptyListMessage
            color="white"
            onPress={dispatch.user.signOut}
            buttonTitle={Meta.underage_action}
            image={Images.empty.users}
            title={Meta.underage_title}
            subtitle={Meta.underage_subtitle}
          />
        </View>
      </Gradient>
    );
  }
}

export default UnderAgeReview;
