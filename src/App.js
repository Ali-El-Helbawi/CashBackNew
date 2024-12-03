/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
// import firebase from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
import {View, StatusBar, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {createStore} from 'redux';
import createEncryptor from 'redux-persist-transform-encrypt';
import AppContainer from './Navigation';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {ArabicFont} from './Helpers';
import {persistStore, persistReducer, createTransform} from 'redux-persist';
import OfflineNotice from './Components/netInfo';
// import {ModalSuccess, Modal} from './components/modal';
import userReducer from './reducers';
import CryptoJS from 'react-native-crypto-js';
import {DataProvider} from './context/dataContext';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
// const encryptor = createEncryptor({
//   secretKey: 'my-super-secret-key',
//   onError: function (error) {
//     console.log(error);
//   },
// });
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BackgroundBlue} from './assets/colors';

const encryptor = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    const cryptedText = CryptoJS.AES.encrypt(
      JSON.stringify(inboundState),
      'my-super-secret-key',
    );

    return cryptedText.toString();
  },
  (outboundState, key) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, 'my-super-secret-key');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  },
);
// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: [
//     'tokenBM',
//     // 'user',
//     // 'accounts',
//     // 'userInfo',
//     // 'tokenBM',
//     // 'token',
//     // 'labels',
//   ],
//   blacklist: [],
//   transforms: [encryptor],
// };
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'tokenBM',
    // 'user',
    // 'accounts',
    // 'userInfo',
    // 'tokenBM',
    // 'token',
    // 'labels',
  ],
  blacklist: [],
  transforms: [encryptor],
};
const persistedReducer = persistReducer(persistConfig, userReducer);
const store = createStore(persistedReducer);
let persistor = persistStore(store);

const Main = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // componentWillUnmount() {
  //   this.notificationListener();
  // }
  return (
    <GestureHandlerRootView>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar backgroundColor={BackgroundBlue} barStyle="light-content" />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppContainer />
          </PersistGate>
        </Provider>
        <OfflineNotice />
        <FlashMessage style={{fontFamily: ArabicFont}} position="top" />
      </View>
    </GestureHandlerRootView>
  );
};
const App = () => {
  return (
    <DataProvider>
      <Main />
    </DataProvider>
  );
};
export default App;
