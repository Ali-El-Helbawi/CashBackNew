import React, {useState, useContext} from 'react';
import styled from 'styled-components/native';
import {Dimensions, I18nManager} from 'react-native';
import {parseString} from 'react-native-xml2js';
import AIcon from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
import {DataContext} from '../context/dataContext';
const {height} = Dimensions.get('window');

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

const Container = styled.View`
  background-color: transparent;
  height: 100%;
`;

const Body = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    width: '100%',
    padding: 15,
    paddingTop: 30,
    backgroundColor: 'transparent',
  },
}))`
  background-color: transparent;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: ${height}px;
`;

const TitleText = styled.Text`
  font-size: 18px;
  text-align: left;
  font-weight: 900;
  color: white;
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

function TransferAccount(props) {
  const {fcmToken} = useContext(DataContext);

  const [isModal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(false);
  const [Amount, setAmount] = useState(0);
  const [ToAccount, setToAccount] = useState('');
  const [AccountHolderNameAr, setAccountHolderNameAr] = useState('');
  const [AccountHolderNameEn, setAccountHolderNameEn] = useState('');
  const [AmountError, setAmountError] = useState('');
  const [AccountError, setAccountError] = useState('');
  const FromAccount = props.accounts[props.defaultAccount].Pan;
  const userid = props.user.UserId;
  const Currency = props.user.Currency;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [Props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  function Validate() {
    const regTest = /^\d+(\.\d{1,2})?$/;
    if (ToAccount.length < 3) {
      setAccountError(Translate('Please enter a valid account'));
      return false;
    } else {
      setAccountError('');
    }
    if (!regTest.test(Amount) || Amount === 0) {
      setAmountError(Translate('Please enter a valid amount'));
      return false;
    } else {
      setAmountError('');
    }
    return true;
  }
  function sendAmount() {
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
      const ttype = 'Transfer';
      const secCode =
        ttype +
        formattedDateString +
        Amount +
        Currency +
        FromAccount +
        ToAccount +
        userid;
      const encryptedSecCode = CryptoJS.AES.encrypt(
        secCode,
        `${keych}`,
      ).toString();
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ConfirmTransactionByUser xmlns="http://tempuri.org/">
      <TransactionType>TransferVIP</TransactionType>
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
      <Receiver></Receiver>
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

  function CheckAccountName() {
    const {user, token} = props;
    const userID = user.UserId;
    setLoading(true);
    const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <CheckAccountName xmlns="http://tempuri.org/">
        <UserId>${userID}</UserId>
        <PAN>${ToAccount}</PAN>
        <Token>${token}</Token>
      </CheckAccountName>
    </soap:Body>
  </soap:Envelope>
      `;
    axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/CheckAccountName',
        },
      })
      .then(res => {
        parseString(res.data.toString(), (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          const serverData = getXmlData(result, 'CheckAccountName');
          if (serverData.ErrorMessage === '') {
            setAccountHolderNameEn(
              serverData.AccountHolder[0].AccountHolderName,
            );
            setAccountHolderNameAr(
              serverData.AccountHolder[0].AccountHolderNameArabic,
            );
            setAccountError(Translate(''));
            setLoading(false);
          } else {
            setError(serverData.ErrorMessage);
            setAccountError(Translate(serverData.ErrorMessage));
            setLoading(false);
          }
        });
      })
      .catch(err => {
        console.error(err); /* eslint-disable-line */
      });
  }
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
        title={Translate('Transfer Using Account Number')}
        subtitle={Translate(
          'Please Verify beneficiary account number and the amount',
        )}
        fromAccount={FromAccount}
        toAccount={ToAccount}
        receiverName={
          I18nManager.isRTL ? AccountHolderNameAr : AccountHolderNameEn
        }
        loading={loading}
        amount={Amount}
        currency={Currency}
        isOpen={isModal}
      />
      <KeyboardAwareScrollView>
        <Body>
          <TitleText>{Translate('Transfer Using Account Number')}:</TitleText>
          <SubtitleText>
            {Translate('Enter beneficiary account number and the amount')}
          </SubtitleText>
          <TextField
            editable={false}
            labelOffset={I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}}
            defaultValue={FromAccount}
            keyboardType="phone-pad"
            label={Translate('From Account')}
            labelTextStyle={{fontFamily: Font}}
            titleTextStyle={{fontFamily: Font}}
            affixTextStyle={{fontFamily: Font}}
            light
            textColor="darkgrey"
            baseColor="darkgrey"
          />
          <TextField
            onChangeText={text => setToAccount(text)}
            keyboardType="phone-pad"
            label={Translate('To Account')}
            labelTextStyle={{fontFamily: Font}}
            titleTextStyle={{fontFamily: Font}}
            affixTextStyle={{fontFamily: Font}}
            error={AccountError}
            labelOffset={I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}}
            light
            textColor="darkgrey"
            baseColor="darkgrey"
          />
          <TextField
            onChangeText={num => setAmount(num)}
            keyboardType="phone-pad"
            prefix={Currency}
            label={Translate('Amount')}
            labelTextStyle={{fontFamily: Font}}
            titleTextStyle={{fontFamily: Font}}
            affixTextStyle={{fontFamily: Font}}
            error={AmountError}
            labelOffset={I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}}
            light
            textColor="darkgrey"
            baseColor="darkgrey"
          />
          <Button
            gold
            onPress={() => {
              if (Validate()) {
                setModal(true);
                CheckAccountName();
              } else {
                return;
              }
            }}
            title={Translate('_Transfer')}
          />
          <ConfirmationText response={response}>
            {Translate(errorMessage)}
          </ConfirmationText>
        </Body>
      </KeyboardAwareScrollView>
    </Container>
  );
}

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

export default connect(mapStateToProps, mapDispatchToProps)(TransferAccount);
