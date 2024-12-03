import React, {useState} from 'react';
import {
  I18nManager,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import {StepIndicator} from '../Components';
import DatePicker from 'react-native-date-picker';
import {TextField, Button} from '../Components';
import Logo from '../assets/logo.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import {parseString} from 'react-native-xml2js';
import {getUniqueId} from 'react-native-device-info';
import {getXmlData, serverLink, Font, Translate} from '../Helpers';
import AIcon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import FastImage from 'react-native-fast-image';
import {SecondBlue} from '../assets/colors';
const moment = extendMoment(Moment);
const {width, height} = Dimensions.get('window');

const labels = ['Cart', 'Delivery Address', 'Order Summary'];

const LogoContainer = styled.Text`
  position: absolute;
  top: ${height * 0.1}px;
  z-index: 99999;
  elevation: 3;
  font-family: ${Font};
  left: ${(width - 233) / 2}px;
`;

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

const Container = styled.View`
  background: rgba(195, 211, 212, 0.01);
`;
const Body = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    width: '100%',
    paddingTop: 30,
  },
}))`
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: 100%;
  margin-top: 0px;
  height: ${height}px;
`;

const TabContainer = styled.View`
  padding: 20px;
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

const DoneText = styled.Text`
  font-size: 20px;
  text-align: center;
  font-weight: 900;
  font-family: ${Font};
  margin-top: 15px;
  margin-bottom: 20px;
  color: ${SecondBlue};
`;
const ErrorMessageText = styled.Text`
  font-size: 14px;
  color: darkred;
  text-align: center;
  padding: 5px;
  font-family: ${Font};
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

function CreateAccount(props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [IdNumber, setIdNumber] = useState('');
  const [IdNumberError, setIdNumberError] = useState('');
  const [fName, setFName] = useState('');
  const [fNameError, setFNameError] = useState('');
  const [lName, setLName] = useState('');
  const [lNameError, setLNameError] = useState('');
  const [mName, setMName] = useState('');
  const [mNameError, setMNameError] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountNumberError, setAccountNumberError] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function createAccount() {
    let dob = dateOfBirth;
    if (dateOfBirth.length < 1) {
      dob = moment(new Date()).format('YYYY-MM-DD');
    }
    const deviceID = await getUniqueId();
    setLoading(true);
    setTimeout(() => {
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
                  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <RegisterNewCustomer xmlns="http://tempuri.org/">
                      <Email>${email}</Email>
                      <Phone>${phone}</Phone>
                      <ID>${IdNumber}</ID>
                      <Nationality>Libyan</Nationality>
                      <FirstName>${fName}</FirstName>
                      <MiddleName>${mName}</MiddleName>
                      <LastName>${lName}</LastName>
                      <DateOfBirth>${dob}</DateOfBirth>
                      <Address>${address}</Address>
                      <Currency>LYD</Currency>
                      <AccountType></AccountType>
                      <AccountNumber>123456789</AccountNumber>
                      <DeviceID>${deviceID}</DeviceID>
                    </RegisterNewCustomer>
                  </soap:Body>
                  </soap:Envelope>
                  `;
      console.log(xmls);
      axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'http://tempuri.org/RegisterNewCustomer',
          },
        })
        .then(res => {
          parseString(res.data.toString(), (err, result) => {
            if (err) {
              console.log(err);
            }
            const serverData = getXmlData(result, 'RegisterNewCustomer');
            setLoading(false);
            if (serverData === 'OTP verification') {
              console.log(serverData);
            } else if (serverData.ErrorMessage === '') {
              setResponse('Confirmed');
              setCurrent(3);
              console.log(serverData);
            } else if (serverData.ErrorMessage) {
              setErrorMessage(Translate(serverData.ErrorMessage));
            }
          });
        })
        .catch(err => {
          console.error(err); /* eslint-disable-line */
        });
    }, 3000);
  }
  function Validate() {
    if (current === 0) {
      if (phone.length < 5) {
        return setPhoneError(Translate('Please enter a valid Phone Number'));
      }
      setPhoneError('');
      if (email.length < 5) {
        return setEmailError(Translate('Please enter a valid Email Address'));
      }
      setEmailError('');
      if (IdNumber.length < 5) {
        return setIdNumberError(
          Translate('Please enter a valid National Number'),
        );
      }
      setIdNumberError('');
      setCurrent(1);
    }
    if (current === 1) {
      if (fName.length < 1) {
        return setFNameError(Translate('This field could not be empty'));
      }
      setFNameError('');
      if (mName.length < 1) {
        return setMNameError(Translate('This field could not be empty'));
      }
      setMNameError('');
      if (lName.length < 1) {
        return setLNameError(Translate('This field could not be empty'));
      }
      setLNameError('');
      // if (dateOfBirth.length < 1) {
      //    const newDate = moment(new Date()).format('YYYY-MM-DD');
      //    setDateOfBirth(newDate);
      //   return setDateOfBirthError(Translate('This field could not be empty'));
      // }
      setDateOfBirthError('');
      setCurrent(2);
    }
    if (current === 2) {
      if (response !== '') {
        props.navigation.navigate('Register');
      }
      if (address.length < 1) {
        return setAddressError(Translate('This field could not be empty'));
      }
      setAddressError('');
      // if (accountNumber.length === 0 || accountNumber.length === 13) {
      //   return setAccountNumberError(Translate('Please enter a valid account'));
      // }
      setAccountNumberError('');

      createAccount();
    }
  }
  const additionalStyle = {
    datepicker: {
      width: '100%',
      borderWidth: dateOfBirthError.length > 0 ? 2 : 1,
      borderColor: dateOfBirthError.length > 0 ? 'red' : 'darkgrey',
      borderRadius: 4,
      paddingTop: 3,
      height: 50,
      marginBottom: 10,
    },
  };
  return (
    <KeyboardAwareScrollView>
      <Container>
        {/* <LogoContainer>
          <Logo width={233} height={73} />
        </LogoContainer> */}
        <Body>
          <View
            style={{
              // position: 'absolute',
              // top: 40,
              // zIndex: 99999,
              // position: 'absolute',
              // left: 0,
              // right: 0,
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
          <StepIndicator
            configs={configs}
            current={current}
            labels={labels}
            count={3}
            reversed={I18nManager.isRTL}
          />
          {current === 0 && (
            <TabContainer>
              <TitleText>{Translate('Create new account')}:</TitleText>
              <SubtitleText>
                {Translate('Please fill the information below')}
              </SubtitleText>
              <TextField
                onChangeText={text => setPhone(text)}
                keyboardType="phone-pad"
                label={Translate('Mobile Number')}
                labelTextStyle={{fontFamily: Font}}
                error={phoneError}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                icon={() => <AIcon name="mobile1" size={18} color="#2F5CCA" />}
              />
              <TextField
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
                label={Translate('Email Address')}
                labelTextStyle={{fontFamily: Font}}
                error={emailError}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                icon={() => <AIcon name="mail" size={18} color="#2F5CCA" />}
              />
              <TextField
                onChangeText={text => setIdNumber(text)}
                keyboardType="default"
                label={Translate('National Number')}
                labelTextStyle={{fontFamily: Font}}
                error={IdNumberError}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                icon={() => <AIcon name="idcard" size={18} color="#2F5CCA" />}
              />
              <Button onPress={() => Validate()} title={Translate('Next')} />
            </TabContainer>
          )}
          {current === 1 && (
            <TabContainer>
              <TextField
                labelOffset={
                  I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                }
                onChangeText={text => setFName(text)}
                keyboardType="default"
                label={Translate('First Name')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                error={fNameError}
              />
              <TextField
                labelOffset={
                  I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                }
                onChangeText={text => setMName(text)}
                keyboardType="default"
                label={Translate('Middle Name')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                error={mNameError}
              />
              <TextField
                labelOffset={
                  I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                }
                onChangeText={text => setLName(text)}
                keyboardType="default"
                label={Translate('Last Name')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                error={lNameError}
              />
              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextField
                  editable={false}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                  // onChangeText={text => setLName(text)}
                  keyboardType="default"
                  label={
                    dateOfBirth != ''
                      ? dateOfBirth
                      : Translate('Date of birth') +
                        ' (' +
                        Translate('optional') +
                        ')'
                  }
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  error={lNameError}
                />
                {/* <Text style={{paddingLeft: 10, fontFamily: Font}}>
                  {dateOfBirth != '' ? dateOfBirth : Translate('Date of birth')}
                </Text> */}
              </TouchableOpacity>

              <DatePicker
                title={
                  Translate('Date of birth') +
                  ' (' +
                  Translate('optional') +
                  ')'
                }
                modal
                confirmText={Translate('Select Date of birth')}
                cancelText={Translate('cancel')}
                maximumDate={new Date()}
                mode="date"
                textColor="black"
                open={open}
                date={date}
                onConfirm={date => {
                  const newDate = moment(date).format('YYYY-MM-DD');
                  setDateOfBirth(newDate);

                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              {/* <DatePicker
                style={additionalStyle.datepicker}
                date={dateOfBirth}
                mode="date"
                placeholder={Translate('Date of birth')}
                format="YYYY-MM-DD"
                confirmBtnText={Translate('Select Date of birth')}
                cancelBtnText={Translate('cancel')}
                showIcon={false}
                onDateChange={date => setDateOfBirth(date)}
                customStyles={{
                  dateInput: {
                    color: 'black',
                    borderWidth: 0,
                    textAlign: 'left',
                    paddingLeft: 15,
                    paddingRight: 15,
                  },
                  dateText: {
                    alignSelf: 'flex-start',
                    paddingLeft: 15,
                  },
                  placeholderText: {
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    width: '100%',
                    paddingLeft: 20,
                    fontFamily: Font,
                    fontSize: 16,
                    color: dateOfBirthError.length > 0 ? 'darkred' : 'darkgrey',
                  },
                }}
              /> */}
              <Button onPress={() => Validate()} title={Translate('Next')} />
              <Button
                secondary
                onPress={() => setCurrent(0)}
                title={Translate('Back')}
              />
            </TabContainer>
          )}
          {current === 2 && (
            <TabContainer>
              <TextField
                onChangeText={text => setAddress(text)}
                keyboardType="default"
                label={Translate('Address')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                affixTextStyle={{fontFamily: Font}}
                disabled={response !== ''}
                error={addressError}
                icon={() => (
                  <MIcon name="my-location" size={18} color="#2F5CCA" />
                )}
              />
              {/* <TextField
                onChangeText={text => setAccountNumber(text)}
                keyboardType="default"
                label={Translate('Account Number')}
                labelTextStyle={{fontFamily: Font}}
                titleTextStyle={{fontFamily: Font}}
                disabled={response !== ''}
                affixTextStyle={{fontFamily: Font}}
                error={accountNumberError}
                icon={() => <MCIcon name="bank" size={18} color="#2F5CCA" />}
              /> */}
              <ErrorMessageText>{errorMessage}</ErrorMessageText>
              <ConfirmationText response={response}>
                {Translate(response)}
              </ConfirmationText>
              <Button
                disabled={loading}
                title={
                  response === '' ? Translate('Submit') : Translate('Quit')
                }
                onPress={() => Validate()}
              />
              {response === '' && (
                <Button
                  secondary
                  onPress={() => setCurrent(1)}
                  title={Translate('Back')}
                  disabled={loading}
                />
              )}
            </TabContainer>
          )}
          {current === 3 && (
            <TabContainer>
              <DoneText response={response}>
                {Translate('Your account will be activated within 24 hours')}
              </DoneText>
              <ConfirmationText response={response}>
                {Translate(response)}
              </ConfirmationText>
              <Button
                disabled={loading}
                title={Translate('Quit')}
                onPress={() => props.navigation.navigate('Register')}
              />
            </TabContainer>
          )}
        </Body>
      </Container>
    </KeyboardAwareScrollView>
  );
}

export default CreateAccount;
