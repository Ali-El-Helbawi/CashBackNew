import React from 'react';
import LottieView from 'lottie-react-native';

const Loading = props => {
  const {backgroundColor} = props;
  return (
    <LottieView
      source={require('../assets/animations/loading.json')}
      autoPlay
      loop
      width="100%"
      style={[
        backgroundColor
          ? {elevation: 4, backgroundColor, zIndex: 99999999}
          : {},
      ]}
    />
  );
};

export default Loading;
