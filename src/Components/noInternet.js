import React from 'react';
import LottieView from 'lottie-react-native';

const Loading = props => {
  const {width} = props;
  return (
    <LottieView
      source={require('../assets/animations/internet.json')}
      autoPlay
      loop
      width={width || 200}
    />
  );
};

export default Loading;
