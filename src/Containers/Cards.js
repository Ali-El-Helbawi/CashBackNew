import React, {useState, useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import {Button} from '../Components';
import LinearGradient from 'react-native-linear-gradient';
import {parseString} from 'react-native-xml2js';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import axios from 'axios';
import {
  getKeyChain,
  getXmlData,
  Translate,
  EnglishFont,
  Font,
  serverLink,
  updatePayment,
} from '../Helpers';
import {UpdatedAccounts} from '../actions';
import {EmptyData, Loading, VerifyCard} from '../Components';
import CryptoJS from 'react-native-crypto-js';
import {BoxShadow} from 'react-native-shadow';
import {connect} from 'react-redux';
import moment from 'moment';
import ConnectLogo from '../assets/connect.png';
import MadarLogo from '../assets/madar.png';
import LibyanaLogo from '../assets/libyana.png';
import QNetLogo from '../assets/qnet.png';
import DefaultImage from '../assets/a2b-default.png';
import LLTLogo from '../assets/LLT.png';
import {DataContext} from '../context/dataContext';
import FastImage from 'react-native-fast-image';
const {width} = Dimensions.get('window');
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  BackgroundBlue,
  BlueColor,
  DefaultBackgroundColor,
  LightBlue,
  MainButton,
} from '../assets/colors';

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
function getImage(Image) {
  switch (Image) {
    case '1':
      return MadarLogo;
    case '6':
      return ConnectLogo;
    case '4':
      return LLTLogo;
    case '2':
      return LibyanaLogo;
    case '8':
      return QNetLogo;
    default:
      return DefaultImage;
  }
}
const Container = styled.View`
  background-color: ${DefaultBackgroundColor};
`;

const Body = styled.View`
  background-color: ${DefaultBackgroundColor};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: 100%;
  overflow: hidden;
`;

const TopContainer = styled.View``;
const TopContainerList = styled.FlatList.attrs(() => ({
  contentContainerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    paddingRight: 0,
    maxHeight: 90,
  },
}))`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: darkgrey;
`;
const ProviderContainr = styled.TouchableOpacity`
  height: 70px;
  width: 140px;
  background-color: ${BlueColor};
  border-radius: 8px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin-right: 10px;
`;
const ProviderName = styled.Text`
  color: white;
  font-family: ${Font};
`;
const ProviderLogo = styled.View``;

const LogoMask = styled.View`
  width: 48px;
  height: 48px;
  background-color: white;
  border-radius: 60px;
  overflow: hidden;
`;
const Logo = styled.Image`
  width: 100%;
  height: 100%;
`;

const ListContainer = styled.FlatList.attrs(() => ({
  contentContainerStyle: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 20,
  },
  ListHeaderComponentStyle: {
    paddingBottom: 10,
  },
}))``;

const ListItem = styled.TouchableOpacity`
  margin-top: 5px;
  margin-bottom: 2px;
  background-color: ${MainButton};
  border-width: 1px;
  border-color: #cfcfcf;
  border-radius: 8px;
  width: 100%;
  height: 57px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  overflow: hidden;
`;
const BtnTitle = styled.Text`
  color: white;
  font-family: Arial;
  font-size: 18px;
  line-height: 57px;
  text-align: center;
  font-family: ${EnglishFont};
`;
const Indicator = styled.View`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #979797;
  border-radius: 17px;
  width: 17px;
  height: 17px;
  shadow-color: #000;
  shadow-offset: 0px -5px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
  align-items: center;
  justify-content: center;
`;
const Selected = styled.View`
  background-color: #0b0a0a;
  border-radius: 11px;
  shadow-color: #000;
  shadow-offset: 0px -5px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
  width: 11px;
  height: 11px;
`;

const ButtonContainer = styled.View`
  margin-top: 30px;
`;
const Title = styled.Text`
  padding: 10px;
  padding-bottom: 0px;
  text-align: left;
  font-size: 16px;
  font-family: ${Font};
`;
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
  height: 200px;
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
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.23;
  shadow-radius: 2.62px;
  elevation: 4;
`;
const BottomListContainer = styled.View`
  flex: 1;
`;

const additionalStyles = {
  CircleGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    borderRadius: 60,
  },
};
// const [isEvoucher, setEvoucher] = useState({
//   Auth_code: '862806',
//   CleanPIN: '123412340000',
//   Expiry: '2020-01-01',
//   Help: 'To Recharge :press *112*PIN#',
//   Lable: 'MADAR 3 LYD',
//   PIN: 'U2FsdGVkX1+uoJJ7XXsdHNZBpDdvlEPCgvUTAB33Klg=',
//   RRN: '000009864086',
//   RechargeCode: '*112*',
//   STAN: '000024',
//   Serial: '123123123',
//   evoucher_receipt: 'PIN:  this is receipt',
//   response_status: 'Approved',
// });

function Cards(props) {
  const {fcmToken} = useContext(DataContext);

  const [cardsProviders, setCardsProvider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isEvoucher, setEvoucher] = useState(false);
  const [isModal, setModal] = useState(false);
  const [response, setResponse] = useState(false);
  const [ready, setReady] = useState(false);
  const [cards, setCards] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [provider, setProvider] = useState(false);
  const [selectedCard, setSelectedCard] = useState(false);
  const userid = props.user.UserId;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [Props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    function getProvidersList() {
      setLoading(true);
      var keych = '';
      getKeyChain()
        .then(data => {
          if (data) {
            keych = data.password;
          }
        })
        .catch(eRR => {
          console.log(eRR);
        });

      let Timer = setTimeout(() => {
        const sender = userid;
        const ttype = 'getoperators';
        const date = new Date();
        const formattedDate = date.toISOString();
        const formattedDateString = moment(date)
          .utc()
          .format('MMDDYYYYHHmmss')
          .toString();
        const secCode = ttype + formattedDateString + sender;
        const encryptedSecCode = CryptoJS.AES.encrypt(
          secCode,
          `${keych}`,
        ).toString();
        const xmls = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <GenericAPI xmlns="http://tempuri.org/">
              <command>getoperators</command>
              <TransactionDate>${formattedDate}</TransactionDate>
              <UserId>${sender}</UserId>
              <input></input>
              <OTP></OTP>
              <Token></Token>
              <SecurityCode>${encryptedSecCode}</SecurityCode>
            </GenericAPI>
          </soap:Body>
        </soap:Envelope>`;
        axios
          .post(serverLink, xmls, {
            headers: {
              'Content-Length': '255',
              'Content-Type': 'text/xml;charset=UTF-8',
              SOAPAction: 'http://tempuri.org/GenericAPI',
            },
          })
          .then(res => {
            parseString(res.data.toString(), (err, result) => {
              if (err) {
                console.log(err);
              }
              const serverData = getXmlData(result, 'GenericAPI');
              let TimerData = setTimeout(() => {
                if (!serverData.SP_Generic_API_data) {
                  setErrorMessage(Translate('Server Error, Please try again'));
                  setRefresh(false);
                }
              }, 3000);
              if (serverData.ErrorMessage === '') {
                console.log(serverData.SP_Generic_API_data);
                setCardsProvider(serverData.SP_Generic_API_data);
                setRefresh(false);
                setReady(true);
                setLoading(false);
              } else {
                setErrorMessage(serverData.ErrorMessage);
                setLoading(false);
              }
              return () => {
                clearTimeout(TimerData);
              };
            });
          })
          .catch(() => {
            setRefresh(false);
            setError(true);
            setLoading(false);
          });
      }, 2000);
      return () => {
        clearTimeout(Timer);
      };
    }
    getProvidersList();
  }, [userid]);

  function getList(providerName) {
    setListLoading(true);
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
    setTimeout(() => {
      const ttype = 'getdenominations';
      const sender = userid;
      const date = new Date();
      const formattedDate = date.toISOString();
      const formattedDateString = moment(date)
        .utc()
        .format('MMDDYYYYHHmmss')
        .toString();
      const secCode = ttype + providerName + formattedDateString + sender;
      const encryptedSecCode = CryptoJS.AES.encrypt(
        secCode,
        `${keych}`,
      ).toString();
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GenericAPI xmlns="http://tempuri.org/">
      <command>getdenominations</command>
      <TransactionDate>${formattedDate}</TransactionDate>
      <UserId>${sender}</UserId>
      <input>${providerName}</input>
      <OTP></OTP>
      <Token></Token>
      <SecurityCode>${encryptedSecCode}</SecurityCode>
    </GenericAPI>
  </soap:Body>
</soap:Envelope>`;
      axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'http://tempuri.org/GenericAPI',
          },
        })
        .then(res => {
          parseString(res.data.toString(), (err, result) => {
            if (err) {
              console.log(err);
            }
            const serverData = getXmlData(result, 'GenericAPI');
            if (serverData.ErrorMessage === '') {
              setCards(serverData.SP_Generic_API_data);
              setRefresh(false);
              setReady(true);
              setListLoading(false);
            } else {
              setErrorMessage(serverData.ErrorMessage);
              setLoading(false);
            }
          });
        })
        .catch(() => {
          setRefresh(false);
          setError(true);
          setListLoading(false);
        });
    }, 2000);
  }
  function verifyCard() {
    setEvoucher(false);
    setVerifyLoading(true);
    const {defaultAccount, user, accounts} = props;
    const denomination = cards[selectedCard].denomination_description;
    const price = cards[selectedCard].service_price;
    const currency = cards[selectedCard].currency;
    const terminal = cards[selectedCard].terminal_id;
    const merchant = cards[selectedCard].merchant_id;
    const account = accounts[defaultAccount].Pan;

    const sender = user.UserId;
    let arrIn = [
      provider,
      denomination,
      account,
      price,
      currency,
      terminal,
      merchant,
    ];
    arrIn = arrIn.join();
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
    setTimeout(() => {
      const ttype = 'getevoucher';
      const date = new Date();
      const formattedDate = date.toISOString();
      const formattedDateString = moment(date)
        .utc()
        .format('MMDDYYYYHHmmss')
        .toString();
      const secCode = ttype + arrIn + formattedDateString + sender;
      const encryptedSecCode = CryptoJS.AES.encrypt(
        secCode,
        `${keych}`,
      ).toString();
      const xmls = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GenericAPI xmlns="http://tempuri.org/">
          <command>getevoucher</command>
          <TransactionDate>${formattedDate}</TransactionDate>
          <UserId>${sender}</UserId>
          <input>${arrIn}</input>
          <OTP>${
            value !== ''
              ? CryptoJS.AES.encrypt(
                  value,
                  `${userid.substring(userid.length, 6)}${value.padEnd(
                    6,
                    '0',
                  )}`,
                ).toString()
              : ''
          }</OTP>
          <Token></Token>
          <SecurityCode>${encryptedSecCode}</SecurityCode>
        </GenericAPI>
      </soap:Body>
    </soap:Envelope>`;
      console.log(xmls);
      axios
        .post(serverLink, xmls, {
          headers: {
            'Content-Length': '255',
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'http://tempuri.org/GenericAPI',
          },
        })
        .then(res => {
          parseString(res.data.toString(), (err, result) => {
            if (err) {
              console.log(err);
            }
            let serverData = getXmlData(result, 'GenericAPI');
            console.log(serverData);
            if (serverData === 'Confirmed') {
              setVerifyLoading(false);
              setResponse(Translate(serverData));
            } else if (serverData === 'OTP verification') {
              setVerifyLoading(false);
              setResponse(Translate(serverData));
              // setVerifyLoading(false);
              // navigation.navigate('SendAccountVerify', navigation.state.params);
            } else if (serverData.ErrorMessage) {
              setVerifyLoading(false);
              setErrorMessage(serverData.ErrorMessage);
              setResponse(Translate('Payment failed'));
            } else {
              setVerifyLoading(false);
              setEvoucher(serverData.SP_Generic_API_data);
              updatePayment(userid, props.updateAccount, fcmToken);
              // navigation.navigate('CardDone', serverData.SP_Generic_API_data);
            }
          });
        })
        .catch(err => {
          console.error(err); /* eslint-disable-line */
        });
    }, 2000);
  }
  const getSelectedCard = cards[selectedCard];
  return (
    <View style={{backgroundColor: DefaultBackgroundColor}}>
      <VerifyCard
        height={350}
        isOpen={isModal}
        dismiss={() => {
          setEvoucher(false);
          setModal(false);
        }}
        isEvoucher={isEvoucher}
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
        quit={() => {
          setModal(false);
          setEvoucher(false);
          props.navigation.navigate('Home');
        }}
        response={response}
        action={() => {
          verifyCard();
        }}
        title={Translate('Buy E-Voucher')}
        subtitle={Translate('Please verify provider and the amount')}
        provider={getSelectedCard ? getSelectedCard.provider_description : ''}
        denomination={
          getSelectedCard ? getSelectedCard.denomination_description : ''
        }
        loading={verifyLoading}
        price={getSelectedCard ? getSelectedCard.service_price : ''}
      />
      <Body>
        {loading ? (
          <Loading backgroundColor="white" />
        ) : (
          <>
            {cardsProviders.length > 0 ? (
              <>
                {!provider && (
                  <Title>{`${Translate('Please Select Provider')}: `}</Title>
                )}
                <View>
                  <FlatList
                    style={{
                      // width: '100%',
                      borderBottomWidth: 1,
                      borderBottomColor: 'darkgrey',
                      marginBottom: 100,
                    }}
                    contentContainerStyle={{
                      marginBottom: 100,
                      // alignItems: 'center',
                      // flexDirection: 'row',
                      // justifyContent: 'space-between',
                      // padding: 10,
                      //paddingRight: 0,
                      //  maxHeight: 90,
                    }}
                    //horizontal={false}
                    // numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    data={cardsProviders}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() => {
                          // setProvider(item.provider_description);
                          // setSelectedCard(false);
                          // getList(item.provider_description);
                          props.navigation.navigate('CardsDenominations', {
                            provider: item,
                          });
                        }}
                        activeOpacity={0.7}
                        style={[
                          {
                            height: 100,
                            width: width - 20,
                            backgroundColor: BlueColor,
                            borderRadius: 8,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 10,
                            marginVertical: 10,
                            marginHorizontal: 10,
                          },
                          //   item.provider_description == provider && {
                          //   backgroundColor: 'red',
                          //   },
                        ]}>
                        <View>
                          <LinearGradient
                            start={{x: 1, y: 0}}
                            end={{x: 1, y: 1}}
                            colors={[BlueColor, LightBlue]}
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 85,
                              height: 85,
                              borderRadius: 90,
                            }}>
                            <View
                              style={{
                                width: 90,
                                height: 90,
                                backgroundColor: 'white',
                                borderRadius: 90,
                                overflow: 'hidden',
                              }}>
                              <FastImage
                                style={{width: 90, height: 90}}
                                source={{
                                  uri: item.imagesource ? item.imagesource : '',
                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </View>
                          </LinearGradient>
                        </View>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: Font,
                            fontSize: width ? width / 18 : 22,
                            marginRight: 20,
                          }}>
                          {Translate(item.provider_description)}
                        </Text>
                      </TouchableOpacity>
                    )}
                    ListFooterComponent={<View></View>}
                  />
                  {/* <TopContainerList
                   
                  /> */}
                </View>
                {listLoading && <Loading backgroundColor="transparent" />}
              </>
            ) : (
              <>
                <AnimationContainer>
                  <EmptyData height={300} width={width} />
                </AnimationContainer>
                <EmptyTitle>{Translate('No Data Found')}</EmptyTitle>
              </>
            )}
          </>
        )}
      </Body>
    </View>
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
const Styles = StyleSheet.create({
  item: {marginVertical: 5, height: 70},
});
export default connect(mapStateToProps, mapDispatchToProps)(Cards);
