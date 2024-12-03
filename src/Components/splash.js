import React, {useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import Loading from './loading';
import {DataContext} from '../context/dataContext';
import {useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const AuthLoadingScreen = props => {
  const isFocused = useIsFocused();
  const {setIsLogin} = useContext(DataContext);
  useEffect(() => {
    if (isFocused) {
      componentDidMount();
    }
  }, [props, isFocused]);

  const componentDidMount = async () => {
    const {navigation, user} = props;
    await AsyncStorage.getItem('@BCD:verified').then(async verified => {
      const loggedIn = user;
      const afterVerify = loggedIn ? 'App' : 'Auth';
      console.log('loggedIn');
      console.log(loggedIn);
      const isSimulator = await DeviceInfo.isEmulator();
      console.log('isSimulator');
      console.log(isSimulator);
      if (afterVerify == 'App') {
        setIsLogin(true);
      } else {
        // if (isSimulator) {
        //   setIsLogin(true);
        //   navigation.navigate('App');
        //   return;
        // }
        setIsLogin(false);
      }
      navigation.navigate(verified === 'true' ? afterVerify : 'Verify');
    });
  };

  return <Loading backgroundColor="#2F5CCA" />;
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(AuthLoadingScreen);
