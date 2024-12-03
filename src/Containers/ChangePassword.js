import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import {TextField, Button} from '../Components';
import AIcon from 'react-native-vector-icons/AntDesign';
import {parseString} from 'react-native-xml2js';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
import {Dimensions} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {getKeyChain, getXmlData, serverLink, Font, Translate} from '../Helpers';
import {DataContext} from '../context/dataContext';
import {getUniqueId} from 'react-native-device-info';
import {
  BackgroundBlue,
  BlueColor,
  DefaultBackgroundColor,
  Orange,
  SecondBlue,
} from '../assets/colors';
const {height} = Dimensions.get('window');

const Container = styled.View`
  background-color: ${DefaultBackgroundColor};
`;

const Body = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    width: '100%',
    padding: 15,
    paddingTop: 30,
  },
}))`
  background-color: ${DefaultBackgroundColor};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: 100%;
  height: ${height}px;
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

function ChangePassword(props) {
  const {fcmToken} = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [newPass, SetNewPass] = useState('');
  const [newPassRep, SetNewPassRep] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const phone = props.user.UserId;

  useEffect(() => {
    // AsyncStorage.getItem('@BCD:fcmToken').then(token => {
    //   setFCMToken(token);
    // });
    // console.log('use');
  }, []);

  async function changePassword() {
    const deviceID = await getUniqueId();
    setLoading(true);
    var keych = '';
    getKeyChain()
      .then(data => {
        if (data) {
          keych = data.password;
          console.log(data);
        }
      })
      .catch(eRR => {
        console.log(eRR);
      });
    if (newPassRep !== newPass) {
      return setPasswordError(Translate('Password dont match'));
    }
    setPasswordError('');
    if (oldPassword.length < 1) {
      return setOldPasswordError(Translate('This field could not be empty'));
    }
    setOldPasswordError('');
    let Timer = setTimeout(() => {
      const date = new Date();
      const formattedDate = date.toISOString();
      const formattedDateString = moment(date)
        .utc()
        .format('MMDDYYYYHHmmss')
        .toString();
      const secCode = formattedDateString + phone;

      let NewPass = CryptoJS.AES.encrypt(
        newPass,
        `${deviceID.substring(0, 6).padStart(6)}${fcmToken
          .substring(0, 6)
          .padStart(6)}${phone.substring(0, 6).padStart(6)}${keych}`,
      ).toString();
      let OldPass = CryptoJS.AES.encrypt(
        oldPassword,
        `${deviceID.substring(0, 6).padStart(6)}${fcmToken
          .substring(0, 6)
          .padStart(6)}${phone.substring(0, 6).padStart(6)}${keych}`,
      ).toString();
      const securityCode = CryptoJS.AES.encrypt(secCode, `${keych}`).toString();
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <ResetUserPassword xmlns="http://tempuri.org/">
                    <Phone>${phone}</Phone>
                    <TransactionDate>${formattedDate}</TransactionDate>
                    <OldPassword>${OldPass}</OldPassword>
                    <NewPassword>${NewPass}</NewPassword>
                    <SecurityCode>${securityCode}</SecurityCode>
                    <FCMtoken>${fcmToken}</FCMtoken>
                  </ResetUserPassword>
                </soap:Body>
              </soap:Envelope>
                    `;
      console.log(xmls);
      console.log({
        secCode,
        phone,
        keych,
        oldPassword,
        newPass,
        fcmToken,
        securityCode,
        OldPass,
        xmls,
      });
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
    }, 2000);
    return () => {
      clearTimeout(Timer);
    };
  }

  return (
    <KeyboardAwareScrollView>
      <Container>
        <Body>
          <TitleText>{Translate('Change Password')}:</TitleText>

          <SubtitleText>
            {Translate('Please enter the old password and new password')}
          </SubtitleText>
          <TextField
            onChangeText={text => setOldPassword(text)}
            keyboardType="default"
            label={Translate('Current Password')}
            error={oldPasswordError}
            labelTextStyle={{fontFamily: Font}}
            titleTextStyle={{fontFamily: Font}}
            affixTextStyle={{fontFamily: Font}}
            secureTextEntry
            icon={() => <AIcon name="unlock" size={18} color="#2F5CCA" />}
          />
          <TextField
            onChangeText={text => SetNewPass(text)}
            keyboardType="default"
            label={Translate('New Password')}
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
            label={Translate('Retype New Password')}
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
            styles={`background-color:${BlueColor}`}
            onPress={() =>
              response === ''
                ? changePassword()
                : props.navigation.navigate('Home')
            }
            disabled={false}
            title={Translate(response === '' ? 'Submit' : 'Quit')}
          />
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

export default connect(mapStateToProps)(ChangePassword);
