import React from 'react';
import {Dimensions, Text, View, Image} from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import {Button} from './index';
import EIcon from 'react-native-vector-icons/Entypo';

import {Translate, Font, EnglishFont} from '../Helpers';
import EVoucherReceipt from './evoucherContent';
import {SecondBlue} from '../assets/colors';

const {width} = Dimensions.get('window');

const ModalBody = styled.View`
  background: white;
  border-radius: 8px;
  padding: 20px;
  ${props => (props.height ? `height: ${props.height}px;` : 'height: 400px;')}
`;
const SucessModalBody = styled.View`
  background: white;

  ${props => (`height: ${props.height}px;`, `width: ${props.width}px;`)};
`;
const ButtonContainer = styled.View`
  margin-top: 50px;
  position: absolute;
  bottom: 10px;
  width: ${width - width * 0.1 - 20}px;
  left: 10px;
`;

const TransactionDetialsRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
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
const EmptyView = styled.View``;
const ConfirmationText = styled.Text`
  font-size: 16px;
  text-align: center;
  font-weight: 900;
  font-family: ${Font};
  margin-top: 25px;
  ${props =>
    props.response === 'Confirmed' ? 'color: #00ab66;' : 'color: #ff6562;'}
`;
const RowContainr = styled.View`
  flex-direction: row;
  width: 100%;
`;

function getTitle(title, response) {
  switch (response) {
    case 'OTP verification':
      return Translate('Verification');
    case 'password verification':
      return Translate('Verification');
    default:
      return title;
  }
}
function getSubtitle(subtitle, response) {
  switch (response) {
    case 'OTP verification':
      return Translate('VerifySubtitle');
    case 'password verification':
      return Translate('Please enter your password to verify this transaction');
    default:
      return subtitle;
  }
}

function VerifyModal({
  action,
  dismiss,
  isOpen,
  title,
  subtitle,
  fromAccount,
  toAccount,
  receiverName,
  amount,
  currency,
  loading,
  response,
  quit,
  otpContent,
  passwordContent,
}) {
  return (
    <Modal
      useNativeDriver={true}
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      animationIn="fadeIn"
      isVisible={isOpen}>
      <ModalBody>
        <CloseButton onPress={dismiss}>
          <EIcon name="cross" size={20} color={SecondBlue} />
        </CloseButton>
        <TitleText>{getTitle(title, response)}:</TitleText>
        <SubtitleText>{getSubtitle(subtitle)}</SubtitleText>
        {response === 'password verification' ? (
          passwordContent
        ) : response === 'OTP verification' ? (
          otpContent
        ) : (
          <>
            <TransactionDetialsRow>
              <DetailsTitle>{Translate('From')}:</DetailsTitle>
              <DetailsValue englishFont>{fromAccount}</DetailsValue>
            </TransactionDetialsRow>
            <TransactionDetialsRow>
              <DetailsTitle>{Translate('To')}:</DetailsTitle>
              <DetailsValue englishFont>{toAccount}</DetailsValue>
            </TransactionDetialsRow>
            {receiverName ? (
              <TransactionDetialsRow>
                <DetailsTitle>{Translate('Receiver Name')}:</DetailsTitle>
                <DetailsValue>{`${receiverName}`}</DetailsValue>
              </TransactionDetialsRow>
            ) : (
              <EmptyView />
            )}
            <TransactionDetialsRow>
              <DetailsTitle>{Translate('Amount')}:</DetailsTitle>
              <DetailsValue englishFont>{`${amount} ${currency}`}</DetailsValue>
            </TransactionDetialsRow>
          </>
        )}
        <ConfirmationText response={response}>
          {Translate(response)}
        </ConfirmationText>
        <ButtonContainer>
          <Button
            disabled={loading}
            secondary
            onPress={
              response
                ? response === 'OTP verification' ||
                  response === 'password verification'
                  ? action
                  : quit
                : loading
                ? () => {}
                : action
            }
            title={Translate(
              response
                ? response === 'OTP verification' ||
                  response === 'password verification'
                  ? '_Transfer'
                  : 'Quit'
                : loading
                ? 'Loading'
                : '_Transfer',
            )}
          />
        </ButtonContainer>
      </ModalBody>
    </Modal>
  );
}
function CompleteCashBack({
  handleOnPress,
  CashbackPrecentage,

  ReceivedAmount,
  loading,
  width,
  height,
  SentTOCustomerAmount,
  Currency,
}) {
  const detailsStyle = {
    // flex: 1,
    padding: 5,
    textAlign: 'center',
    fontFamily: Font,
    justifyContent: 'center',
    lineHeight: 20,
  };
  return (
    <SucessModalBody height={height} width={width}>
      <Text
        style={{
          fontSize: 18,
          textAlign: 'center',
          fontWeight: 900,
          // color: {SecondBlue},
          fontFamily: Font,
          justifyContent: 'center',
          marginTop: 10,
        }}>
        {Translate('Succesfull')}
      </Text>

      <View
        style={{justifyContent: 'center', flexDirection: 'row', marginTop: 20}}>
        <Text style={detailsStyle}>{Translate('ReceivedAmount')}</Text>
        <Text style={detailsStyle}>{ReceivedAmount + ' ' + Currency}</Text>
      </View>
      <View
        style={{justifyContent: 'center', flexDirection: 'row', marginTop: 0}}>
        <Text style={detailsStyle}>{Translate('SentTOCustomerAmount')}</Text>
        <Text style={detailsStyle}>
          {SentTOCustomerAmount + ' ' + Currency}
        </Text>
      </View>
      <View
        style={{justifyContent: 'center', flexDirection: 'row', marginTop: 0}}>
        <Text style={detailsStyle}>{Translate('CashbackPrecentage')}</Text>
        <Text style={detailsStyle}>{CashbackPrecentage + ' ' + '%'}</Text>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',

          marginTop: 20,
        }}>
        <Image
          source={require('../../assets/checkmark.png')}
          style={{
            width: 80,
            height: 80,
            borderRadius: 80,
          }}
        />
      </View>
      <View style={{paddingHorizontal: 50, marginTop: 50}}>
        <Button
          disabled={loading}
          secondary
          onPress={handleOnPress}
          title={Translate('NextStep')}
        />
      </View>
      {/* </SucessButtonContainer> */}
    </SucessModalBody>
    // </Modal>
  );
}
function VerifyCard({
  action,
  dismiss,
  isOpen,
  title,
  subtitle,
  provider,
  denomination,
  price,
  loading,
  response,
  quit,
  height,
  isEvoucher,
}) {
  return (
    <Modal
      useNativeDriver={true}
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      animationIn="fadeIn"
      isVisible={isOpen}>
      {isEvoucher ? (
        <EVoucherReceipt dismiss={dismiss} isEvoucher={isEvoucher[0]} />
      ) : (
        <ModalBody height={height}>
          <CloseButton onPress={dismiss}>
            <EIcon name="cross" size={20} color={SecondBlue} />
          </CloseButton>
          <TitleText>{title}:</TitleText>
          <SubtitleText>{subtitle}</SubtitleText>
          <TransactionDetialsRow>
            <DetailsTitle>{Translate('Provider')}:</DetailsTitle>
            <DetailsValue>{provider}</DetailsValue>
          </TransactionDetialsRow>
          <TransactionDetialsRow>
            <DetailsTitle>{Translate('Denomination')}:</DetailsTitle>
            <DetailsValue>{denomination}</DetailsValue>
          </TransactionDetialsRow>
          <TransactionDetialsRow>
            <DetailsTitle>{Translate('Price')}:</DetailsTitle>
            <DetailsValue englishFont>{price}</DetailsValue>
          </TransactionDetialsRow>
          <ConfirmationText response={response}>
            {Translate(response)}
          </ConfirmationText>
          <ButtonContainer>
            <Button
              disabled={loading}
              secondary
              onPress={response ? quit : loading ? () => {} : action}
              title={Translate(
                response ? 'Quit' : loading ? 'Loading' : '_Transfer',
              )}
            />
          </ButtonContainer>
        </ModalBody>
      )}
    </Modal>
  );
}

function SimpleModal({dismiss, isOpen, title, subtitle, content, height}) {
  return (
    <Modal
      useNativeDriver={true}
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      animationIn="fadeIn"
      isVisible={isOpen}>
      <ModalBody height={height}>
        <CloseButton onPress={dismiss}>
          <EIcon name="cross" size={20} color={SecondBlue} />
        </CloseButton>
        {title && <TitleText>{title}:</TitleText>}
        {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
        {content}
      </ModalBody>
    </Modal>
  );
}

function YesNoModal({
  dismiss,
  isOpen,
  title,
  subtitle,
  content,
  height,
  acceptAction,
  denyAction,
}) {
  return (
    <Modal
      useNativeDriver={true}
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      animationIn="fadeIn"
      isVisible={isOpen}>
      <ModalBody height={height || 190}>
        <CloseButton onPress={dismiss}>
          <EIcon name="cross" size={20} color="" />
        </CloseButton>
        <TitleText>{title}:</TitleText>
        <SubtitleText>{subtitle}</SubtitleText>
        <RowContainr>
          <Button
            styles={{width: '50%', marginRight: '5%'}}
            onPress={acceptAction}
            title={Translate('Yes')}
          />
          <Button
            styles={{width: '45%'}}
            onPress={denyAction}
            secondary
            title={Translate('No')}
          />
        </RowContainr>
      </ModalBody>
    </Modal>
  );
}

export {VerifyModal, YesNoModal, SimpleModal, VerifyCard, CompleteCashBack};
