import React from 'react';

import PagedList from '../components/pagedList/PagedList';
import Fire from '../Fire';

class ExploreScreen extends React.Component {
  static navigationOptions = {
    title: 'Explore',
  };

  renderItem = ({ item, index }) => {
    const { photoURL } = item;
    const name = item.displayName || item.deviceName;
    const isSeen = false;
    const timeAgo = undefined;
    const onPress = () => {
      if (item.uid === Fire.shared.uid) {
        return;
      }
      try {
        const groupId = Fire.shared.getChatGroupId(item.uid);

        this.props.navigation.navigate('Chat', {
          groupId,
          title: displayName,
        });
      } catch ({ message }) {
        console.error(message);
      }
    };
    return <MessageRow name={name} message="ADD ME" onPress={onPress} isSeen={isSeen} photoURL={photoURL} />;
  };

  componentDidMount() {
    // this.props.navigation.navigate('Chat', {});
  }
  render() {
    return (
      <PagedList
        pageSize={5}
        style={{ flex: 1 }}
        getPagedData={async (props) => {
          const data = await Fire.shared.getUsersPaged(props);
          return data; // { data: userData, cursor: null }; //data;
        }}
        renderItem={this.renderItem}
        uid={Fire.shared.uid}
      />
    );
  }
}

export default ExploreScreen;
