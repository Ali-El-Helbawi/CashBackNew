import React from 'react';
import {Alert, Pressable, useWindowDimensions, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FlatList} from 'react-native-gesture-handler';
import {
  BlueColor,
  DefaultBackgroundColor,
  Orange,
  White,
} from '../assets/colors';
import {handleDealPress} from '../Helpers/functions';
import {Text} from 'react-native-paper';
import {Font, Translate} from '../Helpers';

const DealsFlatList = ({
  data = [],
  navigation,
  setSubPage,
  setShowHeader,
  title1 = '',
  title2 = '',
  titleViewStyle = {},
  title1Style = {},
  title2Style = {},
  title1OnPress = () => {},
  title2OnPress = () => {},
}) => {
  const {width} = useWindowDimensions();
  const _width = (width - 60) / 2.8;
  const height = _width * 0.65;

  return (
    <View style={{backgroundColor: White, paddingVertical: 0}}>
      {/* <View style={{height: 10, width: width}}></View> */}
      <View
        style={[
          {
            paddingHorizontal: 30,
            backgroundColor: DefaultBackgroundColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
          titleViewStyle,
        ]}>
        <Text
          onPress={() => {
            title1OnPress();
          }}
          style={[
            {
              color: BlueColor,
              fontFamily: Font,
              fontWeight: '300',
              fontSize: 15,
            },
            title1Style,
          ]}>
          {title1}
        </Text>
        <Text
          onPress={() => {
            title2OnPress();
          }}
          style={[
            {
              color: Orange,
              fontFamily: Font,
              fontWeight: '900',
              fontSize: 15,
            },
            title2Style,
          ]}>
          {title2}
        </Text>
      </View>
      <FlatList
        data={data}
        horizontal
        style={{marginHorizontal: 0, backgroundColor: DefaultBackgroundColor}}
        contentContainerStyle={{
          backgroundColor: DefaultBackgroundColor,
          paddingVertical: 10,
        }}
        ItemSeparatorComponent={
          <View
            style={{
              width: 30,
              //  height: height,
              //  backgroundColor: DefaultBackgroundColor,
            }}></View>
        }
        ListHeaderComponent={<View style={{width: 30, height: height}}></View>}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={<View style={{width: 30, height: height}}></View>}
        renderItem={({item, index}) => {
          return (
            <Pressable
              onPress={() => {
                setSubPage(item.name);
                setShowHeader(false);
                navigation.navigate('Deal', {item: item});
              }}
              style={{
                width: _width,
                height: height + 10,
                // backgroundColor: 'red',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                //backgroundColor: '#ffffff',
                borderRadius: 10,
                // borderWidth: 1,
                // borderColor: White,
              }}>
              <FastImage
                resizeMode={FastImage.resizeMode.stretch}
                source={item?.image}
                style={{
                  width: _width,
                  height: height,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderRadius: 10,
                  //   borderWidth: 1,
                  //   borderColor: White,
                }}
              />
              <View
                style={{
                  width: _width,
                  height: 9,
                  //  backgroundColor: Orange,
                }}></View>
              <View
                style={{
                  width: _width,
                  height: 0.8,
                  backgroundColor: Orange,
                }}></View>
            </Pressable>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* <View style={{height: 10, width: width}}></View> */}
    </View>
  );
};
export default DealsFlatList;
