import React, {useState, useContext, useEffect} from 'react';
import styled from 'styled-components/native';
import {I18nManager, View} from 'react-native';
import {Button, Lock} from '../Components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import {parseString} from 'react-native-xml2js';
import {BoxShadow} from 'react-native-shadow';
import {DataContext} from '../context/dataContext';
import {getUniqueId} from 'react-native-device-info';
import Loading from '../Components';
import {
  getXmlData,
  serverLink,
  Font,
  EnglishFont,
  Translate,
  convertToAsc,
  setKeyChain,
} from '../Helpers';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;
const Container = styled.ScrollView`
  padding: 20px;
  background-color: white;
  flex: 1;
`;
// const Container = styled.ScrollView.attrs(() => ({
//   contentContainerStyle: {
//     padding: 20,
//     marginTop: 60,
//   },
// }))`
//   flex: 1;
// `;

const Title = styled.Text`
  text-align: center;
  font-size: 30px;
  padding-bottom: 20px;
  color: #12307e;
  font-family: ${Font};
`;

const SubText = styled.Text`
  text-align: center;
  font-size: 15px;
  padding-bottom: 20px;
  color: darkgrey;
  font-family: ${Font};
`;
const ErrorText = styled.Text`
  text-align: center;
  font-size: 15px;
  padding-bottom: 20px;
  color: red;
  font-family: ${Font};
`;
const LockContainer = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

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

const shadowOpt = {
  width: 50,
  height: 50,
  border: 8,
  radius: 0,
  opacity: 0.1,
  x: 0,
  y: 0,
  style: {marginVertical: 0, borderRadius: 8},
};

const additionalStyle = {
  CodeField: {marginTop: 20, marginBottom: 20},
  Button: {marginTop: 20},
  anitmation: {height: 100},
};
const CELL_COUNT = 6;

const VerifyScreen = props => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [Props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  async function VerifyUser() {
    setLoading(true);
    const deviceID = await getUniqueId();
    const keyChain = value;
    const encryptedOtp = CryptoJS.AES.encrypt(
      value,
      `${deviceID.toString().substring(0, 6).padStart(6)}${value
        .toString()
        .substring(0, 6)
        .padStart(6)}${
        props.route && props.route.params.toString().substring(0, 6).padStart(6)
      }${keyChain}`,
    ).toString();
    const xmls = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <VerifyUser xmlns="http://tempuri.org/">
              <Phone>${props.route && props.route.params}</Phone>
              <VerificationCode>${encryptedOtp}</VerificationCode>
            </VerifyUser>
          </soap:Body>
        </soap:Envelope>

          `;
    console.log(xmls);
    await axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/VerifyUser',
        },
      })
      .then(res => {
        parseString(res.data.toString(), function VerifyUserData(err, result) {
          if (err) {
            setLoading(false);
            console.log(err);
            return;
          }
          const serverData = getXmlData(result, 'VerifyUser');
          console.log('serverData');
          if (serverData.ErrorMessage === '') {
            console.log(serverData);
            const decrypted = CryptoJS.AES.decrypt(
              serverData.TableKeyRow.EKY.toString(),
              `${deviceID.toString().substring(0, 6).padStart(6)}${keyChain
                .toString()
                .substring(0, 6)
                .padStart(6)}${props.route.params
                .toString()
                .substring(0, 6)
                .padStart(6)}${keyChain}`,
            ).toString();
            const plain = convertToAsc(decrypted);
            setKeyChain(plain);
            AsyncStorage.setItem('@BCD:verified', JSON.stringify(true)).catch(
              errM => {
                //  this.showAlert('Error', errM.message)
              },
            );
            AsyncStorage.setItem('mobile', props.route.params).catch(errM => {
              //  this.showAlert('Error', errM.message)
            });
            console.log('parrr', props.route.params);
            setLoading(false);
            props.navigation.navigate('Auth');
          } else {
            setLoading(false);
            setErrorMessage(Translate(serverData.ErrorMessage));
          }
        });
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
      });
  }
  return (
    <SafeAreaContainer>
      <Container>
        {/* {loading && <Loading backgroundColor="#5d5d5d4d" />} */}
        <Title>{Translate('Verification')}</Title>
        <LockContainer>
          <Lock extraStyle={additionalStyle.anitmation} />
        </LockContainer>
        <SubText>{Translate('VerifySubtitle')}</SubText>
        <View style={{paddingHorizontal: 20}}>
          <CodeField
            ref={ref}
            {...Props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={{
              ...additionalStyle.CodeField,
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            }}
            keyboardType="phone-pad"
            renderCell={({index, symbol, isFocused}) => (
              <BoxShadow setting={shadowOpt} key={index}>
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
        </View>
        {errorMessage.length > 0 && <ErrorText>{errorMessage}</ErrorText>}
        <Button
          disabled={loading}
          styles={additionalStyle.Button}
          onPress={() => VerifyUser()}
          title={Translate('Verify')}
        />
      </Container>
    </SafeAreaContainer>
  );
};

export default VerifyScreen;
