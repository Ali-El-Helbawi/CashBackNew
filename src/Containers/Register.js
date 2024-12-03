import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  Dimensions,
  Platform,
  I18nManager,
  ImageBackground,
  Image,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import AIcon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BoxShadow} from 'react-native-shadow';
import {parseString} from 'react-native-xml2js';
import axios from 'axios';
import RNRestart from 'react-native-restart'; // Import package from node modules
import SplashScreen from 'react-native-splash-screen';
import FastImage from 'react-native-fast-image';
import FIcon from 'react-native-vector-icons/FontAwesome';

import Logo from '../assets/logo.svg';
import Background from '../assets/bg.svg';
import {TextField, Button} from '../Components';
import Terms from '../assets/terms';
import {getXmlData, serverLink, Font, Translate} from '../Helpers';
import {getUniqueId} from 'react-native-device-info';
const {width, height} = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const Container = styled.ScrollView``;

const Body = styled.View`
  background-color: white;
  width: 100%;
  height: ${isIOS ? height : height - StatusBar.currentHeight}px;
  position: relative;
  justify-content: space-around;
`;

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  position: absolute;
  width: 100%;
  bottom: 0;
`;

const LoginContainer = styled.View`
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  height: 250px;
  width: 100%;
  padding: 20px;
  padding-top: 40px;
`;

const OtherActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const OtherAction = styled.TouchableOpacity`
  padding: 10px;
`;
const OtherActionText = styled.Text`
  text-decoration: underline;
  font-family: ${Font};
  color: black;
`;

const BGContainer = styled.View`
  width: ${width}px;
  ${I18nManager.isRTL ? `right: ${360}` : `left: ${-70}`}px;
  max-height: 200px;
`;

const LogoContainer = styled.Text`
  position: absolute;
  top: ${height * 0.1}px;
  z-index: 99999;
  elevation: 3;
  left: ${(width - 233) / 2}px;
`;

const ModalBody = styled.View`
  background: white;
  height: ${height - 100}px;
  padding: 10px;
`;
const ModalTitle = styled.Text`
  font-size: 16px;
  text-align: center;
  font-weight: 900;
  font-family: ${Font};
`;
const AgreementContent = styled.ScrollView``;
const AgreementText = styled.Text`
  color: black;
`;
const AcceptBtn = styled.TouchableOpacity`
  padding: 10px;
  background: #2f5cca;
  align-items: center;
  justify-content: center;
`;
const AcceptBtnTitle = styled.Text`
  font-family: ${Font};
  color: white;
  font-size: 16px;
  line-height: 16px;
`;
const additionalStyle = {shadow: {width: width}, ButtonText: {fontSize: 16}};

const ChangeLanguageBtn = styled.TouchableOpacity`
  position: absolute;
  top: ${30}px;
  z-index: 1;
  elevation: 1;
  right: ${10}px;
  background: #12307e;
  border-radius: 50px;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
`;

const shadowOpt = {
  width: width,
  height: 250,
  color: '#000000',
  border: 10,
  radius: 0,
  opacity: 0.05,
  x: 0,
  y: -5,
  style: {marginVertical: 0},
};

const RegisterScreen = props => {
  useEffect(() => {}, []);
  const [isOpen, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  async function regDevice() {
    setLoading(true);
    const deviceID = await getUniqueId();
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    const xmls = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <RegDevice xmlns="http://tempuri.org/">
          <Phone>${phone}</Phone>
          <Platform>${Platform.OS}</Platform>
          <DeviceID>${deviceID}</DeviceID>
          <Version>A2B_1.0.1</Version>
          <Language>${lang}</Language>
        </RegDevice>
      </soap:Body>
    </soap:Envelope>
          `;
    console.log(xmls);
    axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/RegDevice',
        },
      })
      .then(res => {
        parseString(res.data.toString(), (err, result) => {
          if (err) {
            setLoading(false);
            console.log(err);
            return;
          }
          if (result) {
            const serverData = getXmlData(result, 'RegDevice');
            console.log('serverData');
            console.log(serverData);
            if (serverData.ErrorMessage === '') {
              setLoading(false);
              setOpen(false);
              props.navigation.navigate('Verify', phone);
            } else {
              setLoading(false);
              setOpen(false);
              setErrorMessage(Translate(serverData.ErrorMessage));
            }
          } else {
            setLoading(false);
            console.log(console.error());
          }
        });
        console.log('err');
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        setErrorMessage(Translate('Something went wrong'));
      });
  }
  async function changeLanguage() {
    const language = I18nManager.isRTL ? 'false' : 'true';
    await AsyncStorage.setItem('@BCD:language', language)
      .then(async () => {
        await AsyncStorage.getItem('@BCD:language').then(lang => {
          I18nManager.forceRTL(lang === 'true');
          I18nManager.allowRTL(lang === 'true');
          SplashScreen.show();

          RNRestart.restart();
        });
      })
      .catch(errM => console.log('Error', errM.message));
  }
  return (
    <>
      <Modal animationIn="slideInUp" isVisible={isOpen}>
        <ModalBody>
          <ModalTitle>Terms & Conditions</ModalTitle>
          <AgreementContent>
            <AgreementText>{Terms}</AgreementText>
            <Button
              disabled={loading}
              onPress={regDevice}
              title={Translate('Accept Terms')}
            />
          </AgreementContent>
        </ModalBody>
      </Modal>
      <Container>
        <ChangeLanguageBtn onPress={changeLanguage}>
          <FIcon name="language" size={20} color="white" />
        </ChangeLanguageBtn>
        <Body>
          <View
            style={{
              position: 'absolute',
              top: 40,
              zIndex: 99999,
              position: 'absolute',
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
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

          <View
            style={{
              width: width,
              maxHeight: height,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              style={{
                width: width,
                height: height,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              resizeMode="cover"
              source={require('../../assets/backGroundLight.jpeg')}
            />
          </View>
          {/* <LogoContainer>
            <Logo width={233} height={73} />
          </LogoContainer>
          <BGContainer>
            <Background width={800} height={300} />
          </BGContainer> */}
          <KeyboardAvoidingView
            behavior={isIOS ? 'position' : 'padding'}
            enabled>
            <BoxShadow setting={shadowOpt}>
              <LoginContainer>
                <TextField
                  onChangeText={text => setPhone(text)}
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  keyboardType="phone-pad"
                  error={errorMessage}
                  label={Translate('Mobile Number')}
                  icon={() => (
                    <AIcon name="mobile1" size={18} color="#2F5CCA" />
                  )}
                />
                <Button
                  textStyle={additionalStyle.ButtonText}
                  onPress={() => setOpen(true)}
                  title={Translate('Verify')}
                />
                <OtherActionsContainer>
                  <OtherAction
                    onPress={() => props.navigation.navigate('CreateAccount')}>
                    <OtherActionText>
                      {Translate('Create an account')}
                    </OtherActionText>
                  </OtherAction>
                </OtherActionsContainer>
              </LoginContainer>
            </BoxShadow>
          </KeyboardAvoidingView>
        </Body>
      </Container>
    </>
  );
};

export default RegisterScreen;
