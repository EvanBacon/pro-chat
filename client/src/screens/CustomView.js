import { MapView } from 'expo';
import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LoadingImage from '../components/Image/ProgressImage';
import Fire from '../Fire';

export default class CustomView extends React.Component {
  static defaultProps = {
    currentMessage: {},
    containerStyle: { backgroundColor: 'orange' },
    mapViewStyle: {},
    imageViewStyle: {},
  };
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      lightboxOpened: false,
    };
  }
  async componentWillMount() {
    if (this.props.currentMessage.imageUrl) {
      // const image = await ImageProvider.getDownloadURLforAsset(this.props.currentMessage.imageUrl);
      // this.setState({ image });
    }
    // LinkPreview.getPreview(this.props.currentMessage.text).then(data => this.setState({ linkData: data })).catch(error => console.warn(error));
  }
  shouldComponentUpdate() {
    return true;
  }

  loadData() {}

  renderImage = image => {
    const renderImage = () => {
      if (image) {
        // resizeMode={FastImage.resizeMode.cover}
        return (
          <LoadingImage
            source={image}
            style={[
              styles.imageView,
              this.props.imageViewStyle,
              { borderRadius: this.state.lightboxOpened ? 0 : 13 },
            ]}
          />
        );
      }
      return (
        <Image
          source={require('../assets/icons/expo.png')}
          style={[styles.imageView, this.props.imageViewStyle]}
        />
      );
      // return <View />;
    };
    return (
      <Lightbox
        borderRadius={13}
        style={{ borderRadius: 13 }}
        onOpen={() => {
          this.setState({ lightboxOpened: true });
        }}
        onClose={() => {
          this.setState({ lightboxOpened: false });
        }}
        backgroundColor="black"
        underlayColor="transparent"
        activeProps={{ flex: 1 }}
      >
        {renderImage()}
      </Lightbox>
    );
  };
  render() {
    const isUser = this.props.currentMessage.from == Fire.shared.uid;
    if (this.props.currentMessage.location) {
      const { latitude, longitude } = this.props.currentMessage.location;
      // const delta = 0.05;
      // const region = new MapView.AnimatedRegion({
      //   latitude,
      //   longitude,
      //   latitudeDelta: 0.0922,
      //   longitudeDelta: 0.0421,
      // });
      //  const region = new MapView.AnimatedRegion();
      // region={region}
      //  region={{
      //         latitude: latitude || 0,
      //         longitude: longitude || 0,
      //         latitudeDelta: 0.0922,
      //         longitudeDelta: 0.0421,
      //       }}
      return (
        <TouchableOpacity
          style={this.props.containerStyle}
          onPress={() => {
            const url = Platform.select({
              ios: `http://maps.apple.com/?ll=${
                this.props.currentMessage.location.latitude
              },${this.props.currentMessage.location.longitude}`,
              android: `http://maps.google.com/?q=${
                this.props.currentMessage.location.latitude
              },${this.props.currentMessage.location.longitude}`,
            });
            Linking.canOpenURL(url)
              .then(supported => {
                if (supported) {
                  return Linking.openURL(url);
                }
              })
              .catch(err => {
                console.error('An error occurred', err);
              });
          }}
        >
          <MapView
            style={[styles.mapView, this.props.mapViewStyle]}
            scrollEnabled={false}
            zoomEnabled={false}
            pointerEvents="none"
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <MapView.Marker
              pinColor="#fff"
              coordinate={this.props.currentMessage.location}
              title=""
              description=""
            />
          </MapView>
        </TouchableOpacity>
      );
    } else if (this.props.currentMessage.imageUrl) {
      return this.renderImage(this.state.image);
    }
    if (this.props.currentMessage.link) {
      const {
        images,
        url,
        description,
        mediaType,
        videos,
      } = this.props.currentMessage.link;
      if (images.length > 0) {
        let uri = images[0];
        if (typeof images[0] !== 'string' && images[0].uri) {
          uri = images[0].uri;
        }
        return (
          <TouchableOpacity
            style={{ backgroundColor: 'transparent' }}
            onPress={() => {
              Linking.canOpenURL(url)
                .then(supported => {
                  if (supported) {
                    return Linking.openURL(url);
                  }
                })
                .catch(err => {
                  console.error('An error occurred', err);
                });
            }}
          >
            <LoadingImage
              source={{ uri }}
              style={[
                styles.imageView,
                this.props.imageViewStyle,
                {
                  borderRadius: this.state.lightboxOpened ? 0 : 13,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              ]}
            />
            <Text
              style={{
                color: isUser ? 'white' : 'black',
                fontSize: 12,
                padding: 8,
              }}
            >
              {description}
            </Text>
          </TouchableOpacity>
        );
      }
      return null;
      // <Image />
    }
    return null;
  }
}

const styles = StyleSheet.create({
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    margin: 0,
    // marginBottom: 3
  },
  imageView: {
    minWidth: 150,
    height: 100,
    borderRadius: 13,
    margin: 0,
  },
});
