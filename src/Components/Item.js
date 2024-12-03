import React from 'react';
import styled from 'styled-components/native';
import {Platform} from 'react-native';

const Container = styled.View`
  padding: 10px;
  /* box-shadow: 10px 10px 12px rgb(224, 224, 224); */
`;

const ItemContainer = styled.TouchableOpacity`
  shadow-color: gray;
  shadow-opacity: 0.25;
  ${() => (Platform.OS === 'ios' ? 'elevation: 4;' : 'elevation: 7;')};
  border-radius: 6px;
  background-color: white;
  width: 100%;
  height: 50px;
  align-items: flex-end;
`;

const Title = styled.Text`
  color: black;

  font-size: 20px;
  font-weight: 500;
  padding: 12px;
  ${props => props.textStyle}
`;

export default function Item({title}) {
  return (
    <Container>
      <ItemContainer>
        <Title>{title}</Title>
      </ItemContainer>
    </Container>
  );
}
