import React, {useState, useEffect} from 'react';
import {I18nManager, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {StepIndicator} from '../Components';
import {TextField, Button} from '../Components';
import Logo from '../assets/logo.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import {connect} from 'react-redux';
import {parseString} from 'react-native-xml2js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIcon from 'react-native-vector-icons/AntDesign';

import {getKeyChain, getXmlData, serverLink, Font, Translate} from '../Helpers';
import {getUniqueId} from 'react-native-device-info';
import {SecondBlue} from '../assets/colors';
const labels = ['Cart', 'Delivery Address', 'Order Summary'];

const configs = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#2F5CCA',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#2F5CCA',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#2F5CCA',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#2F5CCA',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#2F5CCA',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#2F5CCA',
};

const {width, height} = Dimensions.get('window');

const LogoContainer = styled.Text`
  position: absolute;
  top: ${height * 0.1}px;
  z-index: 99999;
  elevation: 3;
  font-family: ${Font};
  left: ${(width - 233) / 2}px;
`;

const Container = styled.View`
  background: rgba(195, 211, 212, 0.01);
`;
const ConfirmationText = styled.Text`
  font-size: 16px;
  text-align: center;
  font-weight: 900;
  font-family: ${Font};
  margin-top: 25px;
  ${props =>
    props.response === 'Confirmed' ? 'color: #00ab66;' : 'color: #ff6562;'}
`;
const Body = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    width: '100%',
    padding: 15,
    paddingTop: 30,
  },
}))`
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: 100%;
  margin-top: 200px;
  height: ${height}px;
`;

const TitleText = styled.Text`
  font-size: 18px;
  text-align: left;
  font-weight: 900;
  color: ${SecondBlue};
  text-align: left;
  font-family: ${Font};
`;
const SubtitleText = styled.Text`
  font-size: 14px;
  text-align: center;
  font-weight: 900;
  color: darkgrey;
  text-align: left;
  font-family: ${Font};
  margin-bottom: 20px;
`;
function ForgotPassword(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [IdNumber, setIdNumber] = useState('');
  const [IdNumberError, setIdNumberError] = useState('');
  const [fcmToken, setFCMToken] = useState('');
  const [newPass, SetNewPass] = useState('');
  const [newPassRep, SetNewPassRep] = useState('');
  const [OTP, setOTP] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [current, setCurrent] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [keychain, setKeychain] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@BCD:fcmToken').then(token => {
      setFCMToken(token);
    });
    console.log('use');
  }, []);

  async function changePassword() {
    const deviceID = await getUniqueId();
    setLoading(true);
    var keych = keychain;
    if (newPassRep !== newPass) {
      return setPasswordError('Password dont match');
    }
    setPasswordError('');
    if (OTP.length < 1) {
      return setOtpError('This field could not be empty');
    }
    setOtpError('');
    const date = new Date();
    const formattedDate = date.toISOString();
    const formattedDateString = moment(date)
      .utc()
      .format('MMDDYYYYHHmmss')
      .toString();
    const secCode = formattedDateString + phone;
    const securityCode = CryptoJS.AES.encrypt(secCode, `${keych}`).toString();
    const newPassEnc = CryptoJS.AES.encrypt(
      newPass,
      `${deviceID.substring(0, 6).padStart(6)}${fcmToken
        .substring(0, 6)
        .padStart(6)}${phone.substring(0, 6).padStart(6)}${keych}`,
    ).toString();
    const pinEnc = CryptoJS.AES.encrypt(
      OTP,
      `${deviceID.substring(0, 6).padStart(6)}${OTP.substring(0, 6).padStart(
        6,
      )}${phone.substring(0, 6).padStart(6)}${keych}`,
    ).toString();

    const xmls = `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <ResetUserPassword xmlns="http://tempuri.org/">
                    <Phone>${phone}</Phone>
                    <Email>${email}</Email>
                    <TransactionDate>${formattedDate}</TransactionDate>
                    <NationalID>${IdNumber}</NationalID>
                    <PinCode>${pinEnc}</PinCode>
                    <NewPassword>${newPassEnc}</NewPassword>
                    <SecurityCode>${securityCode}</SecurityCode>
                    <FCMtoken>${fcmToken}</FCMtoken>
                  </ResetUserPassword>
                </soap:Body>
              </soap:Envelope>
                    `;

    console.log(xmls);
    axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/ResetUserPassword',
        },
      })
      .then(res => {
        parseString(res.data.toString(), (err, result) => {
          if (err) {
            console.log(err);
          }
          const serverData = getXmlData(result, 'ResetUserPassword');
          if (serverData.ErrorMessage === '') {
            setLoading(false);
            setResponse(Translate('Confirmed'));
            // this.props.navigation.navigate('Login');
          } else {
            setErrorMessage(Translate(serverData.ErrorMessage));
            setLoading(false);
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  function resetPassword() {
    if (phone.length < 5) {
      return setPhoneError(Translate('Please enter a valid Phone Number'));
    }
    setPhoneError('');
    if (email.length < 1) {
      return setEmailError(Translate('Please enter a valid Email Address'));
    }
    setEmailError('');
    if (IdNumber.length < 1) {
      return setIdNumberError(
        Translate('Please enter a valid National Number'),
      );
    }
    setIdNumberError('');
    var keych = '';
    getKeyChain()
      .then(data => {
        if (data) {
          keych = data.password;
        }
      })
      .catch(Err => {
        console.log(Err);
      });
    setLoading(true);
    setTimeout(() => {
      const date = new Date();
      const formattedDate = date.toISOString();
      const formattedDateString = moment(date)
        .utc()
        .format('MMDDYYYYHHmmss')
        .toString();
      var secCode = formattedDateString + phone;
      const securityCode = CryptoJS.AES.encrypt(secCode, `${keych}`).toString();
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
                  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <ResetUserPassword xmlns="http://tempuri.org/">
                      <Phone>${phone}</Phone>
                      <Email>${email}</Email>
                      <NationalID>${IdNumber}</NationalID>
                      <PinCode></PinCode>
                      <TransactionDate>${formattedDate}</TransactionDate>
                      <NewPassword></NewPassword>
                      <SecurityCode>${securityCode}</SecurityCode>
                      <FCMtoken>${fcmToken}</FCMtoken>
                    </ResetUserPassword>
                  </soap:Body>
                  </soap:Envelope>
                  `;

      console.log(xmls);
      axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'http://tempuri.org/ResetUserPassword',
          },
        })
        .then(res => {
          parseString(res.data.toString(), (_err, result) => {
            const serverData = getXmlData(result, 'ResetUserPassword');
            console.log(serverData);
            if (serverData.ErrorMessage === '') {
              setLoading(false);
              setCurrent(1);
              setKeychain(keych);
            } else {
              setError(Translate('User not found.'));
            }
          });
        })
        .catch(err => {
          console.error(err);
        });
    }, 1000);
  }

  return (
    <KeyboardAwareScrollView>
      <Container>
        <LogoContainer>
          <Logo width={233} height={73} />
        </LogoContainer>
        <Body>
          <StepIndicator
            configs={configs}
            current={current}
            labels={labels}
            count={2}
            reversed={I18nManager.isRTL}
          />
          <TitleText>{Translate('Reset Password')}:</TitleText>
          {current === 0 && (
            <>
              <SubtitleText>
                {Translate(
                  'Please enter mobile number, email and national ID number',
                )}
              </SubtitleText>
              <TextField
                onChangeText={text => setPhone(text)}
                keyboardType="phone-pad"
                label={Translate('Mobile Number')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                error={error || phoneError}
                icon={() => <AIcon name="mobile1" size={18} color="#2F5CCA" />}
              />
              <TextField
                onChangeText={text => setEmail(text)}
                keyboardType="default"
                label={Translate('Email Address')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                error={emailError}
                icon={() => <AIcon name="mail" size={18} color="#2F5CCA" />}
              />
              <TextField
                onChangeText={text => setIdNumber(text)}
                keyboardType="default"
                label={Translate('National Number')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                error={IdNumberError}
                icon={() => <AIcon name="idcard" size={18} color="#2F5CCA" />}
              />
              <Button
                onPress={() => {
                  resetPassword();
                }}
                disabled={loading}
                title={Translate('Next')}
              />
            </>
          )}
          {current === 1 && (
            <>
              <SubtitleText>
                {Translate(
                  'Pin Code has been sent to your mobile, please enter pin number and new password',
                )}
              </SubtitleText>
              <TextField
                onChangeText={text => setOTP(text)}
                keyboardType="phone-pad"
                label={Translate('Pin Code')}
                error={otpError}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                icon={() => <AIcon name="mobile1" size={18} color="#2F5CCA" />}
              />
              <TextField
                onChangeText={text => SetNewPass(text)}
                keyboardType="default"
                label={Translate('Password')}
                error={passwordError}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                secureTextEntry
                icon={() => <AIcon name="lock1" size={18} color="#2F5CCA" />}
              />
              <TextField
                onChangeText={text => SetNewPassRep(text)}
                keyboardType="default"
                label={Translate('Retype Password')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                secureTextEntry
                error={passwordError}
                icon={() => <AIcon name="lock1" size={18} color="#2F5CCA" />}
              />
              <ConfirmationText response={response}>
                {Translate(response)}
              </ConfirmationText>
              <Button
                onPress={() =>
                  response === ''
                    ? changePassword()
                    : props.navigation.navigate('Login')
                }
                disabled={loading}
                title={Translate(response === '' ? 'Submit' : 'Quit')}
              />
            </>
          )}
        </Body>
      </Container>
    </KeyboardAwareScrollView>
  );
}

const mapStateToProps = state => ({
  user: state.user,
  userInfo: state.userInfo,
  accounts: state.accounts,
  defaultAccount: state.defaultAccount,
  token: state.token,
});

export default connect(mapStateToProps)(ForgotPassword);
