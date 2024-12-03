import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';

import {getApplicationName} from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';

import messaging from '@react-native-firebase/messaging';
const Testing = () => {
  // async function registerAppWithFCM() {
  //   await messaging()
  //     .registerDeviceForRemoteMessages()
  //     .then(res => {
  //       console.log(res);
  //     });
  // }

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
    }
  };
  const fetchDate = async () => {
    // await registerAppWithFCM();

    await checkToken();
  };
  useEffect(() => {
    SplashScreen.hide();
    fetchDate();
  }, []);

  return (
    <View>
      <Text>{getApplicationName()}</Text>
    </View>
  );
};

export default Testing;
