/* eslint-disable react/react-in-jsx-scope */
import {Dimensions} from 'react-native';
import VIPReceiveSMScreen from '../Containers/VIPReceiveSMS';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Translate, Font} from '../Helpers';

const {width} = Dimensions.get('window');

// import VIPTransferAccountScreen from '../Containers/VIPTransferAccount';
// import VIPTransferAccountQRScreen from '../Containers/VIPTransferAccountQR';
// import VIPTransferAccountSMScreen from '../Containers/VIPTransferAccountSMS';

const VIPTab = createMaterialTopTabNavigator();

export default function VIPStack() {
  return (
    <VIPTab.Navigator
      initialRouteName="VIPReceiveSMScreen"
      tabBarPosition="top"
      swipeEnabled={true}
      animationEnabled={true}
      screenOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#F8F8F8',
        style: {
          backgroundColor: 'transparent',
        },
        labelStyle: {
          textAlign: 'center',
          fontFamily: Font,
          fontSize: 12,
        },
        indicatorStyle: {
          borderBottomColor: 'white',
          borderBottomWidth: 3,
          marginBottom: 8,
          width: 20,
          left: width / 2 - 10,
        },
      }}>
      <VIPTab.Screen
        name="VIPReceiveSMScreen"
        component={VIPReceiveSMScreen}
        options={{
          title: Translate('Pay Cash'),
          headerStyle: {
            backgroundColor: '#633689',
          },
          headerTintColor: 'transparent',
        }}
      />
    </VIPTab.Navigator>
  );
}

// const VIPStack = createMaterialTopTabNavigator(
//   {
//     VIPReceiveSMScreen: {
//       screen: VIPReceiveSMScreen,
//       navigationOptions: {
//         headerStyle: {
//           backgroundColor: '#633689',
//         },
//         headerTintColor: 'transparent',
//         title: Translate('Pay Cash'),
//       },
//     },
//   },
//   {
//     tabBarPosition: 'top',
//     swipeEnabled: true,
//     initialRouteName: 'VIPReceiveSMScreen',
//     animationEnabled: true,
//     screenOptions: {
//       activeTintColor: '#FFFFFF',
//       inactiveTintColor: '#F8F8F8',
//       style: {
//         backgroundColor: 'transparent',
//       },
//       labelStyle: {
//         textAlign: 'center',
//         fontFamily: Font,
//         fontSize: 12,
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

// export default VIPStack;
