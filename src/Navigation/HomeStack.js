import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Dimensions} from 'react-native';
import HomeScreen from '../Containers/Home';
import AccountScreen from '../Containers/Account';
import CashBack from '../Containers/CashBack';
import CashBackConfirm from '../Containers/CashBackConfirm';
import TransferAccountScreen from '../Containers/TransferAccount';
import TransferAccountQRScreen from '../Containers/TransferAccountQR';
import TransferAccountSMScreen from '../Containers/TransferAccountSMS';
import ReceiveSMSScreen from '../Containers/ReceiveSMS';
import CardsScreen from '../Containers/Cards';
import Deal from '../Containers/Deal';
import Deals from '../Containers/Deals';
import CardsDenominations from '../Containers/CardsDenominations';
import EvoucherHistoryScreen from '../Containers/EvoucherHistory';
import VIPScreen from '../Containers/VIP';
import BalanceList from '../Containers/BalanceList';
import AgentsScreen from '../Containers/Agents';
import {Header} from '../Components';
import {Translate, Font} from '../Helpers';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SubServicesScreen from '../Containers/SubServices';
import ServicesScreen from '../Containers/Services';
import {BlueColor} from '../assets/colors';
import HomeServices from '../Containers/HomeServices';

const {width} = Dimensions.get('window');
const ServicesNavStack = createStackNavigator();
function ServicesStack() {
  return (
    <ServicesNavStack.Navigator
      initialRouteName="Services"
      screenOptions={{headerShown: false}}>
      <ServicesNavStack.Screen
        name="Services"
        component={ServicesScreen}
        options={{headerShown: false}}
      />
      <ServicesNavStack.Screen
        name="SubServices"
        component={SubServicesScreen}
        options={{headerShown: false}}
      />
    </ServicesNavStack.Navigator>
  );
}
// ReceiveSMS: {
//   screen: ReceiveSMSScreen,
//   navigationOptions: {
//     headerStyle: {
//       backgroundColor: '#633689',
//     },
//     headerTintColor: '#FFFFFF',
//     title: Translate('Pay Cash'),
//   },
// },
const TransferTab = createMaterialTopTabNavigator();
const ReceiveTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const CashBackStack = createStackNavigator();

function TransferStack() {
  return (
    <TransferTab.Navigator
      initialRouteName="TransferAccount"
      tabBarPosition="top"
      swipeEnabled={true}
      animationEnabled={true}
      screenOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#F8F8F8',
        style: {
          backgroundColor: BlueColor,
        },
        labelStyle: {
          textAlign: 'center',
          fontFamily: Font,
          fontSize: 12,
          // textTransform: 'capitalize',
        },
        indicatorStyle: {
          borderBottomColor: 'white',
          borderBottomWidth: 3,
          marginBottom: 8,
          width: 20,
          left: width / 6 - 10,
        },
      }}>
      <TransferTab.Screen
        name="TransferAccount"
        component={TransferAccountScreen}
        options={{
          title: Translate('By Account'),
          headerStyle: {
            backgroundColor: '#633689',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      <TransferTab.Screen
        name="TransferAccountSMS"
        component={TransferAccountSMScreen}
        options={{
          title: Translate('By Phone'),
          headerStyle: {
            backgroundColor: '#633689',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      <TransferTab.Screen
        name="TransferAccountQR"
        component={TransferAccountQRScreen}
        options={{
          title: Translate('By QR'),
          headerStyle: {
            backgroundColor: '#633689',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
    </TransferTab.Navigator>
  );
}

// const TransferStack2 = createMaterialTopTabNavigator(
//   {
//     TransferAccount: {
//       screen: TransferAccountScreen,
//       navigationOptions: {
//         headerStyle: {
//           backgroundColor: '#633689',
//         },
//         headerTintColor: '#FFFFFF',
//         title: Translate('By Account'),
//       },
//     },
//     TransferAccountSMS: {
//       screen: TransferAccountSMScreen,
//       navigationOptions: {
//         headerStyle: {
//           backgroundColor: '#633689',
//         },
//         headerTintColor: '#FFFFFF',
//         title: Translate('By Phone'),
//       },
//     },
//     TransferAccountQR: {
//       screen: TransferAccountQRScreen,
//       navigationOptions: {
//         headerStyle: {
//           backgroundColor: '#633689',
//         },
//         headerTintColor: '#633689',
//         title: Translate('By QR'),
//       },
//     },
//   },
//   {
//     tabBarPosition: 'top',
//     swipeEnabled: true,
//     animationEnabled: true,
//     screenOptions: {
//       activeTintColor: '#FFFFFF',
//       inactiveTintColor: '#F8F8F8',
//       style: {
//         backgroundColor: BlueColor,
//       },
//       labelStyle: {
//         textAlign: 'center',
//         fontFamily: Font,
//         fontSize: 12,
//         // textTransform: 'capitalize',
//       },
//       indicatorStyle: {
//         borderBottomColor: 'white',
//         borderBottomWidth: 3,
//         marginBottom: 8,
//         width: 20,
//         left: width / 6 - 10,
//       },
//     },
//   },
// );
function CashBackScreens() {
  return (
    <CashBackStack.Navigator
      initialRouteName="CashBackStart"
      screenOptions={{
        headerShown: false,
      }}>
      <CashBackStack.Screen
        name="CashBackStart"
        component={CashBack}
        options={{headerShown: false}}
      />

      <CashBackStack.Screen
        name="CashBackConfirm"
        component={CashBackConfirm}
      />
    </CashBackStack.Navigator>
  );
}
function ReceiveStack() {
  return (
    <ReceiveTab.Navigator
      tabBarPosition="top"
      swipeEnabled={true}
      animationEnabled={true}
      screenOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#F8F8F8',
        style: {
          backgroundColor: BlueColor,
        },
        labelStyle: {
          textAlign: 'center',
          fontFamily: Font,
          fontSize: 12,
          // textTransform: 'capitalize',
        },
        indicatorStyle: {
          borderBottomColor: 'white',
          borderBottomWidth: 3,
          marginBottom: 8,
          width: 20,
          left: width / 2 - 10,
        },
      }}>
      <ReceiveTab.Screen
        name="ReceiveSMS"
        component={ReceiveSMSScreen}
        options={{
          title: Translate('By Phone'),
          headerStyle: {
            backgroundColor: '#633689',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
    </ReceiveTab.Navigator>
  );
}

function CardsStack() {
  return (
    <CashBackStack.Navigator
      initialRouteName="Cards"
      screenOptions={{
        headerShown: false,
      }}>
      <CashBackStack.Screen
        name="Cards"
        component={CardsScreen}
        options={{headerShown: false}}
      />

      <CashBackStack.Screen
        name="CardsDenominations"
        component={CardsDenominations}
      />
    </CashBackStack.Navigator>
  );
}
// const ReceiveStack2 = createMaterialTopTabNavigator(
//   {
//     ReceiveSMS: {
//       screen: ReceiveSMSScreen,
//       navigationOptions: {
//         headerStyle: {
//           backgroundColor: '#633689',
//         },
//         headerTintColor: '#FFFFFF',
//         title: Translate('By Phone'),
//       },
//     },
//   },
//   {
//     tabBarPosition: 'top',
//     swipeEnabled: true,
//     animationEnabled: true,
//     screenOptions: {
//       activeTintColor: '#FFFFFF',
//       inactiveTintColor: '#F8F8F8',
//       style: {
//         backgroundColor: BlueColor,
//       },
//       labelStyle: {
//         textAlign: 'center',
//         fontFamily: Font,
//         fontSize: 12,
//         // textTransform: 'capitalize',
//       },
//       indicatorStyle: {
//         borderBottomColor: 'white',
//         borderBottomWidth: 3,
//         marginBottom: 8,
//         width: 20,
//         left: width / 2 - 10,
//       },
//     },
//   },
// );
function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        header: props => <Header {...props} />,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeServices"
        component={HomeServices}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Transfer" component={TransferStack} />
      <Stack.Screen name="CashBack" component={CashBackScreens} />
      <Stack.Screen name="Receive" component={ReceiveStack} />
      <Stack.Screen name="Cards" component={CardsStack} />
      <Stack.Screen name="Deals" component={Deals} />
      <Stack.Screen name="Deal" component={Deal} />
      {/* <Stack.Screen name="VIP" component={VIPScreen} /> */}
      <Stack.Screen name="Agents" component={AgentsScreen} />
      <Stack.Screen name="BalanceList" component={BalanceList} />
      <Stack.Screen name="Cards History" component={EvoucherHistoryScreen} />
      <Stack.Screen name="ServicesStack" component={ServicesStack} />
    </Stack.Navigator>
  );
}

export default HomeStack;
