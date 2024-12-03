import React from 'react';
import styled from 'styled-components/native';
import {Header} from '../Components';
import NativeLinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import VIPStack from '../Navigation/VIPStack';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
const {height} = Dimensions.get('window');

function VIP(props) {
  const STACK = createStackNavigator();

  function VIPSTACK() {
    return (
      <STACK.Navigator
        initialRouteName="VIPStack"
        screenOptions={{gestureEnabled: false}}>
        <STACK.Screen
          name="VIPStack"
          component={VIPStack}
          options={{
            headerShown: false,
            cardStyle: {backgroundColor: 'transparent'},
          }}
        />
      </STACK.Navigator>
    );
  }
  const Body = styled.View`
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    height: 100%;
  `;

  const LinearStyle = {
    height: height,
  };
  return (
    <NativeLinearGradient
      start={{x: 0.0, y: 0.0}}
      end={{x: 1.0, y: 1.0}}
      locations={[0, 1]}
      colors={['#010A50', '#000006']}
      style={LinearStyle}>
      <Header getHeader {...props} />
      <Body>
        <NavigationContainer>{VIPSTACK}</NavigationContainer>
      </Body>
    </NativeLinearGradient>
  );
}

export default VIP;
