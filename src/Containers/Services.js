import React, {useState, useEffect, useContext} from 'react';
import {
  StatusBar,
  Dimensions,
  Platform,
  I18nManager,
  Alert,
  View,
  FlatList,
  Text,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import {Image, ImageBackground} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import styled from 'styled-components/native';
import {BoxShadow} from 'react-native-shadow';
import {TextField, Button, Loading} from '../Components';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Logo from '../assets/logo.svg';
import Background from '../assets/bg.svg';
import axios from 'axios';
import RNRestart from 'react-native-restart'; // Import package from node modules
import SplashScreen from 'react-native-splash-screen';
import {parseString} from 'react-native-xml2js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DataContext} from '../context/dataContext';
import {
  getKeyChain,
  setKeyChain,
  getXmlData,
  serverLink,
  Font,
  Translate,
  convertToAsc,
} from '../Helpers';
import CryptoJS from 'react-native-crypto-js';
import TouchID from 'react-native-touch-id';
import {connect} from 'react-redux';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {getUniqueId} from 'react-native-device-info';
import {
  IsSupported,
  GetUser,
  GetToken,
  GetTokenBM,
  GetLabels,
  ResetBMT,
} from '../actions';
import FastImage from 'react-native-fast-image';
const isIOS = Platform.OS === 'ios';
import messaging from '@react-native-firebase/messaging';
import {
  DummyCategories,
  DummyOtherServices,
  MockServices,
} from '../Helpers/mockData';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../Components/CustomHeader';
import {BlueColor} from '../assets/colors';
function ServicesScreen(props) {
  const {setIsLogin, setUserInfo, setUserAccounts, fcmToken, setFCMToken} =
    useContext(DataContext);
  useEffect(() => {}, []);
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();
  const {
    userInfo,
    userAccounts,
    subPage,
    setSubPage,
    showHeader,
    setShowHeader,
  } = useContext(DataContext);
  const Service = ({item = {}, index}) => {
    const title = Object.keys(item)[0] ?? '';
    const values = Object.values(item)[0];
    const _width = (width - 20 - 20 - 30 - 30) / 3;

    return (
      <Pressable
        onPress={() => {
          setSubPage(title);
          setShowHeader(false);
          navigation.navigate('SubServices', {title: title, values: values});
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
            borderColor: BlueColor,
            borderWidth: 1,
          },
          index % 3 == 1 && {marginHorizontal: 20},
        ]}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={require('../assets/LB_Flag.jpg')}
          style={{
            width: _width / 2,
            height: _width / 2,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <Text
          style={{
            fontSize: 14,
            color: BlueColor,
            textAlign: 'center',
            paddingHorizontal: 20,
            paddingVertical: 5,
            fontFamily: Font,
          }}>
          {title}
        </Text>
      </Pressable>
    );
  };
  return (
    <View style={{flex: 1}}>
      {/* <CustomHeader {...props} title={'Categories'} /> */}

      <FlatList
        data={DummyCategories}
        numColumns={3}
        style={{
          backgroundColor: 'white',
          flexGrow: 1,
          paddingBottom: 80,
          paddingTop: 10,
        }}
        contentContainerStyle={{marginHorizontal: 30}}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <FlatList
              data={DummyOtherServices}
              numColumns={3}
              style={{
                backgroundColor: 'white',
                // flexGrow: 1,
                paddingBottom: 0,
                paddingTop: 20,
              }}
              contentContainerStyle={{marginHorizontal: 0}}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                <View style={{paddingTop: 30, paddingBottom: 0}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: BlueColor,
                      // textAlign: 'center',
                      // padding: 20,
                      fontFamily: Font,
                      paddingBottom: 10,
                      fontWeight: '900',
                      //textDecorationLine: 'underline',
                    }}>
                    {'Main Services:'}
                  </Text>
                </View>
              }
              ListHeaderComponent={
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: BlueColor,
                      // textAlign: 'center',
                      // padding: 20,
                      fontFamily: Font,
                      paddingBottom: 10,
                      fontWeight: '900',
                      //textDecorationLine: 'underline',
                    }}>
                    {'Other Services:'}
                  </Text>
                </View>
              }
              ItemSeparatorComponent={
                <View style={{width: 20, height: 40}}></View>
              }
              renderItem={({item, index}) => {
                return <Service item={item} index={index} />;
              }}
            />
          </>
        }
        ItemSeparatorComponent={<View style={{width: 20, height: 40}}></View>}
        renderItem={({item, index}) => {
          return <Service item={item} index={index} />;
        }}
      />
    </View>
  );
}

const mapStateToProps = state => ({
  user: state.user,
  tokenBM: state.tokenBM,
});

const mapDispatchToProps = dispatch => ({
  onLogin: (user, token, pass, labels, isSupported) => {
    dispatch(GetUser(user));
    dispatch(GetToken(token));
    dispatch(GetTokenBM(pass));
    dispatch(GetLabels(labels));
  },
  ResetBMT: () => {
    dispatch(ResetBMT());
  },
  IsDeviceSupported: state => {
    dispatch(IsSupported(state));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ServicesScreen);
