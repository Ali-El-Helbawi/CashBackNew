import React from 'react';
import LottieView from 'lottie-react-native';

const Lock = props => {
  const {backgroundColor} = props;
  return (
    <LottieView
      source={require('../assets/animations/lock.json')}
      autoPlay
      loop
      width="100%"
      style={[
        props.extraStyle,
        backgroundColor ? {backgroundColor, zIndex: 99999999} : {},
      ]}
    />
  );
};

export default Lock;
