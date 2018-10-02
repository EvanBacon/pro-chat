import { dispatch } from '@rematch/core';
import React from 'react';

import BrowseUsers from '../components/BrowseUsers';
import Gradient from '../components/Gradient';
import Relationship from '../models/Relationship';

class Team extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Gradient style={{ flex: 1 }}>
        <BrowseUsers
          onLike={uid => dispatch.user.updateRelationshipWithUser({ uid, type: Relationship.like })}
          onDislike={uid => dispatch.user.updateRelationshipWithUser({ uid, type: Relationship.dislike })}
          onIndexChange={() => {}}
          navigation={navigation}
          users={{
            PWy2WOA1nFNc8vwMBDYeFmJIKoT2: { uid: 'PWy2WOA1nFNc8vwMBDYeFmJIKoT2' },
            gpZaGFQN1Fgh2uEHuRKb0IY7k8Y2: { uid: 'gpZaGFQN1Fgh2uEHuRKb0IY7k8Y2' },
          }}
        />
      </Gradient>
    );
  }
}

export default Team;
