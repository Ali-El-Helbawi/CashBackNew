import React from 'react';
import styled from 'styled-components/native';
import {Platform} from 'react-native';

const Container = styled.View`
  padding: 10px;
  flex-direction: row-reverse;
  /* box-shadow: 10px 10px 12px rgb(224, 224, 224); */
`;

const ItemContainer = styled.TouchableOpacity`
  shadow-color: gray;
  shadow-opacity: 0.25;
  ${() => (Platform.OS === 'ios' ? 'elevation: 4;' : 'elevation: 7;')};
  border-radius: 8px;
  background-color: #040a3d;
  width: 100%;
  height: 57px;
  ${props => props.extraStyle}
  flex-direction:row;
  justify-content: flex-end;
  align-items: center;
  padding-left: 75px;
`;

const Title = styled.Text`
  color: white;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  padding: 12px;
  ${props => props.textStyle}
  flex:1;
`;

const IconContainer = styled.Text`
  width: 60px;
  height: 40px;
  background: white;
  margin-right: 20px;
`;

export default function Button({onPress, primary, title, styles}) {
  return (
    <Container>
      <ItemContainer extraStyle={styles} onPress={onPress}>
        <Title>{title}</Title>
        <IconContainer />
      </ItemContainer>
    </Container>
  );
}

Button.defaultProps = {
  primary: true,
  title: 'button',
};
