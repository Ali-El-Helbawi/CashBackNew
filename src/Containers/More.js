import React from 'react';
import styled from 'styled-components/native';
import {BackgroundBlue} from '../assets/colors';

const Container = styled.View`
  background-color: ${BackgroundBlue};
`;

const Body = styled.ScrollView`
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding-top: 30px;
  min-height: 100%;
`;

function More(props) {
  return (
    <Container>
      <Body />
    </Container>
  );
}

export default More;
