import { dispatch } from '@rematch/core';
import React from 'react';

import BrowseUsers from '../components/BrowseUsers';
import Gradient from '../components/Gradient';
import Relationship from '../models/Relationship';

class Team extends React.Component {
  static navigationOptions = { title: 'The Team' };
  render() {
    return (
      <Gradient style={{ flex: 1 }}>
        <BrowseUsers
          onLike={uid =>
            dispatch.relationships.updateAsync({ uid, type: Relationship.like })
          }
          onDislike={uid =>
            dispatch.relationships.updateAsync({
              uid,
              type: Relationship.dislike,
            })
          }
          onIndexChange={() => {}}
          users={[
            'PWy2WOA1nFNc8vwMBDYeFmJIKoT2',
            'gpZaGFQN1Fgh2uEHuRKb0IY7k8Y2',
          ]}
        />
      </Gradient>
    );
  }
}

export default Team;
