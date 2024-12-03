import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Deal from '../Containers/Deal';
import Deals from '../Containers/Deals';
import {Header} from '../Components';

const Stack = createStackNavigator();

function DealStack() {
  return (
    <Stack.Navigator
      initialRouteName="Deals"
      screenOptions={{
        headerShown: false,
        header: props => <Header {...props} />,
      }}>
      <Stack.Screen name="Deals" component={Deals} />
      <Stack.Screen name="Deal" component={Deal} />
    </Stack.Navigator>
  );
}

export default DealStack;
