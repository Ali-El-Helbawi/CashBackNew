import * as React from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import CustomHeader from '../Components/CustomHeader';
import {BlueColor} from '../assets/colors';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Font} from '../Helpers';
const SubServices = [
  'Telecom',
  'Internet Cards',
  'Streaming',
  'Games',
  'TV',
  'Show TV',
];
import FastImage from 'react-native-fast-image';
import {DataContext} from '../context/dataContext';
import * as RootNavigation from '../Navigation/RootNavigation';

const SubServicesScreen = props => {
  const {width} = useWindowDimensions();
  const SubServiceRoot = ({title}) => {
    const _width = (width - 20 - 20 - 20 - 20) / 3;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BlueColor,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 50,
        }}>
        <FlatList
          data={SubServices}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <SubServiceItem title={title} index={index} _width={_width} />
            );
          }}
        />
      </View>
    );
  };
  const SubServiceItem = ({title, index, _width}) => {
    return (
      <View
        style={[
          {
            //flex: 1,
            backgroundColor: '#fff',

            width: _width,
            height: _width,
            paddingVertical: 20,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            paddingHorizontal: 20,
            marginBottom: 20,
            borderBottomWidth: 1,
            borderColor: BlueColor,
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
            fontFamily: Font,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 13,
            paddingTop: 10,
          }}>
          {`${title}_${index + 1}`}
        </Text>
      </View>
    );
  };

  const Tab = createMaterialTopTabNavigator();

  const [title, setTitle] = React.useState('');
  const [values, setValues] = React.useState([]);
  React.useEffect(() => {
    const _title = props?.route?.params?.title ?? '';
    setTitle(_title);
    const _values = props?.route?.params?.values ?? [];
    setValues(_values);
  }, []);
  const {
    userInfo,
    userAccounts,
    subPage,
    setSubPage,
    showHeader,
    setShowHeader,
  } = React.useContext(DataContext);
  React.useEffect(() => {
    const backAction = () => {
      setSubPage('');
      setShowHeader(true);
      RootNavigation.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <>
      {/* <CustomHeader {...props} title={title} /> */}
      {values && values.length > 0 && (
        <Tab.Navigator
          // tabBar={props => <MyTabBar {...props} />}
          backBehavior="none"
          screenOptions={({route}) => ({
            tabBarIconStyle: {width: 25, height: 25},
            tabBarIcon: ({}) => {
              console.log('route.name');
              console.log(route.name);
              return (
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  source={require('../assets/LB_Flag.jpg')}
                  style={{
                    width: 25,
                    height: 25,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              );
            },
            lazy: true,
            tabBarScrollEnabled: true,
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: Font,
              fontWeight: 'bold',
              // color: BlueColor,
            },
            tabBarIndicatorStyle: {backgroundColor: '#fff'},
            tabBarActiveTintColor: BlueColor,
            tabBarInactiveTintColor: 'rgba(0,0,0,0.35)',
            tabBarPressColor: '#fff',
            tabBarItemStyle: {
              width: 'auto',
              marginHorizontal: 5,
              borderRadius: 25,
              paddingHorizontal: 10,
              backgroundColor: '#fff',
              borderWidth: 1,
              flexDirection: 'row',
            },
            tabBarStyle: {
              backgroundColor: '#fff',
              paddingTop: 10,
              paddingBottom: 2,
              borderWidth: 0,
              elevation: 0, // for Android
              shadowOffset: {
                width: 0,
                height: 0, // for iOS
              },
            },
          })}>
          {values &&
            values.length > 0 &&
            values.map((SubService, index) => {
              return (
                <Tab.Screen name={SubService} key={SubService}>
                  {props => (
                    <SubServiceRoot
                      {...props}
                      title={SubService}
                      width={width}
                    />
                  )}
                </Tab.Screen>
              );
            })}
        </Tab.Navigator>
      )}
      {/* <TabView
        renderTabBar={props => <TabBar {...props} />}
        // renderTabBar={renderTabBar}
        style={{paddingVertical: 0}}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      /> */}
      {/* <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      /> */}
    </>
  );
};

export default SubServicesScreen;
