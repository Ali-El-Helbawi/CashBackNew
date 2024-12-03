import React from 'react';
import {View, StatusBar} from 'react-native';
import CryptoJS from 'react-native-crypto-js';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore, persistReducer, createTransform} from 'redux-persist';
import {createStore} from 'redux';
import {createEncryptor} from 'redux-persist-transform-encrypt';
import userReducer from './src/reducers';
import {BackgroundBlue} from './src/assets/colors';
const Testing = () => {
  // const encryptor = createEncryptor({
  //   secretKey: 'my-super-secret-key',
  //   onError: function (error) {
  //     console.log(error);
  //   },
  // });

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
  // const encryptor = encryptTransform({
  //   secretKey: 'my-super-secret-key',
  //   onError: function (error) {
  //     // Handle the error.
  //   },
  // });

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
  const persistor = persistStore(store);
  const Circle = styled.View`
    width: 600px;
    height: 600px;
    border-radius: 600px;
    position: absolute;
    right: 20px;
    bottom: -100px;
    background-color: 'black';
    opacity: 0.15;
  `;
  const Container = styled.View`
    flex: 1;
    background-color: white;
    align-items: center;
    justify-content: center;
  `;
  const Text = styled.Text`
    font-size: 18px;
    color: blue;
    font-weight: 500;
  `;

  const keych = 'Ali';
  const keych2 = 'Ali2';
  // const encryptedSecCode = CryptoJS.AES.encrypt(keych2, `${keych}`).toString();
  // console.log(encryptedSecCode);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={BackgroundBlue} barStyle="light-content" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Container>
            <Circle></Circle>
            <Text>Open up App.js to start working on your app!</Text>
          </Container>
        </PersistGate>
      </Provider>
    </View>
  );
};
export default Testing;
