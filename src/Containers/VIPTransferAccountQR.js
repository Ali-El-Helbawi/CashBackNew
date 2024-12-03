import React, {useState, useContext} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import {parseString} from 'react-native-xml2js';
import {
  Font,
  EnglishFont,
  getKeyChain,
  Translate,
  serverLink,
  updatePayment,
} from '../Helpers';
import CryptoJS from 'react-native-crypto-js';
import axios from 'axios';
import moment from 'moment';
import {TextField, VerifyModal} from '../Components';
import {connect} from 'react-redux';
import {BoxShadow} from 'react-native-shadow';
import AIcon from 'react-native-vector-icons/AntDesign';
import {UpdatedAccounts} from '../actions';
import {DataContext} from '../context/dataContext';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

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

const {height} = Dimensions.get('window');

const Container = styled.View`
  background-color: transparent;
`;

const Body = styled.ScrollView`
  background-color: black;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: 100%;
`;

const SuccessMarker = styled.View`
  width: 200px;
  height: 200px;
  border-color: red;
  border-radius: 4px;
  border-width: 3px;
  opacity: 0.5;
`;
const ErrorMarker = styled.View`
  width: 200px;
  height: 200px;
  border-color: white;
  border-radius: 4px;
  border-width: 3px;
  opacity: 0.5;
`;

const Transfer = props => {
  const {fcmToken} = useContext(DataContext);

  React.useEffect(() => {
    const unsubscribeFocus = props.navigation.addListener('focus,', () => {
      setFocused(true);
    });

    return unsubscribeFocus;
  }, [props.navigation]);
  React.useEffect(() => {
    const unsubscribeBlur = props.navigation.addListener('blur,', () => {
      setFocused(false);
    });

    return unsubscribeBlur;
  }, [props.navigation]);
  const [qrError, setQRError] = useState(false);
  const [noAmount, setNoAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [QRData, setQRData] = useState({});
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [IsFocused, setFocused] = useState(false);
  const [isModal, setModal] = useState(false);
  const FromAccount = props.accounts[props.defaultAccount].Pan;
  const userid = props.user.UserId;
  const Currency = props.user.Currency;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [Props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  function sendAmount() {
    let Amount = QRData.Amount;
    let ToAccount = QRData.account;
    let sender = props.user.UserId;
    let receiver = QRData.userid;
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
      const ttype = 'PayUsingQRVIP';
      const secCode =
        ttype +
        formattedDateString +
        Amount +
        Currency +
        FromAccount +
        ToAccount +
        sender +
        receiver;
      const encryptedSecCode = CryptoJS.AES.encrypt(
        secCode,
        `${keych}`,
      ).toString();
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ConfirmTransactionByUser xmlns="http://tempuri.org/">
      <TransactionType>${ttype}</TransactionType>
      <TransactionDate>${formattedDate}</TransactionDate>
      <IssuerId>1</IssuerId>
      <IssuerTransactionId>1</IssuerTransactionId>
      <Amount>${Amount}</Amount>
      <Currency>${Currency}</Currency>

      <TerminalId> </TerminalId>
      <MerchantName> </MerchantName>
      <MerchantId> </MerchantId>
      <AccountExpiryDate> </AccountExpiryDate>
      <AdditionalData>VIP</AdditionalData>
      <SenderAccountNumber>${FromAccount}</SenderAccountNumber>
      <BeneficiaryAccountNumber>${ToAccount}</BeneficiaryAccountNumber>
      <Sender>${userid}</Sender>
      <Receiver>${receiver}</Receiver>
      <OTP>${
        value !== ''
          ? CryptoJS.AES.encrypt(
              value,
              `${userid.substring(userid.length, 6)}${value.padEnd(6, '0')}`,
            ).toString()
          : ''
      }</OTP>
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
            if (serverData === 'Confirmed') {
              updatePayment(userid, props.updateAccount, fcmToken);
            }
            setLoading(false);
            setResponse(serverData);
            setErrorMessage(Translate(serverData.ErrorMessage));
            // if (serverData === 'Confirmed') {
            //   navigation.navigate('Success');
            // } else
            // if (serverData === 'OTP verification') {
            //   navigation.navigate('SendAccountVerify', [
            //     navigation.state.params,
            //     keych,
            //   ]);
            // } else
            // if (serverData === 'password verification') {
            //   navigation.navigate('SendAccountVerifyPassword', [
            //     navigation.state.params,
            //     keych,
            //   ]);
            // } else
            // if (serverData === 'Not Allowed Sender Receiver') {
            //   setErrorMessage(Translate(serverData));
            //   if (I18nManager.isRTL) {
            //     that.setState({errorMessage: 'لا يمكن استخدام هذا الحساب'});
            //   }
            // } else
            // if (serverData === 'Corebank Rejection') {
            //   setErrorMessage(Translate(serverData));
            //   if (I18nManager.isRTL) {
            //     that.setState({errorMessage: 'لا يمكن تنفيذ العملية'});
            //   }
            // } else
            // if (serverData === 'Above ceilling') {
            //  setErrorMessage(Translate(serverData));
            //  if (I18nManager.isRTL) {
            //    that.setState({errorMessage: 'مبلغ اعلى من المسموح'});
            //  }
            // } else {
            //setErrorMessage(Translate(serverData.ErrorMessage));
            // }
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

  function onSuccess(e) {
    try {
      const checkIfAvailable = JSON.parse(e.data);
      if (!checkIfAvailable.userid) {
        return;
      }
    } catch (err) {
      console.log(err);
      setQRError(true);
      return;
    }
    if (e.data) {
      try {
        const getData = JSON.parse(e.data);
        setQRData(getData);
        setNoAmount(!parseInt(getData.Amount, 10) > 0);
        setModal(true);
      } catch (err) {
        console.log(err);
        setQRError(true);
        return;
      }
    }
  }
  console.log(QRData);
  return (
    <Container>
      <VerifyModal
        otpContent={
          <CodeField
            ref={ref}
            {...Props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={additionalStyle.CodeField}
            keyboardType="phone-pad"
            renderCell={({index, symbol, isFocused}) => (
              <BoxShadow setting={shadowOpt}>
                <Cell
                  key={index}
                  symbol={symbol}
                  isFocused={isFocused}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Cell>
              </BoxShadow>
            )}
          />
        }
        passwordContent={
          <TextField
            onChangeText={text => setValue(text)}
            keyboardType="default"
            label={Translate('Password')}
            labelTextStyle={{fontFamily: Font}}
            titleTextStyle={{fontFamily: Font}}
            affixTextStyle={{fontFamily: Font}}
            secureTextEntry
            error={errorMessage}
            icon={() => <AIcon name="lock1" size={18} color="#2F5CCA" />}
          />
        }
        dismiss={() => {
          setModal(false);
        }}
        quit={() => {
          setModal(false);
          props.navigation.navigate('Home');
        }}
        response={response}
        action={() => {
          sendAmount();
        }}
        title={Translate('Transfer Using QR Code')}
        subtitle={Translate(
          'Please Verify beneficiary account number and the amount',
        )}
        fromAccount={FromAccount}
        toAccount={QRData.account}
        receiverName={QRData.Name}
        loading={loading}
        amount={QRData.Amount}
        currency={Currency}
        isOpen={isModal}
      />
      <Body>
        {IsFocused && !isModal && (
          <QRCodeScanner
            onRead={e => onSuccess(e)}
            showMarker
            reactivate={!isModal}
            reactivateTimeout={5000}
            cameraStyle={{height: height - 245}}
            customMarker={qrError ? <SuccessMarker /> : <ErrorMarker />}
          />
        )}
      </Body>
    </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
