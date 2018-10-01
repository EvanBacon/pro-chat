import { MaterialIcons } from '@expo/vector-icons';
import Expo, { Camera } from 'expo';
import React from 'react';
import { Image, InteractionManager, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import Assets from '../Assets';

import Circle from '../components/Circle';
import Button from '../components/Button';
import SnapText from '../components/ImageEditor/Label';
import Stickers from '../components/ImageEditor/Stickers';
import { changeCameraProperty } from '../redux/camera';

const Images = Assets.images;

const ButtonSize = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
});
const isDebug = false;
class CameraScreen extends React.Component {
  constructor(props) {
    super(props);

    this.camera = null;

    let image = null;

    if (!Expo.Constants.isDevice || isDebug) {
      image = { uri: 'http://www.billboard.com/files/media/Lil-Uzi-Vert-2016-billboard-1548.jpg' };
    }
    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.temp,
        type: Camera.constants.Type.front,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.off,
      },
      isRecording: false,
      // /DEBUG
      image,
      // /DEBUG
      // showEmojiPicker: true
    };
  }

    takePicture = async () => {
      if (this.state.image) {
        const complete = (((this.props.navigation || {}).state || {}).params || {}).complete || this.props.complete;


        this.setState({ showEmojiPicker: false }, (_) => {
          InteractionManager.runAfterInteractions(async (_) => {
            const image = await Expo.takeSnapshotAsync(this.snapView, {
              format: 'jpg',
              quality: 1,
              result: 'file',
            });
            complete && complete({ uri: image });

            this.props.navigation && this.props.navigation.goBack();
          });
        });
      } else if (this.camera) {
        this.camera.capture()
          .then((data) => {
            this.setState({ image: { uri: data.path } });
          })
          .catch(err => console.error(err));
      }
    }

    startRecording = () => {
      if (this.camera) {
        this.camera.capture({ mode: Camera.constants.CaptureMode.video })
          .then(data => console.log(data))
          .catch(err => console.error(err));
        this.setState({
          isRecording: true,
        });
      }
    }

    stopRecording = () => {
      if (this.camera) {
        this.camera.stopCapture();
        this.setState({
          isRecording: false,
        });
      }
    }

    switchType = () => {
      let newType;
      const { back, front } = Camera.constants.Type;

      if (this.props.camera.type === back) {
        newType = front;
      } else if (this.props.camera.type === front) {
        newType = back;
      }

      this.props.changeCameraProperty({ key: 'type', value: newType });
    }

    get typeIcon() {
      let icon;
      const { back, front } = Camera.constants.Type;

      if (this.props.camera.type === back) {
        icon = (<MaterialIcons
          name="camera-rear"
          size={24}
          color="white"
        />);
      } else if (this.props.camera.type === front) {
        icon = (<MaterialIcons
          name="camera-front"
          size={24}
          color="white"
        />);
      }

      return icon;
    }

    switchFlash = () => {
      let newFlashMode;
      const { auto, on, off } = Camera.constants.FlashMode;

      if (this.props.camera.flashMode === auto) {
        newFlashMode = on;
      } else if (this.props.camera.flashMode === on) {
        newFlashMode = off;
      } else if (this.props.camera.flashMode === off) {
        newFlashMode = auto;
      }

      this.props.changeCameraProperty({ key: 'flashMode', value: newFlashMode });
    }

    get flashIcon() {
      let icon;
      const { auto, on, off } = Camera.constants.FlashMode;

      if (this.props.camera.flashMode === auto) {
        icon = 'flash-auto';
      } else if (this.props.camera.flashMode === on) {
        icon = 'flash-on';
      } else if (this.props.camera.flashMode === off) {
        icon = 'flash-off';
      }

      return icon;
    }
    rotateImage = () => {

    }

    render() {
      const switchCameraButton = () => (
        <TouchableOpacity
          style={styles.typeButton}
          onPress={this.switchType}
        >
          {this.typeIcon}
        </TouchableOpacity>
      );
      return (
        <View style={styles.container}>
          <StatusBar
            animated
            hidden
          />

          <Header
            image={this.state.image}
            style={{}}
            back={(_) => {
                    this.props.complete && this.props.complete();

                    this.props.navigation && this.props.navigation.goBack();
                }}
            flashIcon={this.flashIcon}
            onFlash={this.switchFlash}
          />


          {!this.state.image &&
            <Camera
              ref={(cam) => {
                            this.camera = cam;
                        }}
              style={styles.preview}
              aspect={this.props.camera.aspect}
              captureTarget={this.props.camera.captureTarget}
              type={this.props.camera.type}
              flashMode={this.props.camera.flashMode}
              onFocusChanged={() => { }}
              onZoomChanged={() => { }}
              defaultTouchToFocus
              playSoundOnCapture
              mirrorImage
            /> || <Stickers ref={r => this.snapView = r} isVisible={this.state.showEmojiPicker}>
              <SnapText isVisible={this.state.showTextInput}>
                <Image source={this.state.image} style={{ flex: 1 }} />
              </SnapText>
            </Stickers>

                }
          {/* <ImageEditor style={{ flex: 1 }} source={this.state.image} /> */}

          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
            <Circle style={{
 width: '100%', marginTop: 44, backgroundColor: 'transparent', borderColor: 'white', borderWidth: StyleSheet.hairlineWidth,
}}
            />
          </View>
          <Footer
            image={this.state.image}
            rotateImage={(_) => {
                    this.setState({
                        showEmojiPicker: !this.state.showEmojiPicker,
                    });
                }}
            isRecording={this.state.isRecording}
            stopRecording={this.stopRecording}
            startRecording={this.startRecording}
            takePicture={this.takePicture}
            flipCamera={this.switchType}
          />

        </View>
      );
    }
}

export default connect(({ camera }) => ({ camera }), { changeCameraProperty })(CameraScreen);

const Footer = ({
  style, isRecording, rotateImage, image, takePicture, startRecording, stopRecording, flipCamera,
}) => (
  <View style={[styles.overlay, styles.bottomOverlay, style]}>
    <Button.FlipCamera
      style={{ opacity: 0 }}
      onPress={(_) => {
        }}
    />

    {
            !isRecording
            && <CaptureButton image={image} onPress={takePicture} />
        }
    {/* <View style={styles.buttonsSpace} />
        {
            !isRecording
            &&
            <TouchableOpacity
                style={styles.captureButton}
                onPress={startRecording}
            >
                <MaterialIcons
                    name={"videocam"}
                    size={24}
                    color={'white'}
                />

            </TouchableOpacity>
            ||
            <TouchableOpacity
                style={styles.captureButton}
                onPress={stopRecording}
            >
                <MaterialIcons
                    name={"stop"}
                    size={24}
                    color={'white'}
                />

            </TouchableOpacity>
        } */}

    {image &&
    <RotationButton style={{ height: '60%' }} onPress={rotateImage} /> ||
    <Button.FlipCamera style={{ height: '60%' }} onPress={flipCamera} />
        }
  </View>
);

const RotationButton = ({ style, onPress }) => (
  <TouchableOpacity
    style={[{}, style]}
    onPress={onPress}
  >
    <MaterialIcons
      name="tag-faces"
      size={48}
      color="white"
    />

  </TouchableOpacity>
);

const Header = ({
  back, style, flashIcon, onFlash,
}) => (
  <View style={[{
 height: 44, alignItems: 'center', backgroundColor: '#52416A', paddingTop: 0, flexDirection: 'row', justifyContent: 'space-between',
}, style]}
  >
    <Button.Close
      style={{ backgroundColor: 'transparent', width: 64 }}
      onPress={back}
    />

    <TouchableOpacity onPress={onFlash} style={{ justifyContent: 'center', width: 64, alignItems: 'center' }}>
      <MaterialIcons
        name={flashIcon}
        size={32}
        style={{ backgroundColor: 'transparent' }}
        color="white"
      />
    </TouchableOpacity>
  </View>

);

const CaptureButton = ({ onPress, image }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={{
 width: ButtonSize, aspectRatio: 1, borderRadius: ButtonSize / 2, borderWidth: image ? 0 : 2, borderColor: 'white', padding: 4, alignItems: 'stretch',
}}
    >
      <View style={{
 width: ButtonSize, aspectRatio: 1, borderRadius: ButtonSize / 2, justifyContent: 'center', alignItems: 'center', backgroundColor: image ? '#23cf5f' : '#52416A', flex: 1,
}}
      >

        {
                    image &&
                    <MaterialIcons
                      name="check"
                      size={48}
                      color="white"
                    />
                }
      </View>
    </View>
  </TouchableOpacity>
);
