import React, {useState} from 'react';
import {Dimensions, I18nManager, ImageBackground, View} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Font, Translate} from '../Helpers';
import {TextField, Button, SimpleModal} from '../Components';
import {connect} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import {
  BackgroundBlue,
  BackgroundColor,
  DefaultBackgroundColor,
  SecondBlue,
} from '../assets/colors';

const {height} = Dimensions.get('window');

const Container = styled.View`
  background-color: ${DefaultBackgroundColor};
  height: 100%;
`;

const Body = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    width: '100%',
    // padding: 15,
    // paddingTop: 30,
    flexGrow: 1,
  },
}))`
  background-color: ${DefaultBackgroundColor};
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
const QRContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
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

function QRcode(props) {
  const [Amount, setAmount] = useState(0);
  const [AmountError, setAmountError] = useState('');
  const [QR, showQR] = useState(false);
  const Currency = props.user.Currency;
  const FullName = props.user.FullName;
  const Account = props.accounts[props.defaultAccount].Pan;

  function Validate() {
    const regTest = /^\d+(\.\d{1,2})?$/;
    if (!regTest.test(Amount) || Amount === 0) {
      setAmountError(Translate('Please enter a valid amount'));
      return false;
    } else {
      setAmountError('');
    }
    return true;
  }
  const DATA = `{"Amount": "${Amount}","userid": "${props.user.UserId}","account": "${Account}","Currency": "${Currency}","Name":"${FullName}"}`;
  return (
    <Container>
      <SimpleModal
        title={Translate('Receive Using QR Code')}
        subtitle={`${Translate('Selected amount')} ${Amount} ${Currency}`}
        dismiss={() => showQR(false)}
        isOpen={QR}
        content={
          <QRContainer>
            <QRCode
              value={DATA.toString()}
              size={200}
              backgroundColor="transparent"
            />
          </QRContainer>
        }
      />
      <KeyboardAwareScrollView>
        <Body>
          <ImageBackground
            // source={require('../../assets/BackgroundColor.png')}
            resizeMode="cover"
            style={{
              flex: 1,
              // height: '100%',
              //  width: '100%',
              flexGrow: 1,
              padding: 15,
              paddingTop: 30,
              backgroundColor: DefaultBackgroundColor,
            }}>
            <TitleText>{Translate('Receive Using QR Code')}:</TitleText>
            <SubtitleText>{Translate('Please enter the amount')}</SubtitleText>
            <TextField
              onChangeText={num => setAmount(num)}
              keyboardType="phone-pad"
              prefix={Currency}
              label={Translate('Amount')}
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
                  showQR(true);
                } else {
                  return;
                }
              }}
              title={Translate('Show QR Code')}
            />
          </ImageBackground>
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

export default connect(mapStateToProps)(QRcode);
