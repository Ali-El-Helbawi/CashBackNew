import React from 'react';
import styled from 'styled-components/native';
import {EnglishFont} from '../Helpers';
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Linking} from 'react-native';
import {
  BackgroundBlue,
  BlueColor,
  DefaultBackgroundColor,
  LightBlue,
  Orange,
} from '../assets/colors';

const Container = styled.View`
  background-color: ${DefaultBackgroundColor};
`;

const Body = styled.ScrollView`
  padding: 10px;
  background-color: ${DefaultBackgroundColor};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding-top: 30px;
  min-height: 100%;
`;

const RowContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  border-width: 1px;
  border-color: ${DefaultBackgroundColor};
  background: ${BlueColor};
  border-radius: 8px;
  margin-bottom: 10px;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  background: ${DefaultBackgroundColor};
  border-width: 1px;
  border-color: ${DefaultBackgroundColor};
  border-radius: 40px;
  align-items: center;
  justify-content: center;
`;
const Text = styled.Text`
  width: 200px;
  text-align: left;
  color: white;
  font-weight: bold;
  font-size: 15px;
  font-family: ${EnglishFont};
`;
const AdressText = styled.Text`
  width: 200px;
  text-align: left;
  color: white;
  font-weight: bold;
  font-size: 15px;
  font-family: ${EnglishFont};
`;

function ContactRow(props) {
  return (
    <RowContainer
      activeOpacity={0.85}
      onPress={() => Linking.openURL(props.link)}>
      <IconContainer>
        <MIcons name={props.icon} size={25} color={BlueColor} />
      </IconContainer>
      <Text>{props.title}</Text>
    </RowContainer>
  );
}

const address = `الحدائق شارع السودان بجوار محطة الكهرباء 71
بنغازي - ليبيا`;
function ContactUs(props) {
  return (
    <Container>
      <Body>
        <ContactRow
          link="https://www.facebook.com/CashA2Bback?mibextid=LQQJ4d"
          title="CashA2Bback"
          icon="facebook"
        />
        {/* <ContactRow
          link="http://m.me/a2blibya"
          title="a2blibya"
          icon="facebook-messenger"
        /> */}
        <ContactRow
          link="http://www.cashback.com.ly/"
          title="www.cashback.com.ly"
          icon="web"
        />
        <ContactRow
          link="mailto:info@cashback.com.ly"
          title="info@cashback.com.ly"
          icon="email"
        />
        <ContactRow
          link="mailto:info.cashback@outlook.com"
          title="info.cashback@outlook.com"
          icon="email"
        />
        <ContactRow
          link="tel:+218 91-8266703"
          title="+218 91-8266703"
          icon="phone"
        />
        <ContactRow
          link="tel:+218 94-5492063"
          title="+218 94-5492063"
          icon="phone"
        />
        <RowContainer activeOpacity={0.85} onPress={() => {}}>
          <IconContainer>
            <Entypo name={`address`} size={25} color={BlueColor} />
          </IconContainer>
          <AdressText>{address}</AdressText>
        </RowContainer>
      </Body>
    </Container>
  );
}

export default ContactUs;
