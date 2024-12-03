import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Modal from 'react-native-modal';
import {
  Dimensions,
  I18nManager,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {parseString} from 'react-native-xml2js';
import axios from 'axios';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
// import DatePicker from 'react-native-datepicker';
import DatePicker from 'react-native-date-picker';
import {showMessage} from 'react-native-flash-message';
import ConnectLogo from '../assets/connect.png';
import MadarLogo from '../assets/madar.png';
import LibyanaLogo from '../assets/libyana.png';
import LLTLogo from '../assets/LLT.png';
import {DataContext} from '../context/dataContext';
import {UpdatedAccounts} from '../actions';

const moment = extendMoment(Moment);

import {
  EVoucherReceipt,
  EmptyData,
  Loading,
  SimpleModal,
  Button,
} from '../Components';
import {
  createEVPDF,
  getXmlData,
  Translate,
  Font,
  EnglishFont,
  serverLink,
  getKeyChain,
} from '../Helpers';
import {connect} from 'react-redux';
import {
  BackgroundBlue,
  DefaultBackgroundColor,
  SecondBlue,
} from '../assets/colors';

function getImage(Image) {
  switch (Image) {
    case 'MADAR':
      return MadarLogo;
    case 'Connect':
      return ConnectLogo;
    case 'LLT':
      return LLTLogo;
    case 'Libyana':
      return LibyanaLogo;
    default:
      return ConnectLogo;
  }
}

const {width, height} = Dimensions.get('window');

const Container = styled.View`
  background-color: ${DefaultBackgroundColor};
`;
const ListOfEVouchers = styled.FlatList.attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 120,
  },
}))``;

const Body = styled.View`
  background-color: ${DefaultBackgroundColor};
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
  width: 48.5%;
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

function ListHeader(props) {
  return (
    <HeaderContainer>
      <Circle />
      <HeaderTitle>{Translate('Cards History')}</HeaderTitle>
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
  font-family: ${EnglishFont};
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
  font-family: ${EnglishFont};
`;
const Logo = styled.Image`
  width: 60px;
  height: 60px;
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

const AnimationContainer = styled.View`
  width: ${width}px;
  height: 160px;
`;

function EvoucherItem(props) {
  const {Lable, Transaction_Date, Provider} = props.item;
  // console.log(props);
  return (
    <TransactionContainer activeOpacity={0.7} onPress={() => props.onPress()}>
      <TransationTitleContainer>
        <TransactionTitle>{Lable}</TransactionTitle>
        <TransactionSubtitle>{Transaction_Date}</TransactionSubtitle>
      </TransationTitleContainer>
      <Logo source={getImage(Provider)} />
    </TransactionContainer>
  );
}

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
`;

const additionalStyle = {
  datePicker: {
    width: '50%',
    borderBottomWidth: 1,
    borderColor: 'darkgrey',
    borderRadius: 4,
    height: 30,
    marginBottom: 10,
  },
  modalBtn: {bottom: 0, position: 'absolute'},
};
function Account(props) {
  const {fcmToken} = useContext(DataContext);
  const today = moment().format('YYYY-MM-DD');
  const beforeOneMonth = moment().subtract(1, 'months').format('YYYY-MM-DD');
  const before6Months = moment().subtract(6, 'months').format('YYYY-MM-DD');
  const beforeOneYear = moment().subtract(1, 'year').format('YYYY-MM-DD');
  const [loading, setLoading] = useState(true);
  const [isDatePickerModal, SetDatePickerModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fromDate, setFromDate] = useState(beforeOneMonth);
  const [isTransactionModal, setTransactionModal] = useState(false);
  const [activeItem, setActiveItem] = useState({});
  const [toDate, setToDate] = useState(today);
  const [ListData, setListData] = useState([]);
  const [tempFrom, setTempFrom] = useState('');
  const [tempTo, setTempTo] = useState('');
  const [selectedRange, setSelectedRange] = useState(0);
  const {user, accounts, defaultAccount} = props;
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [selectedDate1, setSelectedDate1] = useState(Translate('From Date'));
  const [selectedDate2, setSelectedDate2] = useState(Translate('To Date'));
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  useEffect(() => {
    function getList() {
      setLoading(true);
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GetUservwTransactions xmlns="http://tempuri.org/">
        <UserId>${user.UserId}</UserId>
        <AccountType>evoucher</AccountType>
        <PAN>${accounts[defaultAccount].Pan}</PAN>
        <FromDate>${fromDate}</FromDate>
        <Token>${fcmToken}</Token>
        <ToDate>${toDate}</ToDate>
      
      </GetUservwTransactions>
    </soap:Body>
  </soap:Envelope>`;

      axios
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
            console.log('serverData');
            console.log(serverData);
            if (serverData.ErrorMessage === '') {
              setListData(serverData.vwTransactions.reverse());
              setLoading(false);
            } else {
              setErrorMessage(Translate(serverData.ErrorMessage));
            }
          });
        })
        .catch(() => {
          setErrorMessage(Translate('Something went wrong'));
        });
    }
    getList();
    return () => {
      console.log('componentWillUnmount');
      SetDatePickerModal(false);
      setTransactionModal(false);
    };
  }, [accounts, defaultAccount, fromDate, toDate, user.UserId]);

  function exportList(filetype) {
    const {token} = props;
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
        <Token>${token}</Token>
      </GetTransactionsFile>
    </soap:Body>
  </soap:Envelope>`;
    axios
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
  function ExportPDF() {
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'A2B External Storage Write Permission',
            message: 'A2B App needs access to Storage data in your SD Card ',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //If WRITE_EXTERNAL_STORAGE Permission is granted
          //changing the state to show Create PDF option
          getKeyChain()
            .then(data => {
              if (data) {
                createEVPDF({
                  key: data.password,
                  list: ListData,
                  fromDate,
                  toDate,
                  user,
                });
              }
            })
            .catch(eRR => {
              console.log(eRR);
            });
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        alert('Write permission err', err);
      }
    }
    //Calling the External Write permission function
    if (Platform.OS === 'android') {
      requestExternalWritePermission();
    } else {
      getKeyChain()
        .then(data => {
          if (data) {
            createEVPDF({
              key: data.password,
              list: ListData,
              fromDate,
              toDate,
              user,
            });
          }
        })
        .catch(eRR => {
          console.log(eRR);
        });
    }
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
                    style={additionalStyle.datePicker}
                    date={tempFrom}
                    mode="date"
                    placeholder={Translate('From Date')}
                    format="YYYY-MM-DD"
                    confirmBtnText="Select From Date"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={date => setTempFrom(date)}
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
                    style={additionalStyle.datePicker}
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
              styles={additionalStyle.modalBtn}
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
            <Modal
              useNativeDriver={true}
              animationOut="fadeOut"
              backdropTransitionOutTiming={0}
              animationIn="fadeIn"
              isVisible={isTransactionModal}>
              <EVoucherReceipt
                dismiss={() => setTransactionModal(false)}
                isEvoucher={activeItem}
              />
            </Modal>
            <ActionsContainer>
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
            <ListOfEVouchers
              data={ListData}
              keyExtractor={(item, index) => item + index}
              renderItem={(item, index) => (
                <EvoucherItem
                  onPress={() => {
                    setTransactionModal(true);
                    setActiveItem(item.item);
                  }}
                  {...item}
                />
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
