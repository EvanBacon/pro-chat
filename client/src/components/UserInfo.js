// import { connectActionSheet } from '@expo/react-native-action-sheet';
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';

import NavigationService from '../navigation/NavigationService';
// import selectImage from '../utils/SelectImage';
// import Button from './Button';
import ProfileImage from './Image/ProfileImage';
import Meta from './Meta';

// const Edit = connectActionSheet(() => (
//   <Button.Edit
//     testID="test-profile-edit-button"
//     onPress={() => {
//       selectImage(this.props.showActionSheetWithOptions, this.props.onImage);
//     }}
//     style={this.props.style}
//   />
// ));

export default class UserInfo extends Component {
  state = {};
  componentDidMount() {}

  renderImage = (image) => {
    if (this.props.hasLightbox) {
      return <View style={{ flex: 1 }}>{image}</View>;
    }
  };
  // image;
  render() {
    const width = Dimensions.get('window').width * 0.65;
    return (
      <View
        style={[
          {
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          },
          this.props.style,
        ]}
      >
        {this.renderImage(<ProfileImage
          name={this.props.title}
          image={this.props.image}
          size={width}
          lightbox={this.props.hasLightbox}
          onImageUpdated={this.props.onImageUpdated}
          source={this.props.image}
          isUser={this.props.isUser}
          isEditing={this.state.isEditing}
        />)}
        <Meta
          onRatingPressed={this.props.onRatingPressed}
          isEditing={this.state.isEditing}
          isUser={this.props.isUser}
          title={this.props.title}
          subtitle={this.props.subtitle}
          rating={this.props.rating}
          uid={this.props.uid}
        />
      </View>
    );
  }
}
