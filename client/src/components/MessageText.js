import { Font } from 'expo';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Communications from 'react-native-communications';
import ParsedText from 'react-native-parsed-text';

export default class MessageText extends React.Component {
  onUrlPress = (url) => {
    Linking.openURL(url);
  };

  onPhonePress = (phone) => {
    const options = ['Text', 'Call', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Communications.phonecall(phone, true);
            break;
          case 1:
            Communications.text(phone);
            break;
          default:
            break;
        }
      },
    );
  };

  onEmailPress = (email) => {
    Communications.email(email, null, null, null, null);
  };

  render() {
    const style = [
      styles[this.props.position].link,
      this.props.linkStyle[this.props.position],
    ];
    return (
      <View
        style={[
          styles[this.props.position].container,
          this.props.containerStyle[this.props.position],
        ]}
      >
        <ParsedText
          style={[
            styles[this.props.position].text,
            this.props.textStyle[this.props.position],
            // { fontWeight: 'DINPro-medium' },
          ]}
          parse={[
            {
              type: 'url',
              style,
              onPress: this.onUrlPress,
            },
            {
              type: 'phone',
              style,
              onPress: this.onPhonePress,
            },
            {
              type: 'email',
              style,
              onPress: this.onEmailPress,
            },
          ]}
        >
          {this.props.currentMessage.text}
        </ParsedText>
      </View>
    );
  }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

MessageText.contextTypes = {
  // actionSheet: React.PropTypes.func,
};

MessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
};

MessageText.propTypes = {
  // position: React.PropTypes.oneOf(['left', 'right']),
  // currentMessage: React.PropTypes.object,
  // containerStyle: React.PropTypes.shape({
  //   left: ViewPropTypes.style,
  //   right: ViewPropTypes.style,
  // }),
  // textStyle: React.PropTypes.shape({
  //   left: Text.propTypes.style,
  //   right: Text.propTypes.style,
  // }),
  // linkStyle: React.PropTypes.shape({
  //   left: Text.propTypes.style,
  //   right: Text.propTypes.style,
  // }),
};
