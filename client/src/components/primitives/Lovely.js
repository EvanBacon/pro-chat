import { Svg } from 'expo';
import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';

const { G, Path } = Svg;

const AnimationG = Animated.createAnimatedComponent(G);

const AnimationPath = Animated.createAnimatedComponent(Path);
export default class Lovely extends Component {
  state = { colorsIndex: 0.5, animation: new Animated.Value(0) };
  colors = ['#000fff', '#ff0000', '#ff00ff'];
  componentDidMount() {
    this.animate(1);
  }

  animate = (val) => {
    Animated.timing(this.state.animation, {
      toValue: val,
      duration: 2000,
      easing: Easing.inOut(Easing.quad),
    }).start((state) => {
      if (state.finished) {
        this.setState({
          colorsIndex: (this.state.colorsIndex + 0.5) % this.colors.length,
        });
        this.animate(val + 1);
      }
    });
  };

  componentWillUnmount() {
    // clearInterval(this._timer);
  }

  render() {
    const size = 1500;

    const scale = this.props.size / 477;
    const stroke = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1500],
    });
    return (
      <Svg width={477 * scale} height={451 * scale}>
        <G
          id="Page-1"
          stroke="none"
          scale={scale}
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <AnimationG
            id="Heart_icon_red_hollow"
            transform={{ translate: '10.000000, 10.000000' }}
            stroke={this.colors[Math.floor(this.state.colorsIndex)]}
            strokeWidth="20"
          >
            <AnimationPath
              strokeDasharray={`${size}, ${size}`}
              strokeDashoffset={stroke}
              d="M120,0 C53,0 0,54 0,120 C0,255 136,290 228,423 C316,291 457,250 457,120 C457,54 403,0 337,0 C289,0 247,28 228,69 C209,28 168,0 120,0 Z"
              id="Shape"
            />
          </AnimationG>
        </G>
      </Svg>
    );
  }
}
