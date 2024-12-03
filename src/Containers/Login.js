/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  StatusBar,
  Dimensions,
  Platform,
  I18nManager,
  Alert,
  View,
} from 'react-native';
import {Image, ImageBackground} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import styled from 'styled-components/native';
import {BoxShadow} from 'react-native-shadow';
import {TextField, Button, Loading} from '../Components';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Logo from '../assets/logo.svg';
import Background from '../assets/bg.svg';
import axios from 'axios';
import RNRestart from 'react-native-restart'; // Import package from node modules
import SplashScreen from 'react-native-splash-screen';
import {parseString} from 'react-native-xml2js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DataContext} from '../context/dataContext';
import {
  getKeyChain,
  setKeyChain,
  getXmlData,
  serverLink,
  Font,
  Translate,
  convertToAsc,
} from '../Helpers';
import CryptoJS from 'react-native-crypto-js';
import TouchID from 'react-native-touch-id';
import {connect} from 'react-redux';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {getUniqueId} from 'react-native-device-info';
import {
  IsSupported,
  GetUser,
  GetToken,
  GetTokenBM,
  GetLabels,
  ResetBMT,
} from '../actions';
import FastImage from 'react-native-fast-image';
import {getFCMToken} from '../Helpers';
const {width, height} = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
import messaging from '@react-native-firebase/messaging';
import {isEmulator} from 'react-native-device-info';
import {showMessage} from 'react-native-flash-message';
import {_UserObj} from '../Helpers/mockData';
const Body = styled.View`
  background-color: white;
  width: 100%;
  height: ${isIOS ? height : height - StatusBar.currentHeight}px;
  position: relative;
  justify-content: space-between;
`;
const Container = styled.ScrollView`
  background-color: white;
  // padding-top: 20px;
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
  height: 300px;
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
  font-size: 12px;
  text-decoration: underline;
  font-family: ${Font};
  color: black;
`;

const VerticalLine = styled.Text`
  border-width: 0.5px;
  border-color: #979797;
  height: 14.9px;
`;

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

const additionalStyle = {ButtonText: {fontSize: 16}};

const shadowOpt = {
  width: width,
  height: 300,
  color: '#000000',
  border: 10,
  radius: 0,
  opacity: 0.05,
  x: 0,
  y: -8,
  style: {marginVertical: 0},
};

function Login(props) {
  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@USER');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
    }

    console.log('Done.');
  };
  const setUser = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@USER', jsonValue);
    } catch (e) {
      // save error
    }

    console.log('Done.');
  };
  const {setIsLogin, setUserInfo, setUserAccounts, fcmToken, setFCMToken} =
    useContext(DataContext);
  useEffect(() => {
    const autoLogin = async () => {
      const _obj = await getUser();
      // const _obj = _UserObj;
      //setUser(_obj);
      console.log('_UserObj');
      console.log(_obj);
      if (_obj) {
        console.log(JSON.stringify('_obj'));
        console.log(JSON.stringify(_obj));
        const {user, serverData, Password} = _obj;

        props.onLogin(
          {user},
          serverData.TableTokenRow.Token,
          Password,
          serverData.UserSettings,
        );
        setIsLogin(true);
        setLoading(false);
        props.navigation.navigate('App');
      }
    };
    autoLogin();
  }, []);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [biometry, setBiometry] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {navigation, tokenBM, IsDeviceSupported} = props;
  const checkToken = async () => {
    try {
      console.log(`checkToken`);
      const fcmToken2 = await messaging().getToken();
      if (fcmToken2) {
        AsyncStorage.setItem('@BCD:fcmToken', fcmToken2).catch(errM => {
          //     showAlert('Error', errM.message)
        });
        console.log('fcmToken2');
        console.log(fcmToken2);
        setFCMToken(fcmToken2);
        // AsyncStorage.setItem('@BCD:fcmToken', fcmToken2).catch(errM => {
        //   //  this.showAlert('Error', errM.message)
        // });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //     return true;
  //   }
  // }
  // const getToken = async () => {
  //   console.log(`getToken`);
  //   const token = await checkToken();
  //   AsyncStorage.setItem('@BCD:fcmToken', token).catch(errM => {
  //     //  this.showAlert('Error', errM.message)
  //   });
  //   setFCMToken(token);
  //   console.log('token');
  //   console.log(token);
  // };
  const notificationHanle = async () => {
    await checkToken();
    console.log('notificationHanle');
    await checkNotifications().then(async ({status, settings}) => {
      console.log('checkStatus');
      console.log(status);
      if (
        status == 'blocked' ||
        status == 'denied' ||
        status == 'unavailable'
      ) {
        await requestNotifications(['alert', 'sound']).then(
          async ({status, settings}) => {
            console.log('requestStatus');
            console.log(status);
            if (status == 'granted') {
              await checkToken();
            }
          },
        );
      } else {
        await checkToken();
      }
      // …
    });
  };
  useEffect(() => {
    notificationHanle();

    // checkToken();

    AsyncStorage.getItem('@BCD:fcmToken').then(token => {
      setFCMToken(token);
    });
    AsyncStorage.getItem('mobile').then(mobile => {
      if (mobile != null) {
        setUsername(mobile);
        console.log('mobile', mobile);
      } else {
        AsyncStorage.setItem('@BCD:verified', 'false').catch(errM =>
          console.log('Error', errM.message),
        );
        setLoading(false);
        navigation.navigate('Verify');
      }
    });

    TouchID.isSupported({
      unifiedErrors: false,
      passcodeFallback: false,
    })
      .then(biometryType => {
        IsDeviceSupported(true);
        if (tokenBM.key !== '' && tokenBM.enable) {
          setBiometry(true);
        }
      })
      .catch(error => {
        IsSupported(false);
        console.log(error);
      });
  }, [IsDeviceSupported, navigation, tokenBM.enable, tokenBM.key]);
  async function login(propPassword) {
    const isSimulator = await isEmulator();
    // if (isSimulator) {
    //   setIsLogin(true);
    //   setLoading(false);
    //   props.navigation.navigate('App');
    // }

    const deviceID = await getUniqueId();
    setLoading(true);
    let Password = propPassword || password;
    if (!username || !Password) {
      setLoading(false);
      setErrorMessage(Translate('Username or Password is empty'));
      return;
    }

    const lang = I18nManager.isRTL ? 'ar' : 'en';
    var keych = '';
    getKeyChain()
      .then(data => {
        if (data) {
          keych = data.password;
        }
      })
      .catch(error => {
        console.log(error);
      });
    let timer = setTimeout(() => {
      const _fcmToken = fcmToken?.toString().substring(0, 6).padStart(6) || '';
      console.log('_fcmToken');
      console.log(_fcmToken);

      const encrypted = CryptoJS.AES.encrypt(
        Password,
        `${deviceID
          .toString()
          .substring(0, 6)
          .padStart(6)}${_fcmToken}${username
          .substring(0, 6)
          .padStart(6)}${keych}`,
      );
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                      <soap:Body>
                        <Login xmlns="http://tempuri.org/">
                          <UserId>${username}</UserId>
                          <Password>${encrypted}</Password>
                          <FCMtoken>${fcmToken}</FCMtoken>
                          <Language>${lang}</Language>
                        </Login>
                      </soap:Body>
                    </soap:Envelope>
                    `;
      console.log(xmls);
      axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'http://tempuri.org/Login',
          },
        })
        .then(async res => {
          parseString(res.data.toString(), async (err, result) => {
            if (err) {
              console.log(err);
              return;
            }

            const serverData = getXmlData(result, 'Login');

            if (serverData.ErrorMessage === '') {
              setUserAccounts(serverData.Account);
              setUserInfo(serverData.UsersRow);

              if (serverData.TableKeyRow.EKY) {
                const decrypted = CryptoJS.AES.decrypt(
                  serverData.TableKeyRow.EKY.toString(),
                  `${deviceID.toString().substring(0, 6).padStart(6)}${fcmToken
                    .toString()
                    .substring(0, 6)
                    .padStart(6)}${username
                    .toString()
                    .substring(0, 6)
                    .padStart(6)}${keych}`,
                ).toString();
                const plain = convertToAsc(decrypted);
                setKeyChain(plain);
              }
              setLoading(false);
              const user = {...serverData};
              await setUser({user, serverData, Password});

              props.onLogin(
                {user},
                serverData.TableTokenRow.Token,
                Password,
                serverData.UserSettings,
              );
              setIsLogin(true);
              setLoading(false);
              props.navigation.navigate('App');
            } else if (serverData.ErrorMessage === 'msg_UnregisteredDevice') {
              Alert.alert(
                Translate('Registration Error, Register Now?'),
                '',
                [
                  {
                    text: Translate('cancel'),
                    onPress: () => {
                      setLoading(false);
                      setErrorMessage(serverData.ErrorMessage);
                    },
                    style: 'cancel',
                  },
                  {
                    text: Translate('yes'),
                    onPress: () => {
                      props.ResetBMT();
                      AsyncStorage.setItem(
                        '@BCD:verified',
                        JSON.stringify(false),
                      )
                        .then(() => {
                          setLoading(false);
                          props.navigation.navigate('Verify');
                        })
                        .catch(errM => {
                          //  this.showAlert('Error', errM.message)
                        });
                    },
                  },
                ],
                {
                  cancelable: false,
                },
              );
            } else {
              setLoading(false);
              setErrorMessage(Translate(serverData.ErrorMessage));
            }
          });
        })
        .catch(err => {
          setLoading(false);
          console.error(err); /* eslint-disable-line */
        });
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }
  function AuthenticateLogin() {
    TouchID.authenticate(
      I18nManager.isRTL
        ? 'الان بامكانك الدخول باستخدام البصمة'
        : 'Now you can login using TouchID',
      {
        title: I18nManager.isRTL
          ? ' الدخول باستخدام البصمة'
          : 'Fingerprint Login', // Android
        imageColor: '#2F5CCA', // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: 'Touch sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: I18nManager.isRTL ? 'الغاء' : 'Cancel', // Android
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
      },
    )
      .then(success => {
        // Success code
        setPassword(props.tokenBM.key);
        login(props.tokenBM.key);
      })
      .catch(error => {
        // Failure code
        console.log(error);
      });
  }
  async function changeLanguage() {
    const language = I18nManager.isRTL ? 'false' : 'true';
    await AsyncStorage.setItem('@BCD:language', language)
      .then(async () => {
        await AsyncStorage.getItem('@BCD:language').then(lang => {
          console.log(lang);
          console.log('lang');
          I18nManager.forceRTL(lang === 'true');
          I18nManager.allowRTL(lang === 'true');
          // I18nManager.swapLeftAndRightInRTL(lang === 'true');
          SplashScreen.show();
          RNRestart.restart();
        });
      })
      .catch(errM => console.log('Error', errM.message));
  }
  return (
    <Container>
      {loading && <Loading backgroundColor="#5d5d5d4d" />}
      <ChangeLanguageBtn onPress={changeLanguage}>
        <FIcon name="language" size={20} color="white" />
      </ChangeLanguageBtn>
      <Body>
        <View
          style={{
            // position: 'absolute',
            top: 10,
            // zIndex: 99999,
            // position: 'absolute',
            // left: 0,
            // right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            // alignContent: 'flex-start',
            // alignItems: 'flex-start',
            // justifyContent: 'flex-start',
            width: width,
            backgroundColor: '#ffffff',
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
          <ImageBackground
            style={{
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              height: 250,
            }}
            resizeMode={FastImage.resizeMode.cover}
            source={require('../../assets/backGround.png')}
          />
        </View>

        {/* <View
          style={{
            width: width,
            maxHeight: 200,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}>
          <FastImage
            style={{
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              height: 250,
            }}
            resizeMode={FastImage.resizeMode.cover}
            source={require('../../assets/backGround.png')}
          />
        </View> */}

        <KeyboardAvoidingView behavior={isIOS ? 'position' : 'padding'} enabled>
          <BoxShadow setting={shadowOpt}>
            <LoginContainer>
              <TextField
                editable={false}
                defaultValue={username}
                keyboardType="phone-pad"
                label={Translate('Mobile Number')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                icon={() => <AIcon name="mobile1" size={18} color="#2F5CCA" />}
              />

              <TextField
                onChangeText={text => setPassword(text)}
                keyboardType="default"
                label={Translate('Password')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                secureTextEntry
                error={errorMessage}
                icon={() => <AIcon name="lock1" size={18} color="#2F5CCA" />}
              />
              <Button
                disabled={loading}
                textStyle={additionalStyle.ButtonText}
                onPress={() => login()}
                title={Translate('Login')}
              />
              <OtherActionsContainer>
                <OtherAction
                  onPress={() => {
                    setLoading(false);
                    props.navigation.navigate('ForgotPassword');
                  }}>
                  <OtherActionText>
                    {Translate('Forgot Password')}
                  </OtherActionText>
                </OtherAction>
                {biometry && (
                  <>
                    <VerticalLine />
                    <OtherAction onPress={AuthenticateLogin}>
                      <OtherActionText>
                        {Translate('Login using TouchID')}
                      </OtherActionText>
                    </OtherAction>
                  </>
                )}
              </OtherActionsContainer>
            </LoginContainer>
          </BoxShadow>
        </KeyboardAvoidingView>
      </Body>
    </Container>
  );
}

const mapStateToProps = state => ({
  user: state.user,
  tokenBM: state.tokenBM,
});

const mapDispatchToProps = dispatch => ({
  onLogin: (user, token, pass, labels, isSupported) => {
    dispatch(GetUser(user));
    dispatch(GetToken(token));
    dispatch(GetTokenBM(pass));
    dispatch(GetLabels(labels));
  },
  ResetBMT: () => {
    dispatch(ResetBMT());
  },
  IsDeviceSupported: state => {
    dispatch(IsSupported(state));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
