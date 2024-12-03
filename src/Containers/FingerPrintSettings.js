import React from 'react';
import styled from 'styled-components/native';
import {Switch} from 'react-native';
import {connect} from 'react-redux';
import {Translate, Font} from '../Helpers';
import {SetTouchID} from '../actions';
import {
  BackgroundBlue,
  DefaultBackgroundColor,
  SecondBlue,
} from '../assets/colors';

const Container = styled.View`
  background-color: ${DefaultBackgroundColor};
`;

const Body = styled.ScrollView`
  background-color: ${DefaultBackgroundColor};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 15px;
  padding-top: 30px;
  min-height: 100%;
`;

const TitleText = styled.Text`
  font-size: 18px;
  text-align: left;
  font-weight: 900;
  color: ${SecondBlue};
  text-align: left;
  font-family: ${Font};
`;
const SubtitleText = styled.Text`
  font-size: 14px;
  text-align: center;
  font-weight: 900;
  color: darkgrey;
  text-align: left;
  font-family: ${Font};
  margin-bottom: 20px;
`;
const TitleContainer = styled.View`
  flex: 1;
`;

const Toggle = styled.View`
  width: 70px;
  background: red;
`;

const RowContainer = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-color: lightgrey;
`;

function ChangePassword(props) {
  console.log(props);
  return (
    <Container>
      <Body>
        <RowContainer>
          <TitleContainer>
            <TitleText>{Translate('Unlock with fingerprint')}</TitleText>
            <SubtitleText>
              {Translate(
                'When enabled, you can use fingerprint to login. You can still login using password.',
              )}
            </SubtitleText>
          </TitleContainer>
          <Switch
            disabled={!props.tokenBM.isSupported}
            onChange={() => props.SetTouchID(!props.tokenBM.enable)}
            value={props.tokenBM.enable}
          />
        </RowContainer>
      </Body>
    </Container>
  );
}

const mapStateToProps = state => ({
  user: state.user,
  tokenBM: state.tokenBM,
});

const mapDispatchToProps = dispatch => ({
  SetTouchID: status => {
    dispatch(SetTouchID(status));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
