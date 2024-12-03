import React from 'react';
import styled from 'styled-components/native';
import {Linking, Platform, View, Text} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Directions from 'react-native-vector-icons/FontAwesome5';
import {Font, Translate} from '../Helpers';

const Name = styled.Text`
  color: black;
  font-size: 18px;
  font-family: ${Font};
  text-align: left;
  width: 100%;
  ${props => props.textStyle};
`;
const Location1 = styled.Text`
  color: grey;
  font-size: 16px;
  font-family: ${Font};
  text-align: left;
  width: 100%;
  ${props => props.textStyle};
`;
const Location2 = styled.Text`
  color: grey;
  font-size: 16px;
  font-family: ${Font};
  text-align: left;
  width: 100%;
  ${props => props.textStyle}
`;

const Info = styled.View`
  align-items: flex-end;
`;
const Contact = styled.View`
  align-items: center;
  flex-direction: row;
  margin-left: 15px;
`;
const ContactItem = styled.TouchableOpacity`
  align-items: center;
  flex-direction: column;
  text-align: center;
  align-items: center;
  margin-left: 10px;
`;
const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;
const Title = styled.Text`
  color: #3299fa;
  text-align: center;
  font-family: ${Font};
`;

const Box = styled.TouchableOpacity`
  padding: 10px 20px;
  width: 100%;
  border-bottom-color: #c2c2c241;
  border-bottom-width: 1px;
  height: 90px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export default function LocationItem({
  name,
  addressLine1,
  addressLine2,
  loc2,
  styles,
  phone,
  textStyle,
  onPress,
  lat,
  lng,
  CashBackPercentage,
}) {
  const opneGoogleMap = () => {
    const latitude = lat;
    const longitude = lng;
    try {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${latitude},${longitude}`;
      const label = encodeURIComponent(name);
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box onPress={onPress} activeOpacity={0.8}>
      <Info>
        <Name textStyle={textStyle}>{name}</Name>
        <Location1 textStyle={textStyle}>{addressLine1}</Location1>
        <Location2 textStyle={{textStyle}}>{addressLine2}</Location2>
      </Info>
      {CashBackPercentage && CashBackPercentage != '' && (
        <View
          style={{
            alignContent: 'flex-start',
            alignItems: 'flex-start',
            alignSelf: 'baseline',
          }}>
          <Name textStyle={textStyle}>{`كاش باك`}</Name>
          <Name textStyle={{color: 'red'}}>{CashBackPercentage + ' %'}</Name>
        </View>
      )}
      <Contact>
        <ContactItem onPress={() => Linking.openURL(`tel:${phone}`)}>
          <IconContainer>
            <FIcon name="phone" size={25} color="#3299FA" />
          </IconContainer>
          <Title>{Translate('Call')}</Title>
        </ContactItem>
        <ContactItem
          onPress={() => {
            opneGoogleMap();
          }}>
          <IconContainer>
            <Directions name="directions" size={25} color="#3299FA" />
          </IconContainer>
          <Title>{Translate('Directions')}</Title>
        </ContactItem>
      </Contact>
    </Box>
  );
}

// LocationItem.defaultProps = {
//   name: 'مخبز ابو عبدالله',
//   addressLine1: 'بجانب',
//   addressLine2: 'خلف',
// };
