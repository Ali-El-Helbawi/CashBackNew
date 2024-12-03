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
  BackHandler,
  ScrollView,
  Linking,
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
  Orange,
  Yellow,
} from '../assets/colors';
import * as RootNavigation from '../Navigation/RootNavigation';
const Body = styled.View`
  background-color: ${DefaultBackgroundColor};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: 100%;
  overflow: hidden;
`;
const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus iaculis orci, ut lobortis lorem mollis at. Aenean pellentesque dui vel vestibulum tempus. Vestibulum bibendum nibh vitae ipsum eleifend sagittis. Sed at nulla massa. Duis finibus eleifend lacus. Praesent cursus, sapien at pulvinar viverra, metus urna laoreet augue, et laoreet nulla mauris finibus leo. Sed elementum volutpat lorem, in consectetur mi vehicula sit amet. Duis fringilla sagittis ante in finibus. Etiam massa risus, egestas at est nec, mollis vulputate elit. Donec mattis leo sem, non eleifend risus cursus quis. Sed magna enim, scelerisque sit amet iaculis id, porttitor sit amet urna. Cras sed risus felis. Curabitur posuere eros nisi, sit amet pharetra libero finibus ullamcorper.`;
function Deal(props) {
  const [loading, setLoading] = useState(true);
  const item = props?.route?.params?.item ?? {};
  console.log('item');
  console.log(item);
  const {
    userInfo,
    userAccounts,
    subPage,
    setSubPage,
    showHeader,
    setShowHeader,
    fcmToken,
  } = useContext(DataContext);
  React.useEffect(() => {
    const backAction = () => {
      setSubPage('');
      setShowHeader(true);
      RootNavigation.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const userid = props.user.UserId;

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <ScrollView style={{backgroundColor: DefaultBackgroundColor}}>
      <Body>
        {loading ? (
          <Loading backgroundColor="white" />
        ) : (
          <>
            <View
              style={{
                alignContent: 'center',
                alignItems: 'center',
                marginHorizontal: 30,
                backgroundColor: DefaultBackgroundColor,
                marginVertical: 20,
              }}>
              <FastImage
                source={props?.route?.params?.item?.image}
                resizeMode={FastImage.resizeMode.stretch}
                style={{
                  width: width * 0.7,
                  height: width * 0.5,
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              />
              <Text
                style={{
                  fontFamily: Font,
                  color: Orange,
                  paddingTop: 20,
                  fontSize: 16,
                  fontWeight: '800',
                }}
                onPress={() => {
                  Linking.openURL(props?.route?.params?.item?.link);
                }}>
                {' '}
                {props?.route?.params?.item?.link}
              </Text>
              <Text
                style={{
                  fontFamily: Font,
                  color: BlueColor,
                  paddingTop: 20,
                  fontSize: 14,
                  fontWeight: '800',
                }}>
                {description}
              </Text>
            </View>
            {/* <>
                <AnimationContainer>
                  <EmptyData height={300} width={width} />
                </AnimationContainer>
                <EmptyTitle>{Translate('No Data Found')}</EmptyTitle>
              </> */}
          </>
        )}
      </Body>
    </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(Deal);
