import React from 'react';
import LottieView from 'lottie-react-native';

const Loading = props => {
  const {width, height} = props;
  return (
    <LottieView
      source={require('../assets/animations/emptyData.json')}
      autoPlay
      loop
      width={width || 200}
      height={height || 200}
      resizeMode="cover"
    />
  );
};

export default Loading;
