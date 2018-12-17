import { dispatch } from '../rematch/dispatch';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { connect } from 'react-redux';

import AvatarImage from './Image/AvatarImage';
import Meta from './Meta';
import IdManager from '../IdManager';
import Colors from '../constants/Colors';

export default class SliderCell extends React.PureComponent {
  onPress = () => this.props.onPressItem(this.props.uid);

  render() {
    const { itemWidth, about, rating, name, image } = this.props;

    const style = {
      width: itemWidth,
      marginTop: 36,
    };

    const styles = {
      image: {
        // backgroundColor: 'white',
        // overflow: 'hidden',
        width: itemWidth,
        height: itemWidth,
        borderRadius: itemWidth / 2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.lightGrayishBlue,
        shadowColor: 'rgba(114, 45, 250, 0.2)',
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
      },
    };
    return (
      <View style={style}>
        <View
          style={{
            width: itemWidth,
            aspectRatio: 1,
          }}
        >
          <AvatarImage
            name={name || 'Baby'}
            avatar={image}
            onPress={this.onPress}
            avatarStyle={styles.image}
          />
        </View>
        <Meta
          color={Colors.white}
          title={name}
          subtitle={about}
          rating={rating}
        />
      </View>
    );
  }
}
