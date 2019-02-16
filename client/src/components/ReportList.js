import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  LayoutAnimation,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import Section from './primitives/Section';
import Gradient from './primitives/Gradient';
import Button from './Button';
import Meta from '../constants/Meta';
import firebase from 'expo-firebase-app';

const darkColor = '#303865';
export default class ReportUser extends React.Component {
  state = {
    option: null,
    input: '',
  };
  componentWillMount() {
    // this.props.screenProps.getNavigation(this.props.navigation);
  }

  alert = (title, subtitle, buttonTitle) => {
    // Works on both iOS and Android
    Alert.alert(title, subtitle, [{ text: buttonTitle, onPress: () => {} }], {
      cancelable: false,
    });
  };

  get validInput() {
    return this.state.input && this.state.input.length !== '';
  }

  report = () => {
    const { option, input } = this.state;
    const target_uid = ((this.props.navigation.state || {}).params || {}).uid;
    if (!this.validInput) {
      return;
    }
    const report = {
      target_uid,
      type: option.key,
      report: input,
      timestamp: new Date().getTime(),
    };

    firebase
      .database()
      .ref(`reports/${firebase.uid()}`)
      .push(report);
    firebase.analytics().logEvent('reported_user', report);
    this.props.navigation.goBack();
  };

  renderHeader = () => (
    <View
      style={{
        height: 64,
        alignItems: 'center',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}
    >
      <TouchableOpacity
        style={{ justifyContent: 'center', width: 64 }}
        onPress={_ => {
          this.props.navigation.goBack();
        }}
      >
        <MaterialIcons
          name={`close`}
          size={32}
          style={{ backgroundColor: 'transparent' }}
          color={'white'}
        />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 16,
          //   fontFamily: 'DINPro-Medium',
          backgroundColor: 'transparent',
          color: 'white',
        }}
      >
        {Meta.report_user_title.toUpperCase()}
      </Text>

      <TouchableOpacity
        style={{ justifyContent: 'center', width: 64, alignItems: 'flex-end' }}
        disabled={!(this.state.option && this.validInput)}
        onPress={this.report}
      >
        <Text
          style={{
            fontSize: 16,
            // fontFamily: 'DINPro-Regular',
            opacity: !(this.state.option && this.validInput) ? 0.5 : 1,
            backgroundColor: 'transparent',
            color: 'white',
          }}
        >
          {Meta.report_user_action}
        </Text>
      </TouchableOpacity>
    </View>
  );
  render() {
    return (
      <View style={{ flex: 1 }}>
        <RadioGroup
          title={Meta.report_user_question}
          onSelect={option => this.setState({ option })}
          options={[
            {
              title: Meta.report_photo_is_not_a_booty_title,
              key: 'photo_is_not_a_booty',
              subtitle: Meta.report_photo_is_not_a_booty_subtitle,
            },
            {
              title: Meta.report_harassment_title,
              key: 'harassment',
              subtitle: Meta.report_harassment_subtitle,
            },
            {
              title: Meta.report_spam_title,
              key: 'spam',
              subtitle: Meta.report_spam_subtitle,
            },
            {
              title: Meta.report_other_title,
              key: 'other',
              subtitle: Meta.report_other_subtitle,
            },
          ]}
        />

        {this.state.option && (
          <Section
            title={this.state.option.subtitle}
            style={{ paddingHorizontal: 16, flex: 1 }}
          >
            <View style={{ flex: 1 }}>
              <TextInput
                onChangeText={input => this.setState({ input })}
                value={this.state.input}
                style={{
                  flex: 1,
                  color: 'white',
                  fontSize: 14,
                }}
                autoCorrect
                multiline={true}
                onBlur={this.onSubmit}
                editable={true}
                maxLength={500}
                selectionColor={'white'}
                placeholderTextColor={'#e7e7e7'}
                placeholder={Meta.report_user_placeholder}
              />
            </View>
          </Section>
        )}

        {((this.state.option || {}).key === 'spam' ||
          (this.state.option || {}).key === 'harassment') && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 8,
                fontFamily: 'DINPro-Light',
                backgroundColor: 'transparent',
              }}
            >
              {Meta.report_user_block_hint}
            </Text>
            <Button.Block uid={this.props.navigation.getParam('uid')} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const RBSize = 24;

class Circle extends React.Component {
  state = {};

  onLayout = event => {
    this.props.onLayout && this.props.onLayout(event);
    const {
      nativeEvent: { layout },
    } = event;
    this.setState({ ...layout });
  };

  render() {
    const { style, onLayout, ...props } = this.props;
    const { width } = this.state;
    const _style = width ? { borderRadius: width / 2 } : { opacity: 0 };
    return (
      <View
        style={StyleSheet.flatten([
          style,
          {
            aspectRatio: 1,
            overflow: 'visible',
          },
          _style,
        ])}
      >
        <View
          {...props}
          onLayout={this.onLayout}
          style={{
            flex: 1,
            ..._style,
            overflow: 'hidden',
          }}
        />
      </View>
    );
  }
}

class RadioButton extends React.Component {
  render() {
    const { title, onPress, color, selected } = this.props;

    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginVertical: 4,
        }}
        onPress={onPress}
      >
        <View
          style={{
            width: RBSize,
            aspectRatio: 1,
            alignItems: 'stretch',
            marginRight: 8,
            borderRadius: RBSize / 2,
            padding: 2,
            borderWidth: 1,
            borderColor: color,
          }}
        >
          <Circle
            style={{
              flex: 1,
              backgroundColor: color,
              transform: [{ scale: selected ? 1 : 0 }],
            }}
          />
        </View>
        {title && (
          <Text
            style={{
              color: selected ? 'white' : '#ddd',
              //   fontFamily: 'DINPro-Medium',
            }}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

class RadioGroup extends React.Component {
  state = {
    selected: null,
  };
  onPress = (option, index) => {
    this.props.onSelect(option, index);
    this.setState({ selected: index });
  };
  render() {
    const { options, onSelect, title } = this.props;

    LayoutAnimation.easeInEaseOut();

    return (
      <Section style={{ paddingHorizontal: 16, paddingTop: 16 }} title={title}>
        {options.map((val, index) => (
          <RadioButton
            {...val}
            selected={this.state.selected == index}
            key={index}
            color={'white'}
            onPress={_ => this.onPress(val, index)}
          />
        ))}
      </Section>
    );
  }
}
