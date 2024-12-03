import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  Dimensions,
  I18nManager,
  Linking,
  PermissionsAndroid,
  Platform,
  View,
  Button as RNButton,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Text,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {parseString} from 'react-native-xml2js';
import axios from 'axios';
import Moment from 'moment';
import {getDataBySection, updatePayment} from '../Helpers';
import {extendMoment} from 'moment-range';
// import DatePicker from 'react-native-datepicker';
import DatePicker from 'react-native-date-picker';
import {showMessage} from 'react-native-flash-message';
import {DataContext} from '../context/dataContext';
import {UpdatedAccounts} from '../actions';

const moment = extendMoment(Moment);

import {
  EmptyData,
  Loading,
  SimpleModal,
  TextField,
  Button,
} from '../Components';
import {
  getXmlData,
  Translate,
  Font,
  EnglishFont,
  serverLink,
  getKeyChain,
} from '../Helpers';
import {connect} from 'react-redux';
import CryptoJS from 'react-native-crypto-js';
import {BackgroundBlue, SecondBlue} from '../assets/colors';

const {width, height} = Dimensions.get('window');

const Container = styled.View`
  background-color: ${BackgroundBlue};
`;

const Body = styled.View`
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding-bottom: 160px;
  min-height: 100%;
  overflow: hidden;
`;

const ActionsContainer = styled.View`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px;
`;
const Action = styled.TouchableOpacity`
  background: #18337c;
  align-items: center;
  justify-content: center;
  padding: 5px;
  width: 30%;
  height: 62px;
  border-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;
const ActionText = styled.Text`
  color: white;
  font-family: ${Font};
  font-weight: 500;
  font-size: 16px;
  text-align: center;
`;
const SectionList = styled.SectionList.attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 110,
  },
}))``;

function ListHeader(props) {
  return (
    <HeaderContainer>
      <Circle />
      <HeaderTitle>{Translate('Transaction History')}</HeaderTitle>
      <HeaderAction onPress={() => props.onPress(true)} activeOpacity={0.7}>
        <FAIcon name="filter" size={18} color="white" />
      </HeaderAction>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.View`
  background: #18337c;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  overflow: hidden;
`;
const FilterHeaderContainer = styled.View`
  background: #18337c;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${width - width * 0.1}px;
  margin-top: -20px;
  height: 50px;
  padding: 10px 20px;
  overflow: hidden;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;

const HeaderTitle = styled.Text`
  color: white;
  font-family: ${Font};
  font-size: 19px;
`;
const HeaderAction = styled.TouchableOpacity`
  width: 37px;
  height: 37px;
  border-radius: 40px;
  align-items: center;
  background: #1f449e;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const TransactionContainer = styled.TouchableOpacity`
  width: 100%;
  height: 80px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom-width: 1px;
  border-color: #e2e2e2;
`;
const TransactionTitle = styled.Text`
  color: #000000;
  font-size: 14px;
  text-align: left;
  font-family: ${Font};
`;
const Circle = styled.View`
  width: 600px;
  height: 600px;
  border-radius: 600px;
  position: absolute;
  right: 20px;
  bottom: -100px;
  background: #01afd2;
  opacity: 0.15;
`;
const TransactionSubtitle = styled.Text`
  color: #7f7f7f;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  text-align: left;
`;
const TransactionAmmount = styled.Text`
  color: #000000;
  font-size: 16px;
  font-weight: 300;
  line-height: 22px;
`;
const TransationTitleContainer = styled.View``;

const EmptyTitle = styled.Text`
  padding: 10px;
  padding-top: 20px;
  color: #18367f;
  text-align: center;
  font-size: 20px;
  font-family: ${Font};
`;

const SectionContainer = styled.View`
  padding: 5px;
  background: #ad;
`;

const SectionText = styled.Text`
  color: white;
  text-align: center;
  font-size: 16px;
  font-family: ${Font};
`;

const AnimationContainer = styled.View`
  width: ${width}px;
  height: 160px;
`;

function TransactionItem(props) {
  const {Amount, Description, TxnSubTitle} = props.item;
  return (
    <TransactionContainer activeOpacity={0.7} onPress={() => props.onPress()}>
      <TransationTitleContainer>
        <TransactionTitle>{props.item['Txn Title']}</TransactionTitle>
        <TransactionSubtitle>{Amount}</TransactionSubtitle>
      </TransationTitleContainer>
      {/* <TransactionAmmount>{Amount}</TransactionAmmount> */}
    </TransactionContainer>
  );
}

const EnglishText = styled.Text`
  font-family: ${EnglishFont};
`;

const ConfirmationText = styled.Text`
  font-size: 16px;
  text-align: center;
  font-weight: 900;
  font-family: ${Font};
  margin-top: 15px;
  ${props => (props.response ? 'color: #00ab66;' : 'color: #ff6562;')}
`;
const FilterRow = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-color: rgba(0, 0, 0, 0.20000000298023224);
  padding: 10px;
  border-bottom-width: 1px;
  margin-top: 5px;
`;
const FilterText = styled.Text`
  font-family: ${Font};
  color: ${SecondBlue};
`;
const SmallText = styled.Text`
  font-family: ${Font};
  font-size: 12px;
  color: ${SecondBlue};
  width: 100%;
  text-align: left;
`;
const Indicator = styled.Text`
  width: 20px;
  height: 20px;
  border-width: 1px;
  border-radius: 10px;
  border-color: #2f5cca;
  text-align: center;
  line-height: 17px;
`;
const ActionButtonsContainer = styled.View`
  width: 100%;
  margin-vertical: 30px;
`;
const CustomDateContainer = styled.View`
  width: 100%;
  margin-top: 40px;
`;
const FilterModalContent = styled.View`
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;
const DateRow = styled.View`
  align-items: center;
  flex-direction: row;
  padding-top: 10px;
`;
const TxnType = styled.Text`
  font-family: ${Font};
  font-size: 18px;
  color: ${SecondBlue};
  text-align: left;
`;
const TxnDate = styled.Text`
  font-family: ${EnglishFont};
  font-size: 16px;
  color: #7f7f7f;
  text-align: left;
`;
const TxnStatus = styled.Text`
  font-family: ${Font};
  font-size: 14px;
  text-align: left;
  color: ${props => (props.status === 'Confirmed' ? '#5cb85c' : '#7f7f7f')};
`;
const TxnAmount = styled.Text`
  font-size: 18px;
  font-family: ${EnglishFont};
  color: ${SecondBlue};
  padding-left: 10px;
  padding-right: 10px;
  height: 35px;
  line-height: 35px;
  background-color: rgba(1, 175, 210, 0.15);
  border-radius: 40px;
`;
const TxnModalBody = styled.View`
  flex-direction: row;
  align-items: center;
`;
const LeftItems = styled.View`
  flex: 1;
`;
const OtherInfoListContainer = styled.View`
  border-radius: 8px;
  border-color: lightgrey;
  border-width: 1px;
  padding: 5px;
  width: 100%;
  height: 220px;
  margin-top: 10px;
`;
const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom-width: 1px;
  border-color: lightgrey;
`;
const FlatList = styled.FlatList``;
const ItemValue = styled.Text``;
const ItemKey = styled.Text`
  font-family: ${Font};
`;

// const additionalStyle = {
//   datePicker: {
//     width: '50%',
//     borderBottomWidth: 1,
//     borderColor: 'darkgrey',
//     borderRadius: 4,
//     height: 30,
//     marginBottom: 10,
//   },
//   modalBtn: {bottom: 0, position: 'absolute'},
// };
function Account(props) {
  const {width, height} = useWindowDimensions();

  const {fcmToken} = useContext(DataContext);
  const today = moment().format('YYYY-MM-DD');
  const beforeOneMonth = moment().subtract(1, 'months').format('YYYY-MM-DD');
  const before6Months = moment().subtract(6, 'months').format('YYYY-MM-DD');
  const beforeOneYear = moment().subtract(1, 'year').format('YYYY-MM-DD');
  const [loading, setLoading] = useState(true);
  const [isDatePickerModal, SetDatePickerModal] = useState(false);
  const [AddLoading, setAddLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fromDate, setFromDate] = useState(beforeOneMonth);
  const [isModal, setModal] = useState(false);
  const [isTransactionModal, setTransactionModal] = useState(false);
  const [activeItem, setActiveItem] = useState({});
  const [toDate, setToDate] = useState(today);
  const [ListData, setListData] = useState([]);
  const [response, setResponse] = useState(false);
  const [tempFrom, setTempFrom] = useState(beforeOneMonth);
  const [tempTo, setTempTo] = useState(today);
  const [selectedRange, setSelectedRange] = useState(0);
  const {user, accounts, defaultAccount} = props;
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [selectedDate1, setSelectedDate1] = useState(Translate('From Date'));
  const [selectedDate2, setSelectedDate2] = useState(Translate('To Date'));
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const Currency = props.user.Currency;

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GetUservwTransactions xmlns="http://tempuri.org/">
        <UserId>${user.UserId}</UserId>
        <AccountType></AccountType>
        <PAN>${accounts[defaultAccount].Pan}</PAN>
        <FromDate>${fromDate}</FromDate>
        <ToDate>${toDate}</ToDate>
        <Token>${fcmToken}</Token>
      </GetUservwTransactions>
    </soap:Body>
  </soap:Envelope>`;

      console.log(xmls);
      await axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'http://tempuri.org/GetUservwTransactions',
          },
        })
        .then(res => {
          parseString(res.data.toString(), (err, result) => {
            if (err) {
              return err;
            }
            const serverData = getXmlData(result, 'GetUservwTransactions');

            if (serverData.ErrorMessage === '') {
              setListData(serverData.vwTransactions.reverse());
              setLoading(false);
            } else {
              setErrorMessage(Translate(serverData.ErrorMessage));
              setLoading(false);
            }
          });
        })
        .catch(() => {
          setLoading(false);
          setErrorMessage(Translate('Something went wrong'));
        });
    };
    getList();
    return () => {
      console.log('componentWillUnmount');
      SetDatePickerModal(false);
      setModal(false);
      setTransactionModal(false);
    };
  }, [accounts, defaultAccount, fromDate, toDate, user.UserId]);
  function validate() {
    const regTest = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
    if (!regTest.test(phone)) {
      setPhoneError(Translate('Please enter a valid phone number'));
      return false;
    } else {
      setPhoneError('');
    }
    if (voucherCode.length < 3) {
      setVoucherError(Translate('Please enter a valid voucher number'));
      return false;
    } else {
      setVoucherError('');
    }
    return true;
  }

  async function exportList(filetype) {
    console.log('exportList');
    const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GetTransactionsFile xmlns="http://tempuri.org/">
        <UserId>${user.UserId}</UserId>
        <FileType>${filetype}</FileType>
        <PAN>${accounts[defaultAccount].Pan}</PAN>
        <AccountType></AccountType>
        <FromDate>${fromDate}</FromDate>
        <ToDate>${toDate}</ToDate>
        <Token>${fcmToken}</Token>
      </GetTransactionsFile>
    </soap:Body>
  </soap:Envelope>`;
    console.log(xmls);
    await axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/GetTransactionsFile',
        },
      })
      .then(res => {
        parseString(res.data.toString(), (err, result) => {
          if (err) {
            console.log(err);
          }
          const serverData = getXmlData(result, 'GetTransactionsFile');
          console.log(serverData);
          if (serverData.ErrorMessage === '') {
            if (filetype === 'pdf') {
              Linking.openURL(serverData.URL[0].FilePath);
            } else {
              showMessage({
                message: Translate('Transactions List Sent'),
                description: Translate('Please check your Email'),
                backgroundColor: '',
                color: 'white',
              });
            }
          } else {
            showMessage({
              message: Translate('Something went wrong'),
              description: Translate(serverData.ErrorMessage),
              backgroundColor: 'darkred',
              color: 'white',
            });
          }
        });
      })
      .catch(cErr => {
        console.log(cErr);
      });
  }
  function addMoney() {
    validate();
    const {token} = props;
    setAddLoading(true);
    const date = new Date();
    const formattedDate = date.toISOString();
    const formattedDateString = moment(date)
      .utc()
      .format('MMDDYYYYHHmmss')
      .toString();
    const secCode =
      formattedDateString + accounts[defaultAccount].Pan + user.UserId;
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
    setTimeout(() => {
      const encrypted = CryptoJS.AES.encrypt(secCode, `${keych}`).toString();
      const encryptedVoucher = CryptoJS.AES.encrypt(
        voucherCode,
        `${keych}`,
      ).toString();
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
                      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                      <soap:Body>
                        <TopUpWallet xmlns="http://tempuri.org/">
                          <UserId>${user.UserId}</UserId>
                          <TransactionDate>${formattedDate}</TransactionDate>
                          <PAN>${accounts[defaultAccount].Pan}</PAN>
                          <PIN>${encryptedVoucher}</PIN>
                          <AdditionalData></AdditionalData>
                          <Token>${token}</Token>
                          <SecurityCode>${encrypted}</SecurityCode>
                        </TopUpWallet>
                      </soap:Body>
                      </soap:Envelope>
                      `;
      axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml',
            SOAPAction: 'http://tempuri.org/TopUpWallet',
          },
        })
        .then(res => {
          parseString(res.data.toString(), (err, result) => {
            if (err) {
              console.log(err);
            }
            const serverData = getXmlData(result, 'TopUpWallet');
            if (serverData.ErrorMessage === '') {
              setAddLoading(false);
              if (serverData.UpdatedAccount) {
                setResponse(serverData.UpdatedAccount[0].NewBalance);
                updatePayment(user.UserId, props.updateAccount, fcmToken);
              } else {
                setErrorMessage(serverData.ErrorMessage);
              }
            } else {
              setAddLoading(false);
              setErrorMessage(serverData.ErrorMessage);
            }
          });
        })
        .catch(err => {
          console.error(err);
        });
    }, 3000);
  }
  function ExportPDF() {
    exportList('pdf');
  }

  function FilterData(list) {
    let newList = list.filter(
      key =>
        key !== 'TxnTitle' &&
        key !== 'TxnSubTitle' &&
        key !== 'Transaction Id' &&
        key !== 'TransactionType' &&
        key !== 'TerminalId' &&
        key !== 'Status' &&
        key !== 'Transaction Date' &&
        key !== 'isReversable',
    );

    return newList;
  }

  return (
    <Container>
      <SimpleModal
        isOpen={isDatePickerModal}
        height={height * 0.85}
        dismiss={() => SetDatePickerModal(false)}
        content={
          <FilterModalContent>
            <FilterHeaderContainer>
              <Circle />
              <HeaderTitle>{Translate('Transaction Date Filter')}</HeaderTitle>
            </FilterHeaderContainer>
            <ActionButtonsContainer>
              <FilterRow
                onPress={() => {
                  setSelectedRange(0);
                  setTempFrom(beforeOneMonth);
                  setTempTo(today);
                }}
                activeOpacity={0.85}>
                <FilterText>{Translate('Last Month Transactions')}</FilterText>
                <Indicator>
                  {selectedRange === 0 && (
                    <FAIcon name="check" size={13} color="#2F5CCA" />
                  )}
                </Indicator>
              </FilterRow>
              <FilterRow
                onPress={() => {
                  setSelectedRange(1);
                  setTempFrom(before6Months);
                  setTempTo(today);
                }}
                activeOpacity={0.85}>
                <FilterText>
                  {Translate('Last 6 Months Transactions')}
                </FilterText>
                <Indicator>
                  {selectedRange === 1 && (
                    <FAIcon name="check" size={13} color="#2F5CCA" />
                  )}
                </Indicator>
              </FilterRow>
              <FilterRow
                onPress={() => {
                  setSelectedRange(2);
                  setTempFrom(beforeOneYear);
                  setTempTo(today);
                }}
                activeOpacity={0.85}>
                <FilterText>{Translate('Last Year Transactions')}</FilterText>
                <Indicator>
                  {selectedRange === 2 && (
                    <FAIcon name="check" size={13} color="#2F5CCA" />
                  )}
                </Indicator>
              </FilterRow>
              <FilterRow
                onPress={() => {
                  setSelectedRange(3);
                }}
                activeOpacity={0.85}>
                <FilterText>{Translate('Choose a date range')}</FilterText>
                <Indicator>
                  {selectedRange === 3 && (
                    <FAIcon name="check" size={13} color="#2F5CCA" />
                  )}
                </Indicator>
              </FilterRow>
            </ActionButtonsContainer>
            {selectedRange === 3 && (
              <CustomDateContainer>
                <SmallText>{Translate('Choose a date range')}</SmallText>
                <DateRow>
                  <TouchableOpacity
                    onPress={() => setOpen1(true)}
                    style={Styles.datePicker}>
                    <Text>{selectedDate1}</Text>
                  </TouchableOpacity>
                  <View style={{width: '10%'}}></View>

                  <DatePicker
                    title={Translate('From Date')}
                    modal
                    mode="date"
                    open={open1}
                    date={date1}
                    confirmText="Select From Date"
                    cancelText="Cancel"
                    textColor="black"
                    onConfirm={date => {
                      const newDate = moment(date).format('YYYY-MM-DD');
                      setSelectedDate1(newDate);
                      setTempFrom(newDate);
                      setOpen1(false);
                      setDate1(date);
                    }}
                    onCancel={() => {
                      setOpen1(false);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setOpen2(true)}
                    style={Styles.datePicker}>
                    <Text>{selectedDate2}</Text>
                  </TouchableOpacity>

                  <DatePicker
                    title={Translate('ُTo Date')}
                    modal
                    confirmText="Select To Date"
                    cancelText="Cancel"
                    mode="date"
                    textColor="black"
                    open={open2}
                    date={date2}
                    onConfirm={date => {
                      const newDate = moment(date).format('YYYY-MM-DD');
                      setSelectedDate2(newDate);
                      setTempTo(newDate);
                      setOpen2(false);
                      setDate2(date);
                    }}
                    onCancel={() => {
                      setOpen2(false);
                    }}
                  />

                  {/* <DatePicker
                    style={Styles.datePicker}
                    date={tempFrom}
                    mode="date"
                    placeholder={Translate('From Date')}
                    format="YYYY-MM-DD"
                    confirmBtnText="Select From Date"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={date => {
                      setTempFrom(date);
                    }}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        textAlign: 'left',
                      },
                      dateText: {
                        alignSelf: 'flex-start',
                        paddingLeft: 15,
                      },
                      placeholderText: {
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        width: '100%',
                        paddingLeft: 5,
                        fontFamily: Font,
                        fontSize: 14,
                        color: 'darkgrey',
                      },
                    }}
                  />
                  <DatePicker
                    style={v.datePicker}
                    date={tempTo}
                    mode="date"
                    placeholder={Translate('ُTo Date')}
                    format="YYYY-MM-DD"
                    confirmBtnText="Select To Date"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={date => setTempTo(date)}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        textAlign: 'left',
                      },
                      dateText: {
                        alignSelf: 'flex-start',
                        paddingLeft: 15,
                      },
                      placeholderText: {
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        width: '100%',
                        paddingLeft: 5,
                        fontFamily: Font,
                        fontSize: 14,
                        color: 'darkgrey',
                      },
                    }}
                  /> */}
                </DateRow>
              </CustomDateContainer>
            )}
            <Button
              onPress={() => {
                setFromDate(tempFrom);
                setToDate(tempTo);
                SetDatePickerModal(false);
              }}
              styles={Styles.modalBtn}
              title={Translate('Show')}
            />
          </FilterModalContent>
        }
      />
      <Body>
        {loading ? (
          <Loading backgroundColor="white" />
        ) : (
          <>
            <SimpleModal
              height={335}
              dismiss={() => setModal(false)}
              isOpen={isModal}
              title={Translate('Add Credit')}
              subtitle={Translate(
                'Enter phone number and voucher number and the amount',
              )}
              content={
                <>
                  <TextField
                    onChangeText={text => setPhone(text)}
                    keyboardType="phone-pad"
                    label={Translate('Mobile Number')}
                    labelTextStyle={{fontFamily: Font}}
                    titleTextStyle={{fontFamily: Font}}
                    affixTextStyle={{fontFamily: Font}}
                    error={phoneError}
                    labelOffset={
                      I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                    }
                  />
                  <TextField
                    onChangeText={text => setVoucherCode(text)}
                    keyboardType="phone-pad"
                    label={Translate('Voucher Number')}
                    labelTextStyle={{fontFamily: Font}}
                    titleTextStyle={{fontFamily: Font}}
                    affixTextStyle={{fontFamily: Font}}
                    error={voucherError}
                    labelOffset={
                      I18nManager.isRTL ? {x0: -10, x1: 0} : {x0: 10, x1: 0}
                    }
                  />
                  <ConfirmationText response={response}>
                    {response ? (
                      <>
                        {`${Translate('Your current blanace is')} `}
                        <EnglishText>{`${response} ${Currency}`}</EnglishText>
                      </>
                    ) : (
                      errorMessage
                    )}
                  </ConfirmationText>
                  <Button
                    secondary
                    disabled={AddLoading}
                    onPress={
                      response
                        ? () => {
                            setModal(false);
                            props.navigation.navigate('Home');
                          }
                        : addMoney
                    }
                    title={
                      response ? Translate('Quit') : Translate('Add Credit')
                    }
                  />
                </>
              }
            />
            <SimpleModal
              height={335}
              dismiss={() => setTransactionModal(false)}
              isOpen={isTransactionModal}
              content={
                <>
                  <TxnModalBody>
                    <LeftItems>
                      <TxnType>
                        {Translate(`_${activeItem['Transaction Type']}`)}
                      </TxnType>
                      <TxnDate>{activeItem['Transaction Date']}</TxnDate>
                      <TxnStatus status={activeItem.Status}>
                        {Translate(activeItem.Status)}
                      </TxnStatus>
                    </LeftItems>
                    <TxnAmount>{activeItem.Amount}</TxnAmount>
                  </TxnModalBody>
                  <OtherInfoListContainer>
                    <FlatList
                      data={FilterData(Object.keys(activeItem))}
                      renderItem={({item}) =>
                        activeItem[item] !== ' ' &&
                        activeItem[item] !== '  ' && (
                          <ListItem>
                            <ItemKey>{Translate(item)}</ItemKey>
                            <ItemValue>{activeItem[item]}</ItemValue>
                          </ListItem>
                        )
                      }
                    />
                  </OtherInfoListContainer>
                </>
              }
            />
            <ActionsContainer>
              <Action onPress={() => setModal(true)} activeOpacity={0.7}>
                <ActionText>{Translate('Add Credit')}</ActionText>
              </Action>
              <Action
                onPress={() => {
                  ExportPDF();
                }}
                activeOpacity={0.7}>
                <ActionText>{Translate('Download PDF File')}</ActionText>
              </Action>
              <Action onPress={() => exportList('email')} activeOpacity={0.7}>
                <ActionText>{Translate('Send Report to Email')}</ActionText>
              </Action>
            </ActionsContainer>
            <ListHeader onPress={SetDatePickerModal} {...props} />

            {ListData.length > 0 && (
              <SectionList
                sections={getDataBySection(ListData)}
                stickyHeaderIndices={[0]}
                stickySectionHeadersEnabled={true}
                keyExtractor={(item, index) => item + index}
                renderItem={(item, index) => {
                  return (
                    <TransactionItem
                      onPress={() => {
                        setTransactionModal(true);
                        setActiveItem(item.item);
                      }}
                      {...item}
                    />
                  );
                }}
                renderSectionHeader={({section: {title}}) => (
                  <SectionContainer>
                    <SectionText>{Translate(title)}</SectionText>
                  </SectionContainer>
                )}
                ListEmptyComponent={() => (
                  <>
                    <AnimationContainer>
                      <EmptyData height={200} width={width} />
                    </AnimationContainer>
                    <EmptyTitle>{Translate('No Data Found')}</EmptyTitle>
                  </>
                )}
              />
            )}
          </>
        )}
      </Body>
    </Container>
  );
}

const mapStateToProps = state => ({
  user: state.user,
  defaultAccount: state.defaultAccount,
  accounts: state.accounts,
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  updateAccount: accounts => {
    dispatch(UpdatedAccounts(accounts));
  },
});
const Styles = StyleSheet.create({
  datePicker: {
    width: '45%',
    borderBottomWidth: 1,
    borderColor: 'darkgrey',
    borderRadius: 4,
    height: 30,
    marginBottom: 10,
  },
  modalBtn: {bottom: 0, position: 'absolute'},
});
export default connect(mapStateToProps, mapDispatchToProps)(Account);
