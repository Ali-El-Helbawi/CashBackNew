import React from 'react';
import {Platform, I18nManager} from 'react-native';
import styled from 'styled-components/native';

const ArabicFont = Platform.OS === 'ios' ? 'GE SS Two' : 'GE-SS-Two-Bold';
const Font = I18nManager.isRTL ? ArabicFont : 'Arial';
import {MainButton, SecondaryButton} from '../assets/colors';
const ButtonContainer = styled.TouchableOpacity`
  margin-top: 5px;
  margin-bottom: 5px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.23;
  shadow-radius: 2.62px;
  elevation: 2;
  border-radius: 8px;
  width: 100%;
  height: 57px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${props => `background-color: ${props.secondary ? '#005AF7' : MainButton};`}
  ${props =>
    `background-color: ${props.gold ? 'rgba(180,152,84,0.17)' : MainButton};`}
  ${props => `${props.disabled ? 'background-color: #536872;' : ''}`}
  ${props => props.extraStyle}
  ${props =>
    props.gold ? 'border-color: rgba(180,152,84,0.70); border-width: 1px' : ''}
`;

const Title = styled.Text`
  color: #ffffff;
  font-family: ${Font};
  font-size: 21px;
  font-weight: 500;
  line-height: 25px;
  text-align: left;
  ${props => props.textStyle}
  color: ${props => (props.gold ? '#b49854' : '#ffffff')}
`;

const Circle = styled.View`
  width: 600px;
  height: 600px;
  border-radius: 600px;
  position: absolute;
  right: 20px;
  bottom: -100px;
  ${props => `background: ${props.secondary ? MainButton : '#01afd2'};`}
  ${props => `background: ${props.gold ? 'rgba(180,152,84,0.17)' : '#01afd2'};`}
  ${props => `${props.disabled ? 'background-color: black;' : ''}`}
  opacity: 0.15;
`;

const IconContainer = styled.View`
  position: absolute;
  left: 20px;
`;

export default function Button({
  onPress,
  primary,
  title,
  styles,
  textStyle,
  icon,
  secondary,
  disabled,
  gold,
}) {
  return (
    <ButtonContainer
      disabled={disabled}
      secondary={secondary}
      activeOpacity={disabled ? 0 : 0.7}
      extraStyle={styles}
      gold={gold}
      onPress={disabled ? null : onPress}>
      <Circle disabled={disabled} gold={gold} secondary={secondary} />
      <Title gold={gold} textStyle={textStyle}>
        {title}
      </Title>
      <IconContainer>{icon}</IconContainer>
    </ButtonContainer>
  );
}

Button.defaultProps = {
  primary: true,
  title: 'button',
};
