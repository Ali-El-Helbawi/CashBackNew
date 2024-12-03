import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext} from 'react';
import AppStack from './AppStack';
import LoginScreen from '../Containers/Login';
import VerifyScreen from '../Containers/Verify';
import RegisterScreen from '../Containers/Register';
import CreateAccount from '../Containers/CreateAccount';
import ForgotPassword from '../Containers/ForgotPassword';
import AuthLoadingScreen from '../Components/splash';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DataContext} from '../context/dataContext';
const VerifyNavStack = createStackNavigator();
import * as RootNavigation from '../Navigation/RootNavigation';

function VerifyStack() {
  return (
    <VerifyNavStack.Navigator
      initialRouteName="Register"
      screenOptions={{headerShown: false}}>
      <VerifyNavStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <VerifyNavStack.Screen
        name="Verify"
        component={VerifyScreen}
        options={{headerShown: false}}
      />
      <VerifyNavStack.Screen name="CreateAccount" component={CreateAccount} />
    </VerifyNavStack.Navigator>
  );
}
//  const VerifyStack2 = createStackNavigator(
//   {
//     Register: {screen: RegisterScreen},
//     Verify: {screen: VerifyScreen},
//     CreateAccount: {screen: CreateAccount},
//   },
//   {
//     defaultNavigationOptions: {
//       headerShown: false,
//     },
//     initialRouteName: 'Register',
//   },
// );
const AuthNavStack = createStackNavigator();
function AuthStack() {
  return (
    <AuthNavStack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <AuthNavStack.Screen name="Login" component={LoginScreen} />
      <AuthNavStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthNavStack.Navigator>
  );
}
// const AuthStack2 = createStackNavigator(
//   {
//     Login: {screen: LoginScreen},
//     ForgotPassword: {screen: ForgotPassword},
//   },
//   {
//     defaultNavigationOptions: {
//       headerShown: false,
//     },
//   },
// );
const AppContainerStack = createNativeStackNavigator();
function AppContainer() {
  const {isLogin} = useContext(DataContext);
  return (
    <NavigationContainer
      //initialState={{}}
      ref={RootNavigation.navigationRef}
      onReady={() => {
        RootNavigation.routeNameRef.current =
          RootNavigation.navigationRef.current.getCurrentRoute().name;
        // i added this
      }}
      onStateChange={() => {
        const previousRouteName = RootNavigation.routeNameRef.current;
        const currentRouteName =
          RootNavigation.navigationRef.current.getCurrentRoute().name;
        // console.log("global.route", global.route);

        if (previousRouteName !== currentRouteName) {
          console.log('screen_name:', currentRouteName);

          // setScreenName(currentRouteName);
        }
        RootNavigation.routeNameRef.current = currentRouteName;
      }}
      initialRouteName="AuthLoading"
      defaultNavigationOptions={{
        // gestureEnabled: false,
        headerShown: false,
      }}>
      <AppContainerStack.Navigator>
        {/* {!isLogin && (
          <AppContainerStack.Screen
            options={{headerShown: false}}
            name="ServicesStack"
            component={ServicesStack}
          />
        )} */}

        {/* {!isLogin && (
          <AppContainerStack.Screen
            options={{headerShown: false}}
            name="AuthLoading"
            component={AuthLoadingScreen}
          />
        )}
        {!isLogin && (
          <AppContainerStack.Screen
            name="Verify"
            component={VerifyStack}
            options={{headerShown: false}}
          />
        )} */}
        {!isLogin && (
          <AppContainerStack.Screen
            name="Auth"
            component={AuthStack}
            options={{headerShown: false}}
          />
        )}

        {isLogin && (
          <AppContainerStack.Screen
            name="App"
            component={AppStack}
            options={{headerShown: false}}
          />
        )}
      </AppContainerStack.Navigator>
    </NavigationContainer>
  );
}
export default AppContainer;
