import React, {useState} from 'react';
import {Linking, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import EIcon from 'react-native-vector-icons/Entypo';
import CryptoJS from 'react-native-crypto-js';
import {Platform} from 'react-native';

import {getKeyChain, Translate, Font, EnglishFont} from '../Helpers';
import {Button} from '../Components';
import {SecondBlue} from '../assets/colors';
const {height} = Dimensions.get('window');

const FlatList = styled.FlatList.attrs(() => ({
  contentContainerStyle: {
    paddingTop: 0,
    flexDirection: 'column-reverse',
  },
}))``;

const ModalBody = styled.View`
  background: white;
  border-radius: 8px;
  padding: 20px;
  ${props => (props.height ? `height: ${props.height}px;` : 'height: 400px;')}
`;

const TransactionDetialsRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const CloseButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  background-color: white;
  position: absolute;
  right: 15px;
  top: -15px;
  border-radius: 30px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.23;
  shadow-radius: 2.62px;
  elevation: 2;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;
const TitleText = styled.Text`
  font-size: 18px;
  text-align: left;
  font-weight: 900;
  color: ${SecondBlue}
  text-align: left;
  font-family: ${Font};
`;
const SubtitleText = styled.Text`
  font-size: 14px;
  text-align: center;
  font-weight: 900;
  color: darkgrey;
  text-align: left;
  font-family: ${props => (props.englishFont ? EnglishFont : Font)};
  ${props => (props.bottom ? 'margin-bottom: 20px;' : 'margin-top: 20px;')}
  ${props => (props.label ? 'text-align: center;' : '')}
`;
const DetailsTitle = styled.Text`
  flex: 1;
  padding: 5px;
  text-align: left;
  font-family: ${Font};
  line-height: 20px;
`;
const DetailsValue = styled.Text`
  flex: 1;
  height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  color: #18367f;
  font-weight: 500;
  text-align: left;
  background-color: #01afd21f;
  line-height: 30px;
  border-color: #01afd275;
  border-width: 2px;
  border-radius: 4px;
  font-family: ${props => (props.englishFont ? EnglishFont : Font)};
  ${props =>
    props.center
      ? 'background: transparent;border-color: transparent; margin-top: 10px; margin-bottom: 10px;line-height:40px; font-size:22px; text-align: center;'
      : ''}
`;
const VoucherView = styled.View`
  height: 60px;
  color: #18367f;
  font-weight: 500;
  background-color: #01afd21f;
  border-color: #01afd275;
  border-width: 2px;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const VoucherPin = styled.Text`
  line-height: 55px;
  font-family: ${EnglishFont};
  font-weight: 900;
  color: #18367f;
  font-size: 22px;
  text-align: center;
`;

function EVoucherReceipt({dismiss, isEvoucher}) {
  const [storedKey, setStoredKey] = useState(false);
  const isLink =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
  getKeyChain()
    .then(data => {
      if (data) {
        setStoredKey(data.password);
      }
    })
    .catch(eRR => {
      console.log(eRR);
    });

  function convertToAsc(str1) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }
  const PINc = CryptoJS.AES.decrypt(
    isEvoucher.PIN.toString(),
    `${storedKey}`,
  ).toString();
  const PIN = convertToAsc(PINc);
  const messageBody = isEvoucher.Lable.concat('\n', 'PIN: ', PIN);
  const removed = ['PIN', 'Lable', 'CleanPIN', 'RechargeCode'];
  var spec = Platform.OS === 'android' ? encodeURIComponent('\u0023') : '#';
  const cleanPin = PIN.replace(/-/g, '');
  let code = '';
  if (isEvoucher.RechargeCode) {
    code =
      isEvoucher.RechargeCode.substring(0, 1) === '*'
        ? isEvoucher.RechargeCode.concat(cleanPin, spec)
        : isEvoucher.RechargeCode.concat(cleanPin);
  }
  return (
    <ModalBody height={height - 150}>
      <CloseButton onPress={dismiss}>
        <EIcon name="cross" size={20} color={SecondBlue} />
      </CloseButton>
      <TitleText>{Translate('evoucher_receipt')}:</TitleText>
      <SubtitleText englishFont label>
        {isEvoucher.Lable}
      </SubtitleText>
      <VoucherView>
        <VoucherPin>{PIN}</VoucherPin>
      </VoucherView>
      {code !== '' && (
        <Button
          title={Translate(
            isLink.test(isEvoucher.RechargeCode)
              ? 'Go to website'
              : 'Recharge this Number',
          )}
          onPress={() => {
            Linking.openURL(
              isLink.test(isEvoucher.RechargeCode)
                ? isEvoucher.RechargeCode
                : `tel:${code}`,
            );
          }}
        />
      )}
      <Button
        title={Translate('Send PIN by SMS')}
        onPress={() => {
          // const operator = Platform.select({ios: '&', android: '?'});
          const operator = Platform.OS === 'ios' ? '&' : '?';
          //Linking.openURL(`sms:${operator}body=${messageBody}`);
          Linking.openURL(
            `sms:${operator}body=${encodeURIComponent(messageBody)}`,
          );
        }}
      />
      <SubtitleText>{Translate('evoucher_receipt')}:</SubtitleText>
      <FlatList
        data={Object.keys(isEvoucher)}
        renderItem={({item, index}) => {
          if (!removed.includes(item)) {
            return (
              <TransactionDetialsRow>
                <DetailsTitle>{`${Translate(
                  Object.keys(isEvoucher)[index],
                )}:`}</DetailsTitle>
                <DetailsValue
                  englishFont={
                    Object.keys(isEvoucher)[index] !== 'response_status'
                  }>
                  {Translate(isEvoucher[Object.keys(isEvoucher)[index]])}
                </DetailsValue>
              </TransactionDetialsRow>
            );
          }
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </ModalBody>
  );
}

export default EVoucherReceipt;
