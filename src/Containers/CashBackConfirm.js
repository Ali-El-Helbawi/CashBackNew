import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {
  Dimensions,
  I18nManager,
  View,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {parseString} from 'react-native-xml2js';
import AIcon from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DataContext} from '../context/dataContext';
import {CompleteCashBack} from '../Components/modal';
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
import Loading from '../Components/loading';
import {UpdatedAccounts} from '../actions';
//set inex to model and loading
const {height, width} = Dimensions.get('window');

import * as RootNavigation from '../Navigation/RootNavigation';
import {BackgroundBlue, BackgroundColor, SecondBlue} from '../assets/colors';
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
  CodeField: {marginTop: 20, marginBottom: 20, marginHorizontal: 20},
};
const CELL_COUNT = 5;

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

const Container = styled.View`
  background-color: ${BackgroundBlue};
  height: 100%;
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
  min-height: ${height}px;
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

const ConfirmationText = styled.Text`
  font-size: 16px;
  text-align: center;
  font-weight: 900;
  font-family: ${Font};
  margin-top: 25px;
  color: #ff6562;
`;

const CashBackConfirm = props => {
  const [isOpen, setisOpen] = useState(false);
  const {fcmToken} = useContext(DataContext);

  const {
    InvoiceAmmount,
    CustomerNumber,
    CustomerCashback,
    CashbackPrecentage,
    formattedDateString,
    date,
  } = props.route.params;
  const num = (InvoiceAmmount - CustomerCashback) * (CashbackPrecentage / 100);

  const CashbackToCustomer = (Math.round(num * 100) / 100).toFixed(2);
  console.log('CashbackToCustomer');
  console.log(CashbackToCustomer);
  const [value, setValue] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState('');
  const ToAccount = props.accounts[props.defaultAccount].Pan;

  const FromAccount = props.accounts[props.defaultAccount].Pan;
  const userid = props.user.UserId;
  const Currency = props.user.Currency;

  async function receiveAmount({formattedDateString, date}) {
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
    let Timer = setTimeout(async () => {
      // const date = new Date();
      const formattedDate = date.toISOString();
      const StringDate =
        moment(date).format('L') + ' ' + moment(date).format('LTS');

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
      console.log('secCode');
      console.log(secCode);
      const enc2 =
        CustomerNumber.substring(CustomerNumber.length, 6) +
        value.padEnd(6, '0');
      console.log('enc 2 receiveAmount');
      console.log(enc2);
      const enc =
        value !== '' ? CryptoJS.AES.encrypt(value, enc2).toString() : '';

      // <Token>${token}</Token>;
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
      <OTP>${enc}</OTP>
   <Token>${token}</Token>
      <SecurityCode>${encryptedSecCode}</SecurityCode>
    </ConfirmTransactionByUser>
  </soap:Body>
  </soap:Envelope>
      `;

      console.log(xmls);

      await axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'http://tempuri.org/ConfirmTransactionByUser',
          },
        })
        .then(async res => {
          parseString(res.data.toString(), async (err, result) => {
            if (err) {
              setLoading(false);
              console.log(err);
            }
            const serverData =
              result['soap:Envelope']['soap:Body'][0]
                .ConfirmTransactionByUserResponse[0]
                .ConfirmTransactionByUserResult[0];
            //  const serverData = JSON.parse(
            //    result['soap:Envelope']['soap:Body'][0]
            //      .ConfirmTransactionByUserResponse[0]
            //      .ConfirmTransactionByUserResult[0],
            //  );
            console.log(serverData);
            if (serverData === 'OTP verification') {
              setLoading(false);
            }
            if (serverData === 'invalid OTP') {
              setErrorMessage(Translate('invalid OTP'));
              setLoading(false);
            }

            if (serverData === 'Confirmed') {
              await sendAmount({formattedDateString: formattedDateString});
            }
            // setLoading(false);
            setResponse(serverData);
            setErrorMessage(Translate(serverData.ErrorMessage));
          });
        })
        .catch(err => {
          setLoading(false);
          console.error(err); /* eslint-disable-line */
        });
    }, 3000);
    return () => {
      clearTimeout(Timer);
    };
  }
  async function sendAmount({formattedDateString}) {
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
    let Timer = setTimeout(async () => {
      const date = new Date();
      const formattedDate = date.toISOString();
      const StringDate = moment(date).utc().format('MMDDYYYYHHmmss').toString();

      const ttype = 'SendCashbackSMS';
      const secCode =
        ttype +
        StringDate +
        CashbackToCustomer +
        Currency +
        ToAccount +
        userid +
        CustomerNumber;
      const encryptedSecCode = CryptoJS.AES.encrypt(
        secCode,
        `${keych}`,
      ).toString();

      // const enc2 = userid.substring(userid.length, 6) + value.padEnd(6, '0');
      // const enc =
      //   value !== '' ? CryptoJS.AES.encrypt(value, enc2).toString() : '';

      // <Token>${token}</Token>;
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ConfirmTransactionByUser xmlns="http://tempuri.org/">
      <TransactionType>${ttype}</TransactionType>/
      <TransactionDate>${formattedDate}</TransactionDate>
      <IssuerId>1</IssuerId>
      <IssuerTransactionId>${formattedDateString}</IssuerTransactionId>
      <Amount>${CashbackToCustomer}</Amount>
      <Currency>${Currency}</Currency>
      <TerminalId> </TerminalId>
      <MerchantName> </MerchantName>
      <MerchantId> </MerchantId>
      <AccountExpiryDate> </AccountExpiryDate>
      <AdditionalData>${InvoiceAmmount}</AdditionalData>
      <SenderAccountNumber>${ToAccount}</SenderAccountNumber>
      <BeneficiaryAccountNumber></BeneficiaryAccountNumber>
      <Sender>${userid}</Sender>
      <Receiver>${CustomerNumber}</Receiver>
      <OTP></OTP>
   <Token>${token}</Token>
      <SecurityCode>${encryptedSecCode}</SecurityCode>
    </ConfirmTransactionByUser>
  </soap:Body>
  </soap:Envelope>
      `;

      console.log(xmls);

      await axios
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
              setLoading(false);
              console.log(err);
            }
            const serverData =
              result['soap:Envelope']['soap:Body'][0]
                .ConfirmTransactionByUserResponse[0]
                .ConfirmTransactionByUserResult[0];
            // const serverData = JSON.parse(
            //   result['soap:Envelope']['soap:Body'][0]
            //     .ConfirmTransactionByUserResponse[0]
            //     .ConfirmTransactionByUserResult[0],
            // );
            console.log(serverData);
            if (serverData === 'OTP verification') {
            }
            if (serverData === 'invalid OTP') {
              setErrorMessage(Translate('invalid OTP'));
              setLoading(false);
            }
            if (serverData === 'Confirmed') {
              setLoading(false);
              setisOpen(true);
              // updatePayment(userid, props.updateAccount, fcmToken);
            }
            setLoading(false);
            // setisOpen(true);
            setResponse(serverData);
            setErrorMessage(Translate(serverData.ErrorMessage));
          });
        })
        .catch(err => {
          setLoading(false);
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
        // source={require('../../assets/BackgroundColor.png')}
      >
        {isOpen && (
          <CompleteCashBack
            handleOnPress={() => {
              setisOpen(false);
              RootNavigation.navigate('Home');
            }}
            ReceivedAmount={CustomerCashback}
            CashbackPrecentage={(
              Math.round(
                ((CashbackPrecentage * (InvoiceAmmount - CustomerCashback)) /
                  InvoiceAmmount) *
                  100,
              ) / 100
            ).toFixed(2)}
            Currency={Currency}
            isOpen={isOpen}
            loading={loading}
            width={width}
            height={height}
            SentTOCustomerAmount={CashbackToCustomer}
          />
        )}
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
              //</ScrollView> source={require('../../assets/BackgroundColor.png')}
            >
              <View
                style={{
                  marginHorizontal: 15,
                  marginTop: 30,
                  backgroundColor: 'white',
                  zIndex: 999,
                }}>
                <TextField
                  value={InvoiceAmmount}
                  keyboardType="numeric"
                  label={Translate('InvoiceAmmount')}
                  labelTextStyle={{fontFamily: Font}}
                  prefix={Currency}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                  editable={false}
                  disabled={true}
                />
                <TextField
                  value={CustomerCashback}
                  keyboardType="numeric"
                  label={Translate('CustomerCashback')}
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  prefix={Currency}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                  editable={false}
                  disabled={true}
                />
                <TextField
                  value={InvoiceAmmount - CustomerCashback}
                  keyboardType="numeric"
                  label={Translate('InvoiceCashback')}
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  prefix={Currency}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                  editable={false}
                  disabled={true}
                />
                <TextField
                  value={CashbackToCustomer}
                  keyboardType="numeric"
                  label={Translate('CashbackToCustomer')}
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  prefix={Currency}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                  editable={false}
                  disabled={true}
                />
                <TextField
                  value={CustomerNumber}
                  keyboardType="numeric"
                  label={Translate('CustomerNumber')}
                  labelTextStyle={{fontFamily: Font}}
                  titleTextStyle={{fontFamily: Font}}
                  affixTextStyle={{fontFamily: Font}}
                  labelOffset={
                    I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                  }
                  editable={false}
                  disabled={true}
                />

                {/* <TextField
            value={CashbackPrecentage ? CashbackPrecentage + ' %' : ''}
            keyboardType="phone-pad"
            label={Translate('CashbackPrecentage')}
            labelTextStyle={{fontFamily: Font}}
            titleTextStyle={{fontFamily: Font}}
            affixTextStyle={{fontFamily: Font}}
            labelOffset={I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}}
            editable={false}
            disabled={true}
          /> */}

                {CustomerCashback > 0 && (
                  <TextField
                    onChangeText={text => setValue(text)}
                    keyboardType="phone-pad"
                    label={Translate('VerificationCode')}
                    labelTextStyle={{fontFamily: Font}}
                    titleTextStyle={{fontFamily: Font}}
                    affixTextStyle={{fontFamily: Font}}
                    labelOffset={
                      I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                    }
                  />
                )}
                <Button
                  secondary
                  onPress={async () => {
                    // const date = new Date();

                    // const formattedDateString = moment(date)
                    //   .utc()
                    //   .format('MMDDYYYYHHmmss')
                    //   .toString();
                    setErrorMessage(``);
                    await receiveAmount({
                      formattedDateString: formattedDateString,
                      date: date,
                    }).then(async () => {});
                  }}
                  disabled={loading}
                  title={Translate('NextStep')}
                />
                <ConfirmationText response={response}>
                  {Translate(errorMessage)}
                </ConfirmationText>
              </View>
              {loading && <Loading />}
            </ImageBackground>
          </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(CashBackConfirm);
