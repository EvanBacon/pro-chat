import { dispatch } from '@rematch/core';
import React from 'react';
import { View } from 'react-native';

import EmptyListMessage from '../components/EmptyListMessage';
import Gradient from '../components/Gradient';
import Meta from '../constants/Meta';
import Assets from '../Assets';

const AccountUnderReview = () => (
  <Gradient style={{ justifyContent: 'flex-end' }}>
    <View style={{ height: '75%' }}>
      <EmptyListMessage
        color="white"
        onPress={dispatch.user.signOut}
        buttonTitle={Meta.log_out}
        image={Assets.images.empty.users}
        title={Meta.under_review_title}
        subtitle={Meta.under_review_subtitle}
      />
    </View>
  </Gradient>
);

export default AccountUnderReview;
