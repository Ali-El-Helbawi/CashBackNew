import React from 'react';
import {ImageBackground, Text} from 'react-native';
import styled from 'styled-components/native';
import Logo from '../assets/logo.svg';
import {Font, Translate, EnglishFont} from '../Helpers';
import DeviceInfo from 'react-native-device-info';
import {Image, View, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  BackgroundBlue,
  BackgroundColor,
  DefaultBackgroundColor,
} from '../assets/colors';
const {width, height} = Dimensions.get('window');

// const Text = styled.Text`
//   flex: 1;
//   text-align: left;
//   color: black;
//   ${props => `font-family: ${props.english ? EnglishFont : Font}`};
// `;

function Info(props) {
  return (
    <View
      style={{
        backgroundColor: DefaultBackgroundColor,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          minHeight: `100%`,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ImageBackground
          //  source={require('../../assets/BackgroundColor.png')}
          resizeMode="cover"
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            alignItems: 'center',
            backgroundColor: DefaultBackgroundColor,
          }}>
          <View
            style={{
              marginTop: 0,
              zIndex: 99999,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 0,
              zIndex: 99999,
              justifyContent: 'center',
              alignItems: 'center',
              width: width,
            }}>
            <FastImage
              style={{
                width: width * 0.9,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                height: 250,
              }}
              resizeMode={FastImage.resizeMode.contain}
              source={require('../../assets/Logo_@2.png')}
            />
          </View>

          {/* <LogoContainer>
          <Logo width={233} height={73} />
        </LogoContainer> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: width,
              justifyContent: 'center',
              alignItems: 'center',

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontFamily: Font,
                marginHorizontal: 20,
              }}>
              {Translate('App Version')}:
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: EnglishFont,
                marginHorizontal: 20,
              }}>
              {DeviceInfo.getVersion()}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

export default Info;
