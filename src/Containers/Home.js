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

const CustomIcon = ({item, style, iconColor}) => {
  const {size, icon} = item;

  const itemSize = size || 35;
  const color = iconColor;
  if (icon == 'calculator') {
    return (
      <Ionicons
        name="calculator-outline"
        color={color}
        size={itemSize}
        style={style}
      />
    );
  } else if (icon == 'money') {
    return (
      <FontAwesome5
        name="money-check-alt"
        color={color}
        size={itemSize}
        style={style}
      />
    );
  } else if (icon == 'card') {
    return (
      <FontAwesome
        name="credit-card"
        color={color}
        size={itemSize}
        style={style}
      />
    );
  } else if (icon == 'vip') {
    return (
      <MaterialCommunityIcons
        name="podium-gold"
        color={color}
        size={itemSize}
        style={style}
      />
    );
  } else if (icon == 'map-marker') {
    return (
      <FontAwesome5
        name="map-marked-alt"
        color={color}
        size={itemSize}
        style={style}
      />
    );
  } else if (icon == 'account-balance') {
    return (
      <MaterialIcons
        name="account-balance"
        color={color}
        size={itemSize}
        style={style}
      />
    );
  } else if (icon == 'Services') {
    return (
      <MaterialIcons
        name="miscellaneous-services"
        color={color}
        size={itemSize}
        style={style}
      />
    );
  } else if (icon == 'list') {
    return (
      <MaterialIcons
        name="filter-list-alt"
        color={color}
        size={itemSize}
        style={style}
      />
    );
  }
};
const Home = props => {
  const {
    fcmToken,
    setNotifications,
    userInfo,
    setSubPage,

    setShowHeader,
  } = useContext(DataContext);

  const isMerchant = !(
    userInfo?.isMerchant == 'false' ||
    userInfo?.isMerchant == false ||
    userInfo?.isMerchant == 'False'
  );

  const navigationButtons = isMerchant
    ? [
        {
          title: Translate('CashBack'),
          navigateTo: 'CashBack',
          icon: 'calculator',
        },
        {
          title: Translate('Account'),
          navigateTo: 'Account',
          icon: 'account-balance',
        },
        {
          title: Translate('Transfer'),
          navigateTo: 'Transfer',
          icon: 'money',
        },
        {
          title: Translate('Receive'),
          navigateTo: 'Receive',
          icon: 'money',
        },
        {
          title: Translate('Cards'),
          navigateTo: 'Cards',
          icon: 'card',
        },
        {
          title: Translate('Cards History'),
          navigateTo: 'Cards History',
          icon: 'card',
        },

        // {
        //   title: Translate('VIP'),
        //   navigateTo: 'VIP',
        //   icon: 'vip',
        //   isVIP: true,
        // },
        {
          title: Translate('Agents'),
          navigateTo: 'Agents',
          icon: 'map-marker',
          size: 28,
        },
        {
          title: Translate('BalanceList'),
          navigateTo: 'BalanceList',
          icon: 'list',
          size: 28,
        },
        {
          title: Translate('Services'),
          navigateTo: 'ServicesStack',
          icon: 'Services',
          size: 28,
        },
      ]
    : [
        {
          title: Translate('Account'),
          navigateTo: 'Account',
          icon: 'calculator',
        },
        {
          title: Translate('Transfer'),
          navigateTo: 'Transfer',
          icon: 'money',
        },
        {
          title: Translate('Receive'),
          navigateTo: 'Receive',
          icon: 'money',
        },
        {
          title: Translate('Cards'),
          navigateTo: 'Cards',
          icon: 'card',
        },
        // {
        //   title: Translate('VIP'),
        //   navigateTo: 'VIP',
        //   icon: 'vip',
        //   isVIP: true,
        // },
        {
          title: Translate('Agents'),
          navigateTo: 'Agents',
          icon: 'map-marker',
          size: 28,
        },
        {
          title: Translate('BalanceList'),
          navigateTo: 'BalanceList',
          icon: 'list',
          size: 28,
        },
        {
          title: Translate('Services'),
          navigateTo: 'ServicesStack',
          icon: 'Services',
          size: 28,
        },
      ];
  function updatePayment(userID, action, fcmToken) {
    const xmls = `<?xml version="1.0" encoding="utf-8"?>
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                      <CheckBalance xmlns="http://tempuri.org/">
                      <UserId>${userID}</UserId>
                      <FCMtoken>${fcmToken}</FCMtoken>
                    </CheckBalance>
                    </soap:Body>
                    </soap:Envelope>
                    `;
    axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/CheckBalance',
        },
      })
      .then(res => {
        parseString(res.data.toString(), (err, result) => {
          if (err) {
            console.log(err);
          }
          const serverData = getXmlData(result, 'CheckBalance');

          setNotifications(serverData['UserNotifications']);
          if (serverData.ErrorMessage === '') {
            for (var i = 0; i < serverData.Accounts.length; i++) {
              if (serverData.Accounts[i].Balance === '-999999999') {
                serverData.Accounts[i].Balance = 'Variables.notAvailable';
                serverData.Accounts[i].Currency = '';
              }
            }
            action(serverData);
          } else {
            console.log({errorMessage: serverData.ErrorMessage});
          }
        });
      })
      .catch(err => {
        console.error(err); /* eslint-disable-line */
      });
  }

  const userid = props.user.UserId;
  useEffect(() => {
    updatePayment(userid, props.updateAccount, fcmToken);
  }, []);
  // React.useEffect(
  //   () =>
  //     props.navigation.addListener('beforeRemove', e => {
  //       const state = props.navigation.getState();
  //       const {index, routeNames} = state;
  //       console.log('routeNames');
  //       console.log(routeNames);
  //       console.log('index');
  //       console.log(index);
  //       const currPage = routeNames[index - 1];
  //       console.log(currPage);
  //       // if (currPage == 'Login') {
  //       //   e.preventDefault();
  //       //   return;
  //       // } else {
  //       //   return;
  //       // }
  //     }),
  //   [props.navigation],
  // );
  // React.useEffect(() => {
  //   props.navigation.dispatch(
  //     CommonActions.reset({
  //       index: 1,
  //       routes: [{name: 'Home'}],
  //     }),
  //   );
  // }, []);

  let ToastMessage;
  const isVIP = props.user.isVIP === 'True';
  const {width, height} = useWindowDimensions();
  const _width = (width - 20 - 20 - 30 - 30) / 3;
  const Service = ({item = {}, index, hideBorder, showLine}) => {
    const iconColor = index % 2 == 0 ? BlueColor : Orange;
    const textColor = index % 2 == 1 ? BlueColor : Orange;
    const title = Object.keys(item)[0] ?? '';
    const values = Object.values(item)[0];
    const _width = (width - 20 - 20 - 30 - 30) / 3;

    return (
      <Pressable
        onPress={() => {
          item.navigateTo
            ? props.navigation.navigate(item.navigateTo)
            : ToastMessage.show(<Text>{Translate('Not available')}</Text>);
        }}
        style={[
          {
            width: _width,
            height: _width,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 10,
            borderColor: iconColor,
            border: hideBorder ? 0 : 1,
          },
          index % 3 == 1 && {marginHorizontal: 20},
          showLine && {marginHorizontal: 0},
        ]}>
        <CustomIcon
          style={[
            item.navigateTo === 'Receive'
              ? {transform: [{rotateX: '180deg'}]}
              : {},
          ]}
          item={item}
          iconColor={iconColor}
          // name={item.icon}
          // size={item.size || 35}
          // color="white"
        />
        {/* <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={require('../assets/LB_Flag.jpg')}
          style={{
            width: _width / 2,
            height: _width / 2,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        /> */}
        <Text
          style={{
            fontSize: 14,
            color: textColor,
            textAlign: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
            fontFamily: Font,
          }}>
          {item?.title ?? ''}
        </Text>
      </Pressable>
    );
  };

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
            <View
              style={{
                backgroundColor: White,
                flexDirection: 'row',
                marginHorizontal: 30,
                marginTop: 20,
                paddingBottom: 0,
                paddingTop: 0,
                borderRadius: 20,
              }}>
              {navigationButtons?.length > 0 &&
                navigationButtons.slice(0, 3).map((item, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Service
                        item={item}
                        index={index}
                        hideBorder
                        showLine={index < 2}
                      />
                      {index < 2 && (
                        <View
                          style={{
                            width: 1,
                            height: _width * 0.7,
                            backgroundColor: LightBlue,
                            opacity: 0.3,
                            marginHorizontal: 10,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                          }}></View>
                      )}
                    </View>
                  );
                })}
            </View>
            <FlatList
              data={navigationButtons.slice(3, 6)}
              ListHeaderComponent={
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 15,
                  }}>
                  <Pressable>
                    <Text
                      style={{
                        color: '#000',
                        fontWeight: '800',
                        fontSize: 18,
                      }}>{`Services`}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      props.navigation.navigate(`HomeServices`);
                    }}>
                    <Text
                      style={{
                        color: LightBlue,
                        fontWeight: '500',
                        fontSize: 16,
                      }}>{`View All`}</Text>
                  </Pressable>
                </View>
              }
              ItemSeparatorComponent={
                <View style={{width: 20, height: 40}}></View>
              }
              renderItem={({item, index}) => {
                return <Service item={item} index={index} />;
              }}
              numColumns={3}
              style={{
                backgroundColor: LightBlue,
                backgroundColor: '#EBEAFF',
                backgroundColor: '#e8f279',
                backgroundColor: `#f5f5f5`,

                flexGrow: 1,
              }}
              contentContainerStyle={{
                marginHorizontal: 0,
                padding: 30,
                paddingBottom: 20,
                paddingTop: 20,
              }}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponentStyle={{marginTop: 30}}
              ListFooterComponent={
                <View style={{alignContent: 'center', alignItems: 'center'}}>
                  <FastImage
                    source={require('../../assets/ads.jpg')}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{width: width - 0, height: width / 2}}
                  />
                </View>
              }
            />
            <View style={{height: 10}}></View>
            <View style={{marginHorizontal: 30}}>
              <Text style={{color: Orange}}>{Translate('Top Deals')}</Text>
            </View>
            <View style={{height: 10}}></View>
            <DealsFlatList
              data={MokeHomeDeals1}
              navigation={props.navigation}
              setSubPage={setSubPage}
              setShowHeader={setShowHeader}
            />
            <View style={{height: 30}}></View>
            <DealsFlatList
              data={MokeHomeDeals2}
              navigation={props.navigation}
              setSubPage={setSubPage}
              setShowHeader={setShowHeader}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
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
