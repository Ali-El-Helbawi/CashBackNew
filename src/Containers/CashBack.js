import React, {useEffect, useContext, useState} from 'react';
import styled from 'styled-components/native';
import {
  Dimensions,
  I18nManager,
  ScrollView,
  ImageBackground,
  View,
} from 'react-native';
import {parseString} from 'react-native-xml2js';
import AIcon from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DataContext} from '../context/dataContext';
import {
  EnglishFont,
  getKeyChain,
  getXmlData,
  Translate,
  Font,
  serverLink,
  updatePayment,
} from '../Helpers';
import CryptoJS from 'react-native-crypto-js';
import axios from 'axios';
import moment from 'moment';
import {TextField, Button, VerifyModal} from '../Components';
import {connect} from 'react-redux';
import {BoxShadow} from 'react-native-shadow';

import {UpdatedAccounts} from '../actions';

const {height, width} = Dimensions.get('window');

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Loading from '../Components/loading';
import {color} from 'react-native-reanimated';
import {BackgroundColor} from '../assets/colors';
const shadowOpt = {
  width: 50,
  height: 50,
  border: 3,
  radius: 0,
  opacity: 0.1,
  x: 0,
  y: 0,
  style: {marginVertical: 0, borderRadius: 8},
};

const additionalStyle = {
  CodeField: {marginTop: 20, marginBottom: 20},
};
const CELL_COUNT = 6;

const Cell = styled.Text`
  font-family: ${EnglishFont}
  width: 50px;
  height: 50px;
  border-width: 2px;
  text-align: center;
  font-size: 24px;
  line-height: 45px;
  border-radius: 3px;
  ${props =>
    props.isFocused
      ? 'border-color: #00000030; background-color: #f4fafb;'
      : ' border-color: transparent;  background-color: white;'}
  ${props =>
    props.symbol &&
    `shadow-radius: 0;
    elevation: 0;
    color: #2F5CCA;
    font-weight: 900;
    border-color: #00000030;
    `}
`;

const ConfirmationText = styled.Text`
  font-size: 16px;
  text-align: center;
  font-weight: 900;
  font-family: ${Font};
  margin-top: 25px;
  color: #ff6562;
`;

const CashBack = props => {
  const checkNumber = number => {
    const reg = /^\d+$/;
    const isNumber = reg.test(number);
    console.log(isNumber);
    return isNumber;
  };

  const {userInfo, userAccounts, fcmToken} = useContext(DataContext);
  console.log(userInfo?.CashBackPercentage ?? '0');
  const [InvoiceAmmount, setInvoiceAmmount] = useState('');
  const [CustomerNumber, setCustomerNumber] = useState('');
  const [CustomerCashback, setCustomerCashback] = useState(0);
  const [isModal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(false);
  const [AccountHolderNameAr, setAccountHolderNameAr] = useState('');
  const [AccountHolderNameEn, setAccountHolderNameEn] = useState('');
  const [AmountError, setAmountError] = useState('');
  const [AccountError, setAccountError] = useState('');
  const [CashBacktError, setCashBackError] = useState('');
  const FromAccount = props.accounts[props.defaultAccount].Pan;
  const userid = props.user.UserId;
  const Currency = props.user.Currency;
  const [value, setValue] = useState('');
  const ToAccount = props.accounts[props.defaultAccount].Pan;

  const Validate = () => {
    var valid = true;
    const regTest = /^\d+(\.\d{1,2})?$/;
    if (CustomerNumber.length < 3) {
      setAccountError(Translate('Please enter a valid account'));
      valid = false;
    } else {
      setAccountError('');
    }
    if (!regTest.test(CustomerCashback)) {
      setCashBackError(Translate('Please enter a valid amount'));
      valid = false;
    } else {
      setCashBackError('');
    }
    if (!regTest.test(InvoiceAmmount) || InvoiceAmmount === 0) {
      setAmountError(Translate('Please enter a valid amount'));
      valid = false;
    } else {
      setAmountError('');
    }
    return valid;
  };

  async function receiveAmount() {
    const {token} = props;
    setLoading(true);
    var keych = '';
    getKeyChain()
      .then(data => {
        if (data) {
          keych = data.password;
        }
      })
      .catch(err => {
        console.log(err);
      });
    let Timer = setTimeout(() => {
      const date = new Date();
      const formattedDate = date.toISOString();
      const formattedDateString = moment(date)
        .utc()
        .format('MMDDYYYYHHmmss')
        .toString();
      const ttype = 'ReceiveCashbackSMS';
      const secCode =
        ttype +
        formattedDateString +
        CustomerCashback +
        Currency +
        ToAccount +
        CustomerNumber +
        userid;
      const encryptedSecCode = CryptoJS.AES.encrypt(
        secCode,
        `${keych}`,
      ).toString();

      const enc2 =
        CustomerNumber.substring(CustomerNumber.length, 6) +
        value.padEnd(6, '0');
      const enc =
        value !== '' ? CryptoJS.AES.encrypt(value, enc2).toString() : '';

      // <Token>${token}</Token>;
      //<OTP>${enc}</OTP>;
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ConfirmTransactionByUser xmlns="http://tempuri.org/">
      <TransactionType>${ttype}</TransactionType>/
      <TransactionDate>${formattedDate}</TransactionDate>
      <IssuerId>1</IssuerId>
      <IssuerTransactionId>${formattedDateString}</IssuerTransactionId>
      <Amount>${CustomerCashback}</Amount>
      <Currency>${Currency}</Currency>
      <TerminalId> </TerminalId>
      <MerchantName> </MerchantName>
      <MerchantId> </MerchantId>
      <AccountExpiryDate> </AccountExpiryDate>
      <AdditionalData>${InvoiceAmmount}</AdditionalData>
      <SenderAccountNumber></SenderAccountNumber>
      <BeneficiaryAccountNumber>${ToAccount}</BeneficiaryAccountNumber>
      <Sender>${CustomerNumber}</Sender>
      <Receiver>${userid}</Receiver>
      <OTP></OTP>
      <Token>${token}</Token>
      <SecurityCode>${encryptedSecCode}</SecurityCode>
    </ConfirmTransactionByUser>
  </soap:Body>
  </soap:Envelope>
      `;
      console.log(xmls);
      axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'http://tempuri.org/ConfirmTransactionByUser',
          },
        })
        .then(res => {
          parseString(res.data.toString(), (err, result) => {
            if (err) {
              console.log(err);
            }
            const serverData =
              result['soap:Envelope']['soap:Body'][0]
                .ConfirmTransactionByUserResponse[0]
                .ConfirmTransactionByUserResult[0];
            console.log(serverData);
            if (serverData === 'OTP verification') {
              updatePayment(userid, props.updateAccount, fcmToken);
              props.navigation.navigate('CashBackConfirm', {
                formattedDateString: formattedDateString,
                date: date,
                InvoiceAmmount: InvoiceAmmount,
                CustomerNumber: CustomerNumber,
                CustomerCashback: CustomerCashback,
                CashbackPrecentage:
                  userInfo && userInfo.CashBackPercentage
                    ? userInfo.CashBackPercentage
                    : 0,
              });
            }
            if (serverData === 'Confirmed') {
              updatePayment(userid, props.updateAccount, fcmToken);
              props.navigation.navigate('CashBackConfirm', {
                formattedDateString: formattedDateString,
                date: date,
                InvoiceAmmount: InvoiceAmmount,
                CustomerNumber: CustomerNumber,
                CustomerCashback: CustomerCashback,
                CashbackPrecentage:
                  userInfo && userInfo.CashBackPercentage
                    ? userInfo.CashBackPercentage
                    : 0,
              });
            }
            // if (serverData === 'invalid OTP') {
            //   updatePayment(userid, props.updateAccount);
            //   props.navigation.navigate('CashBackConfirm', {
            //     InvoiceAmmount: InvoiceAmmount,
            //     CustomerNumber: CustomerNumber,
            //     CustomerCashback: CustomerCashback,
            //     CashbackPrecentage:
            //       userInfo && userInfo.CashBackPercentage
            //         ? userInfo.CashBackPercentage
            //         : 0,
            //   });
            // }
            setResponse(serverData);

            setErrorMessage(Translate(serverData.ErrorMessage));
            if (serverData == 'Insufficiant Balance') {
              setErrorMessage(Translate('Insufficiant Balance'));
            }
            setLoading(false);
          });
        })
        .catch(err => {
          console.error(err); /* eslint-disable-line */
        });
    }, 3000);
    return () => {
      clearTimeout(Timer);
    };
  }
  return (
    <View
      style={{
        backgroundColor: `#ffffff`,
        height: `100%`,
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <ImageBackground
        style={{
          width: width,
          height: height,
          backgroundColor: BackgroundColor,
        }}
        resizeMode="cover"
        //source={require('../../assets/BackgroundColor.png')}
      >
        <KeyboardAwareScrollView>
          <ScrollView
            style={{
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              minHeight: height,
              backgroundColor: 'white',
              width: width,
            }}
            contentContainerStyle={{
              width: width,
              // padding: 15,
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              style={{
                width: width,
                height: height,
                backgroundColor: BackgroundColor,
              }}
              resizeMode="cover"
              // source={require('../../assets/BackgroundColor.png')}
            >
              <View
                style={{
                  marginHorizontal: 15,
                  marginTop: 30,
                  backgroundColor: 'white',
                  zIndex: 999,
                }}>
                <TextField
                  onChangeText={text => {
                    setInvoiceAmmount(text);
                    // if (checkNumber(text) == true) {
                    //   setInvoiceAmmount(text);
                    // } else {
                    //   const prevText = text.slice(0, -1);
                    //   setInvoiceAmmount(prevText);
                    // }
                  }}
                  value={InvoiceAmmount}
                  keyboardType="numeric"
                  label={Translate('InvoiceAmmount')}
                  labelTextStyle={{fontFamily: Font}}
                  prefix={Currency}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  error={AmountError}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                />
                <TextField
                  onChangeText={text => setCustomerNumber(text)}
                  keyboardType="numeric"
                  label={Translate('CustomerNumber')}
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  error={AccountError}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                />
                <TextField
                  onChangeText={text => setCustomerCashback(text)}
                  defaultValue={CustomerCashback.toString()}
                  keyboardType="numeric"
                  label={Translate('CustomerCashback')}
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  error={CashBacktError}
                  prefix={Currency}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                />
                <TextField
                  value={
                    userInfo && userInfo.CashBackPercentage
                      ? userInfo.CashBackPercentage + ' %'
                      : ''
                  }
                  editable={false}
                  disabled={true}
                  keyboardType="phone-pad"
                  label={Translate('CashbackPrecentage')}
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  error={AmountError}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                />
                <Button
                  secondary
                  onPress={() => {
                    if (Validate()) {
                      setErrorMessage(``);
                      // if (CustomerCashback != '' && CustomerCashback >= 0) {
                      receiveAmount();
                      // }
                    } else {
                      return;
                    }
                  }}
                  disabled={loading}
                  title={Translate('NextStep')}
                />
                {/* response={response} */}
                <ConfirmationText>{Translate(errorMessage)}</ConfirmationText>
              </View>
            </ImageBackground>
          </ScrollView>
          {loading && <Loading />}
        </KeyboardAwareScrollView>
      </ImageBackground>
    </View>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  userInfo: state.userInfo,
  accounts: state.accounts,
  defaultAccount: state.defaultAccount,
  token: state.token,
});
const mapDispatchToProps = dispatch => ({
  updateAccount: accounts => {
    dispatch(UpdatedAccounts(accounts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CashBack);
