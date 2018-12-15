import { dispatch } from '../rematch/dispatch';
import React from 'react';
import { View } from 'react-native';

import EmptyListMessage from '../components/EmptyListMessage';
import Gradient from '../components/Gradient';
import Meta from '../constants/Meta';
import Images from '../Images';

class UnderAgeReview extends React.Component {
  static navigationOptions = { title: 'Not Old Enough!' };

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
