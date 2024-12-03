import React, {useEffect, useContext} from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {connect} from 'react-redux';
import {PopUser, SetTouchID, UpdatedAccounts} from '../actions';
import {Button, YesNoModal, Toast} from '../Components';
import {Translate, Font} from '../Helpers';
import {CommonActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DataContext} from '../context/dataContext';
import axios from 'axios';
import {parseString} from 'react-native-xml2js';
import {serverLink, getXmlData} from '../Helpers';
import * as RootNavigation from '../Navigation/RootNavigation';
import {
  BackgroundColor,
  BlueColor,
  DefaultBackgroundColor,
  LightBlue,
  Orange,
  White,
} from '../assets/colors';
import FastImage from 'react-native-fast-image';
import DealsFlatList from '../Components/DealsFlatList';
import {MokeHomeDeals1, MokeHomeDeals2} from '../Helpers/mockData';
import {useNavigation} from '@react-navigation/native';
const Container = styled.View`
  background-color: #;
  flex: 1;
`;

const Body = styled.View`
  background-color: ${LightBlue};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  align-items: center;

  min-height: 100%;
`;
// const FlatList = styled.FlatList.attrs(() => ({
//   contentContainerStyle: {
//     paddingBottom: 20,
//     padding: 10,
//   },
// }))`
//   width: 100%;
// `;

const Text = styled.Text`
  font-family: ${Font};
  color: white;
`;

const additionalStyles = {
  toast: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.11999999731779099)',
    backgroundColor: '#12307E',
    elevation: 99,
    zIndex: 99999,
  },
};

const Deals = props => {
  const navigation = useNavigation();
  const {
    fcmToken,
    setNotifications,
    userInfo,
    userAccounts,
    subPage,
    setSubPage,
    showHeader,
    setShowHeader,
  } = useContext(DataContext);
  const isMerchant = !(
    userInfo?.isMerchant == 'false' ||
    userInfo?.isMerchant == false ||
    userInfo?.isMerchant == 'False'
  );

  const userid = props.user.UserId;
  useEffect(() => {}, []);

  let ToastMessage;
  const {width, height} = useWindowDimensions();

  return (
    <Container>
      <ImageBackground
        source={null}
        //  source={require('../../assets/BackgroundColor.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          backgroundColor: LightBlue,
        }}>
        <YesNoModal
          isOpen={props.tokenBM.showPopUp && props.tokenBM.isSupported}
          acceptAction={() => props.SetTouchID(true)}
          denyAction={() => props.SetTouchID(false)}
          title={Translate('Allow TouchID for the next Login')}
          subtitle={Translate(
            'When enabled, you can use fingerprint to login. You can still login using password.',
          )}
        />
        <ScrollView
          contentContainerStyle={{
            backgroundColor: LightBlue,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            alignItems: 'center',
            minHeight: '100%',
          }}>
          <ImageBackground
            // source={require('../../assets/BackgroundColor.png')}
            source={null}
            resizeMode="cover"
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              backgroundColor: DefaultBackgroundColor,
            }}>
            <Toast
              ref={ref => (ToastMessage = ref)}
              positionValue={260}
              fadeInDuration={750}
              position="bottom"
              style={additionalStyles.toast}
              fadeOutDuration={1000}
            />

            <View style={{height: 10}}></View>

            <View style={{height: 10}}></View>
            <DealsFlatList
              data={MokeHomeDeals1}
              navigation={navigation}
              setSubPage={setSubPage}
              setShowHeader={setShowHeader}
            />
            {/* <View style={{height: 10}}></View> */}
            <View style={{alignContent: 'center', alignItems: 'center'}}>
              <FastImage
                source={require('../../assets/ads.jpg')}
                resizeMode={FastImage.resizeMode.cover}
                style={{
                  width: width - 0,
                  height: width / 3,
                  marginVertical: 10,
                }}
              />
            </View>
            <DealsFlatList
              data={MokeHomeDeals2}
              navigation={navigation}
              setSubPage={setSubPage}
              setShowHeader={setShowHeader}
            />
            <View style={{alignContent: 'center', alignItems: 'center'}}>
              <FastImage
                source={require('../../assets/ads.jpg')}
                resizeMode={FastImage.resizeMode.cover}
                style={{
                  width: width - 0,
                  height: width / 3,
                  marginVertical: 10,
                }}
              />
            </View>
            <View style={{height: 30}}></View>
          </ImageBackground>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  tokenBM: state.tokenBM,
  userInfo: state.userInfo,
  accounts: state.accounts,
  defaultAccount: state.defaultAccount,
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  onLogout: userdata => {
    dispatch(PopUser(userdata));
  },
  SetTouchID: status => {
    dispatch(SetTouchID(status));
  },
  updateAccount: accounts => {
    dispatch(UpdatedAccounts(accounts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Deals);
// renderItem={({item}) => {
//   if (!item.isVIP || isVIP) {
//     return (
//       <Button
//         title={item.title}
//         onPress={() => {
//           item.navigateTo
//             ? props.navigation.navigate(item.navigateTo)
//             : ToastMessage.show(
//                 <Text>{Translate('Not available')}</Text>,
//               );
//         }}
//         icon={
//           <CustomIcon
//             style={[
//               item.navigateTo === 'Receive'
//                 ? {transform: [{rotateX: '180deg'}]}
//                 : {},
//             ]}
//             item={item}
//             // name={item.icon}
//             // size={item.size || 35}
//             // color="white"
//           />
//         }
//       />
//     );
//   }
// }}
