import React, {useState, useEffect, useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {I18nManager, Platform, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MLIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import HomeStack from './HomeStack';
import {Header, AnimatedLinearGradient, presetColors} from '../Components';
import {
  createDrawerNavigator,
  DrawerActions,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Translate, Font, updatePayment} from '../Helpers';
import NotificationsScreen from '../Containers/Notifications';
import Deals from '../Containers/Deals';
import InfoScreen from '../Containers/Info';
import QRCodeScreen from '../Containers/QRcode';
import MoreScreen from '../Containers/More';
import ContactUsScreen from '../Containers/ContactUs';
import FingerPrintSettingsScreen from '../Containers/FingerPrintSettings';
import ChangePasswordScreen from '../Containers/ChangePassword';
import styled from 'styled-components/native';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {connect} from 'react-redux';
import {PopUser, UpdatedAccounts} from '../actions';
import {Loading} from '../Components';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {DataContext} from '../context/dataContext';
import * as RootNavigation from '../Navigation/RootNavigation';
import RNRestart from 'react-native-restart'; // Import package from node modules
import axios from 'axios';
import {parseString} from 'react-native-xml2js';
import {serverLink, getXmlData} from '../Helpers';
import {LightBlue, SecondBlue} from '../assets/colors';
import DealStack from './DealStack';
const HeaderHomeBtnContainer = styled.View`
  top: -10px;
  width: 70px;
  height: 70px;
  background-color: ${SecondBlue}
  border-radius: 70px;
  align-items: center;
  justify-content: center;
`;
const HeaderHomeCircleContainer = styled.View`
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  background-color: ${LightBlue};
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

const DrawerItems = styled.TouchableOpacity`
  padding: 10px;
  text-align: left;
  border-bottom-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  background-color: rgba(8, 18, 97, 0.1);
  margin-bottom: 5px;
  border-radius: 8px;
`;

const DrawerTitle = styled.Text`
  font-family: ${Font};
  font-size: 16px;
  color: white;
`;

function HomeBtn(props) {
  return (
    <HeaderHomeBtnContainer>
      <HeaderHomeCircleContainer>
        <MIcon name="home-minus" color={props.color} size={24} />
      </HeaderHomeCircleContainer>
    </HeaderHomeBtnContainer>
  );
}
const LinearStyle = {
  padding: 10,
  paddingTop: Platform.OS == 'android' ? 5 : 30,
  height: '100%',
};

function CustomDrawerContentComponent(props) {
  return (
    <AnimatedLinearGradient
      points={{start: {x: 1.0, y: 0.0}, end: {x: 0.0, y: 0.0}}}
      style={[LinearStyle]}
      speed={10000}
      customColors={presetColors.A2B}>
      <DrawerItems onPress={() => RootNavigation.navigate('Change Password')}>
        <DrawerTitle>{Translate('Change Password')}</DrawerTitle>
      </DrawerItems>
      <DrawerItems
        onPress={() => RootNavigation.navigate('Finger Print Settings')}>
        <DrawerTitle>{Translate('Finger Print Settings')}</DrawerTitle>
      </DrawerItems>
      <DrawerItems onPress={() => RootNavigation.navigate('Notifications')}>
        <DrawerTitle>{Translate('Notifications')}</DrawerTitle>
      </DrawerItems>
      <DrawerItems onPress={() => RootNavigation.navigate('Info')}>
        <DrawerTitle>{Translate('Info')}</DrawerTitle>
      </DrawerItems>
      <DrawerItems onPress={() => RootNavigation.navigate('Contact Us')}>
        <DrawerTitle>{Translate('Contact Us')}</DrawerTitle>
      </DrawerItems>
    </AnimatedLinearGradient>
  );
}

const AppTab = createBottomTabNavigator();

function AppStack() {
  return (
    <AppTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F8F8F8',
        tabBarInactiveTintColor: '#586589',
        tabBarShowLabel: true,
        tabBarStyle: {
          height: Platform.OS == 'android' ? 70 : 80,
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          backgroundColor: SecondBlue, // TabBar background
        },
      }}
      backBehavior="initialRoute">
      {/* <AppTab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MLIcon name="info" color={color} size={24} />
          ),
        }}
      /> */}
      <AppTab.Screen
        name="QR Code"
        component={QRCodeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MLIcon name="qr-code" color={color} size={24} />
          ),
        }}
      />
      <AppTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({color}) => <HomeBtn color={color} />,
        }}
      />
      <AppTab.Screen
        name={Translate('Deals')}
        component={DealStack}
        options={{
          tabBarIcon: ({color}) => (
            <AntDesign name="star" color={color} size={24} />
          ),
        }}
      />
      {/* <AppTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MLIcon name="notifications" color={color} size={24} />
          ),
        }}
      /> */}
      {/* <AppTab.Screen
        name="More"
        component={HomeStack}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.toggleDrawer();
          },
        })}
        options={{
          tabBarOnPress: ({navigation, defaultHandler}) => {},
          tabBarIcon: ({color}) => (
            <MIcon name="text" color={color} size={24} />
          ),
        }}
      /> */}
    </AppTab.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function MainAppStack() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        drawerPosition: I18nManager.isRTL ? 'left' : 'right',
        header: props => <Header {...props} />,
        drawerType: 'slide',
      }}
      drawerContent={props => {
        return <CustomDrawerContentComponent {...props} />;
      }}>
      <Drawer.Screen
        name="HomeStack"
        component={AppStack}
        options={{
          headerShow: false,
        }}
      />
      <Drawer.Screen
        name="Change Password"
        component={ChangePasswordScreen}
        options={{headerShow: false}}
      />
      <Drawer.Screen
        name="Finger Print Settings"
        component={FingerPrintSettingsScreen}
        options={{headerShow: false}}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{headerShow: false}}
      />
      <Drawer.Screen
        name="Info"
        component={InfoScreen}
        options={{headerShow: false}}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactUsScreen}
        options={{headerShow: false}}
      />
    </Drawer.Navigator>
  );
}

const AppStackContainer = props => {
  const userid = props.user.UserId;
  const {fcmToken, setIsLogin, setNotifications} = useContext(DataContext);

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
          console.log(serverData);
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
  const componentDidMount = () => {
    const handleRemoteNotification = () => {
      updatePayment(userid, props.updateAccount, fcmToken);
    };
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      handleRemoteNotification();
      console.log('Message handled in the background!', remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        JSON.stringify(remoteMessage),
      );
      handleRemoteNotification();
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );

          handleRemoteNotification();
        }
      });
  };
  useEffect(() => {
    componentDidMount();
  });
  useEffect(() => {
    const unsubscribe = messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          AsyncStorage.setItem('@BCD:fcmToken', fcmToken).catch(errM => {
            //  this.showAlert('Error', errM.message)
          });
          console.log(fcmToken);
        } else {
          console.log('no token');
        }
      });

    return unsubscribe;
  }, []);
  useEffect(() => {
    const unsubscribe = messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('enabled');
        } else {
          console.log('not enabled');
          try {
            messaging().requestPermission();
          } catch (error) {
            console.log(error);
          }
        }
      });

    return unsubscribe;
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      updatePayment(userid, props.updateAccount, fcmToken);
      console.log('A new FCM message arrived!');
      console.log(JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  const [ready, setready] = useState(false);
  const [timeApp, settimeApp] = useState('');

  const compareTime = (d1, d2) => {
    return d1 - d2;
  };
  const handleAppStateChange = nextAppStates => {
    const AppStateChange = async nextAppState => {
      if (nextAppState === 'background') {
        console.log('background');
        const backgroundTimenow = new Date();
        const date_str = moment(backgroundTimenow)
          .format('MMDDYYYYHHmmss')
          .toString();
        await AsyncStorage.setItem('@BCD:timeApp', date_str).catch(errM =>
          console.log('Error', errM.message),
        );
        settimeApp(date_str);
      }
      if (nextAppState === 'active') {
        const d4_as_string = await AsyncStorage.getItem('@BCD:timeApp');
        // let d4_as_string = this.state.date_str;
        const d4_as_date = moment(
          d4_as_string,
          'MMDDYYYYHHmmss',
          true,
        ).toDate();
        const now = new Date();

        if (compareTime(now, d4_as_date) > 120000) {
          console.log('logout');
          const now_as_string = moment(now).format('MMDDYYYYHHmmss').toString();
          await AsyncStorage.setItem('@BCD:timeApp', now_as_string).catch(
            errM => console.log('Error', errM.message),
          );

          props.onLogout();
          // RootNavigation.navigate('Login');
          setIsLogin(false);
          // RNRestart.restart();
          console.log(`RootNavigation.navigate('Login')`);
        } else {
          console.log('good');
        }
      }
      if (nextAppState === 'inactive') {
        console.log('App is in inactive Mode.');
      }
    };
    AppStateChange(nextAppStates);
  };
  useEffect(() => {
    setready(true);
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  if (!ready) {
    return <Loading backgroundColor="#2F5CCA" />;
  }
  if (!props.user) {
    setIsLogin(false);
    return RootNavigation.navigate('Login');
  }
  return <MainAppStack />;
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
  onLogout: () => {
    dispatch(PopUser());
  },
  updateAccount: accounts => {
    dispatch(UpdatedAccounts(accounts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStackContainer);
