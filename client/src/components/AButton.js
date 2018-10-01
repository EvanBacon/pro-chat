import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg } from 'expo';
import { Component } from 'react';
import { Alert } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

const {
  Stop, Defs, LinearGradient, Circle,
} = Svg;

export default class AButton extends React.Component {
  renderGradient = () => (
    <Defs>
      <LinearGradient id="buttonGrad" x1="0%" y1="0%" x2="10%" y2="100%">
        <Stop offset="0" stopColor={this.props.color} stopOpacity=".5" />
        <Stop offset="1" stopColor={this.props.color} stopOpacity="1" />
      </LinearGradient>
    </Defs>
  );
  renderButton = () => {
    const stroke = 3;
    return (
      <Svg
        height={this.props.size}
        width={this.props.size}
        style={{
          shadowColor: this.props.color,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.29,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {this.renderGradient()}
        <Circle
          cx={this.props.size / 2}
          cy={this.props.size / 2}
          r={this.props.size / 2 - stroke * 2}
          stroke="url(#buttonGrad)"
          strokeWidth={stroke}
          fill="#fff"
        />
      </Svg>
    );
  };
  renderIcon = () => (
    <MaterialIcons
      name={`${this.props.icon}`}
      size={this.props.size * 0.45}
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        textAlign: 'center',
        position: 'absolute',
      }}
      color={this.state.isPressing ? this.props.activeColor : this.props.color}
    />
  );
  state = {
    isPressing: false,
  };
  render() {
    return (
      <TouchableBounce
        onPressIn={(_) => {
          this.setState({ isPressing: true });
        }}
        onPressOut={(_) => {
          this.setState({ isPressing: false });
        }}
        onPress={this.props.onPress || (() => Alert.alert(`${this.props.icon} pressed`))}
        style={{
          width: this.props.size,
          height: this.props.size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {this.renderButton()}
        {this.renderIcon()}
      </TouchableBounce>
    );
  }
}
