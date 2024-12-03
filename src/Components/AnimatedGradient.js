import React, {Component} from 'react';
import {Animated, Easing} from 'react-native';
import NativeLinearGradient from 'react-native-linear-gradient';
import {BlueColor, SecondBlue} from '../assets/colors';

// const {height, width} = Dimensions.get('window');

class LinearGradient extends Component {
  render() {
    const {color0, color1, children, points, style} = this.props;
    const gStart = points.start;
    const gEnd = points.end;
    return (
      <NativeLinearGradient
        colors={[color0, color1]}
        start={gStart}
        end={gEnd}
        style={style}>
        {children}
      </NativeLinearGradient>
    );
  }
}
Animated.LinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const presetColors = {
  instagram: [
    'rgb(106, 57, 171)',
    'rgb(151, 52, 160)',
    'rgb(197, 57, 92)',
    'rgb(231, 166, 73)',
    'rgb(181, 70, 92)',
  ],
  firefox: [
    'rgb(236, 190, 55)',
    'rgb(215, 110, 51)',
    'rgb(181, 63, 49)',
    'rgb(192, 71, 45)',
  ],
  sunrise: [
    'rgb(92, 160, 186)',
    'rgb(106, 166, 186)',
    'rgb(142, 191, 186)',
    'rgb(172, 211, 186)',
    'rgb(239, 235, 186)',
    'rgb(212, 222, 206)',
    'rgb(187, 216, 200)',
    'rgb(152, 197, 190)',
    'rgb(100, 173, 186)',
  ],
  // A2B: [
  //   BlueColor,
  //   '#154387',
  //   '#18367F',
  //   BlueColor,
  //   SecondBlue,
  //   BlueColor,
  //   '#18367F',
  //   '#154387',
  //   BlueColor,
  // ],
  A2B: [BlueColor, BlueColor, BlueColor, BlueColor, BlueColor, BlueColor],
  A2B_Transfer: [
    BlueColor,
    BlueColor,
    BlueColor,
    BlueColor,
    BlueColor,
    BlueColor,
  ],
  A2B_VIP: [
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
  ],
  A2B_BG_VIP: [
    BlueColor,
    '#154387',
    '#18367F',
    'black',
    'black',
    'black',
    '#18367F',
    '#154387',
    BlueColor,
  ],
};

class AnimatedGradient extends Component {
  static defaultProps = {
    customColors: presetColors.instagram,
    speed: 4000,
    points: {
      start: {x: 0, y: 0.4},
      end: {x: 1, y: 0.6},
    },
  };

  state = {
    color0: new Animated.Value(0),
    color1: new Animated.Value(0),
  };

  componentDidMount = () => {
    this.startAnimation();
  };

  startAnimation = () => {
    const {color0, color1} = this.state;
    const {customColors, speed} = this.props;
    [color0, color1].forEach(color => color.setValue(0));

    Animated.parallel(
      [color0, color1].map(animatedColor => {
        return Animated.timing(animatedColor, {
          toValue: customColors.length,
          duration: customColors.length * speed,
          useNativeDriver: false, // Add This line
          easing: Easing.linear,
        });
      }),
    ).start(this.startAnimation);
  };

  render() {
    const {color0, color1} = this.state;
    const {customColors, children, points, style} = this.props;
    const preferColors = [];
    // while (preferColors.length < customColors.length) {
    while (preferColors.length < 2) {
      preferColors.push(
        customColors
          .slice(preferColors.length)
          .concat(customColors.slice(0, preferColors.length + 1)),
      );
    }
    const interpolatedColors = [color0, color1].map((animatedColor, index) => {
      return animatedColor.interpolate({
        inputRange: Array.from({length: customColors.length + 1}, (v, k) => k),
        outputRange: preferColors[index],
      });
    });

    return (
      <Animated.LinearGradient
        style={[...style]}
        points={points}
        color0={interpolatedColors[0]}
        color1={interpolatedColors[1]}>
        {children}
      </Animated.LinearGradient>
    );
  }
}

export default AnimatedGradient;
