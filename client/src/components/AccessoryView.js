import React from 'react';
import { Image, Linking, MapView, Platform, StyleSheet, TouchableOpacity } from 'react-native';

import Lightbox from './Lightbox';

export default class AccessoryView extends React.Component {
  static defaultProps = {
    currentMessage: {},
    containerStyle: {},
    mapViewStyle: {},
    imageViewStyle: {},
  };

  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };

    if (this.props.currentMessage.imageUrl) {
      // getDownloadURLforImage(this.props.currentMessage.imageUrl).then((url) => {
      //   console.log('DONWLOAD', url);
      //   this.setState({image: url});
      // }).catch((error) => {
      //   console.error('DONWLOAD', error);
      // });
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  loadData() {}

  render() {
    if (this.props.currentMessage.location) {
      return (
        <TouchableOpacity
          style={[this.props.containerStyle]}
          onPress={() => {
            const url = Platform.select({
              ios: `http://maps.apple.com/?ll=${this.props.currentMessage.location.latitude},${
                this.props.currentMessage.location.longitude
              }`,
              android: `http://maps.google.com/?q=${this.props.currentMessage.location.latitude},${
                this.props.currentMessage.location.longitude
              }`,
            });
            Linking.canOpenURL(url)
              .then((supported) => {
                if (supported) {
                  return Linking.openURL(url);
                }
              })
              .catch((err) => {
                console.error('An error occurred', err);
              });
          }}
        >
          <MapView
            style={[styles.mapView, this.props.mapViewStyle]}
            region={{
              latitude: this.props.currentMessage.location.latitude,
              longitude: this.props.currentMessage.location.longitude,
            }}
            annotations={[
              {
                latitude: this.props.currentMessage.location.latitude,
                longitude: this.props.currentMessage.location.longitude,
              },
            ]}
            scrollEnabled={false}
            zoomEnabled={false}
          />
        </TouchableOpacity>
      );
    } else if (this.props.currentMessage.imageUrl) {
      const renderImage = () => {
        console.log('Image is ', this.state.image);
        if (this.state.image) {
          console.log('Web', this.state.image);
          return <Image source={{ uri: this.state.image }} style={[styles.imageView, this.props.imageViewStyle]} />;
        }
        return null;
        // return (<Image source={require('../img/profile_default.png')} style={[styles.imageView, this.props.imageViewStyle]} />);
      };

      return (
        <TouchableOpacity
          style={[this.props.containerStyle, { overflow: 'hidden' }]}
          onPress={() => {
            // const url = Platform.select({
            //   ios: `http://maps.apple.com/?ll=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`,
            //   android: `http://maps.google.com/?q=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`
            // });
            // Linking.canOpenURL(url).then(supported => {
            //   if (supported) {
            //     return Linking.openURL(url);
            //   }
            // }).catch(err => {
            //   console.error('An error occurred', err);
            // });
          }}
        >
          <Lightbox
            style={{ borderRadius: 13 }}
            borderRadius={13}
            backgroundColor="red"
            underlayColor="transparent"
            activeProps={{ flex: 1 }}
          >
            {renderImage()}
          </Lightbox>
        </TouchableOpacity>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#f7f7f7', // f7f7f7
  },
  imageView: {
    minWidth: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});
