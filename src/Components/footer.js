import React from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import BitcoinIcon from 'react-native-vector-icons/FontAwesome5';
import HomeIcon from 'react-native-vector-icons/Feather';
import NotificationIcon from 'react-native-vector-icons/Ionicons';
import MoreIcon from 'react-native-vector-icons/Foundation';
import WalletIcon from 'react-native-vector-icons/AntDesign';

const Container = styled.View`
  padding: 15px;
  padding-top: 5px;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  ${() => (Platform.OS === 'ios' ? 'padding-top:10px' : 'padding-top: 20px')};
  border-bottom-width: 1px;
  border-color: lightgrey;
  background-color: #050a68;
  height: 75px;
  align-items: center;
  justify-content: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 240px;
`;
const Bottom = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Tester = styled.View`
  width: 80px;
  height: 80px;
  background-color: #050a68;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  top: -10;
`;
const ItemContainer = styled.View`
  flex-direction: column-reverse;
  align-items: center;
  margin-bottom: 15px;
`;
const Title = styled.Text`
  color: white;
`;

export default function Header({wallet, title, balance}) {
  return (
    <Container>
      <Bottom>
        <ItemContainer>
          <Title>Location</Title>
          <BitcoinIcon name="bitcoin" size={30} color="white" />
        </ItemContainer>
        <ItemContainer>
          <Title>Wallet</Title>
          <WalletIcon name="wallet" size={30} color="white" />
        </ItemContainer>
        <Tester>
          <HomeIcon name="home" size={30} color="white" />
          <Title>Home</Title>
        </Tester>
        <ItemContainer>
          <Title>Notification</Title>
          <NotificationIcon name="md-notifications" size={30} color="white" />
        </ItemContainer>
        <ItemContainer>
          <Title>More</Title>

          <MoreIcon name="indent-more" size={30} color="white" />
        </ItemContainer>
      </Bottom>
    </Container>
  );
}

Header.defaultProps = {
  balance: 0,
  wallet: 0,
  title: 'Header',
};
