import React, {useEffect, useState, useContext} from 'react';
import {StatusBar, I18nManager, Dimensions, Pressable} from 'react-native';
import styled from 'styled-components/native';
import SafeArea from 'react-native-safe-area';
import AnimatedLinearGradient, {presetColors} from './AnimatedGradient';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {connect} from 'react-redux';
import {GetAccount, PopUser} from '../actions';
import {Translate, Font} from '../Helpers';
import {Button} from '../Components';
import Modal from 'react-native-modal';
import * as RootNavigation from '../Navigation/RootNavigation';
import {DataContext} from '../context/dataContext';
const {width} = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BackgroundBlue,
  Gray,
  LightBlue,
  Orange,
  White,
  Yellow,
} from '../assets/colors';

const HeaderColumns = styled.Text`
  color: #ffffff;
  font-size: 10px;
  font-family: ${Font};
  line-height: 12px;
  font-weight: 400;
  text-transform: uppercase;
  padding: 5px;
  padding-bottom: 8px;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: space-between;

  width: ${props => (props.center ? `${width - 90}px` : '35px')};
  align-items: center;
  padding-top: 5px;
`;

const Amount = styled.Text`
  color: lightgrey;
  font-size: 16px;
  font-weight: 700;
`;

const HeaderTitle = styled.Text`
  color: ${props => (props.isVIP ? '#B49854' : 'white')};
  font-size: 20px;
  font-family: ${Font};
`;

const Info = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

const WalCon = styled.View`
  flex-direction: column;
  align-items: center;
  width: 130px;
  margin-top: 10px;
`;

const Circle = styled.View`
  width: 400px;
  height: 400px;
  border-radius: 200px;
  position: absolute;
  left: -250px;
  bottom: -10px;
  background: #01afd2;
  opacity: 0.075;
`;

const LinearStyle = {
  padding: 10,
  paddingTop: 5,
  justifyContent: 'space-between',
  flexDirection: 'row',
  height: 105,
};

const ButtonHeader = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  border-radius: 50px;
  background-color: rgba(216, 216, 216, 0.25);
  background-color: rgba(255, 255, 255, 1);
  background-color: ${LightBlue};
  align-items: center;
  justify-content: center;
  ${props =>
    props.margin
      ? `margin-top: 12px;background-color: rgba(216, 216, 216, 0.1);`
      : ''}
`;

const ModalBody = styled.View`
  background: white;
  height: 400px;
  border-radius: 8px;
  padding: 20px;
`;
const ModalTitle = styled.Text`
  font-size: 18px;
  text-align: center;
  font-weight: 900;
  color: #101274;
  text-align: left;
  font-family: ${Font};
`;
const ModalSwitchContainer = styled.View``;
const SwitchBtn = styled.TouchableOpacity`
  margin-top: 10px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #cfcfcf;
  border-radius: 4px;
  width: 100%;
  height: 56px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;
const BtnTitle = styled.Text`
  color: black;
  font-family: Arial;
  font-size: 18px;
  line-height: 18px;
  font-weight: 400;
  text-align: center;
`;
const Indicator = styled.View`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #979797;
  border-radius: 17px;
  width: 17px;
  height: 17px;
  shadow-color: #000;
  shadow-offset: 0px -5px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
  align-items: center;
  justify-content: center;
`;
const Selected = styled.View`
  background-color: #0b0a0a;
  border-radius: 11px;
  shadow-color: #000;
  shadow-offset: 0px -5px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
  width: 11px;
  height: 11px;
`;
const ButtonContainer = styled.View`
  margin-top: 50px;
  position: absolute;
  bottom: 10px;
  width: ${width - width * 0.1 - 20}px;
  left: 10px;
`;

const FlatList = styled.FlatList``;
const View = styled.View``;

function HeaderLeftBtns(props) {
  return (
    <>
      <ButtonHeader onPress={props.openModal}>
        <MaterialCommunityIcons name="account-switch" size={18} color={White} />
      </ButtonHeader>
      {props.card && (
        <ButtonHeader
          margin
          onPress={() => props.navigation.navigate('Cards History')}>
          <Fontisto name="history" size={16} color={White} />
        </ButtonHeader>
      )}
    </>
  );
}
function HeaderRightBtns(props) {
  const {setIsLogin} = useContext(DataContext);
  const {
    userInfo,
    userAccounts,
    subPage,
    setSubPage,
    showHeader,
    setShowHeader,
  } = useContext(DataContext);
  const pageName = RootNavigation.navigationRef.current.getCurrentRoute().name;
  return (
    <>
      {pageName == 'Home' ? (
        <ButtonHeader
          onPress={() => {
            props.onLogout();
            setIsLogin(false);
            props.navigation.navigate('Login');
          }}>
          <SLIcon name="lock" size={18} color={White} />
        </ButtonHeader>
      ) : (
        <ButtonHeader
          // onPress={() => props.navigation.dispatch(NavigationActions.back())}
          onPress={() => {
            if (pageName == 'Info') {
              RootNavigation.navigate('Home');
            } else {
              setSubPage('');
              setShowHeader(true);
              RootNavigation.back();
            }
          }}>
          <IIcon
            name={I18nManager.isRTL ? 'ios-arrow-forward' : 'ios-arrow-back'}
            size={18}
            color={White}
          />
        </ButtonHeader>
      )}
    </>
  );
}
function Header(props, {accountNumber, title, balance, rightBtns, leftBtns}) {
  const {
    userInfo,
    userAccounts,
    subPage,
    setSubPage,
    showHeader,
    setShowHeader,
  } = useContext(DataContext);
  const [topPadding, setTopPadding] = useState(0);
  const [isHome, setHome] = useState(false);
  const [isTransfer, setTransfer] = useState(false);
  const [isVIP, setVIP] = useState(false);
  const [isCards, setCards] = useState(false);
  const [isModal, setModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(props.defaultAccount);
  const [headerTitle, setHeaderTitle] = useState('');

  useEffect(() => {
    SafeArea.getSafeAreaInsetsForRootView().then(result => {
      setTopPadding(result.safeAreaInsets.top);
    });

    // let Title = '';
    // if (props.route.routes) {
    //   const CurRoute = props.route.routes[props.route.index];
    //   if (CurRoute.routes) {
    //     Title = CurRoute.routes[CurRoute.index].routeName;
    //   } else {
    //     Title = CurRoute.key;
    //   }
    // } else {
    //   Title = props.route.name;
    // }
    var Title = RootNavigation.navigationRef.current.getCurrentRoute().name;
    if (Title == 'CashBackStart' || Title == 'CashBackConfirm') {
      Title = Translate('CashBack');
    }
    if (Title == 'HomeServices') {
      Title = Translate('Services');
    }
    if (Title == 'Cards' || Title == 'CardsDenominations') {
      Title = Translate('Cards');
    }
    if (!showHeader) {
      Title = subPage;
    }
    console.log('title: ' + Title);
    // console.log(props.route);
    setHome(Title === 'Home');
    setTransfer(Title === 'Transfer' || Title === 'Receive');
    setVIP(Title === 'VIP');
    setCards(Title === 'Cards' || Title === 'CardsDenominations');
    setHeaderTitle(
      Translate(
        Title === 'Home'
          ? I18nManager.isRTL
            ? props.user.ArabicName
            : props.user.FullName
          : Title,
        I18nManager.isRTL ? 'ar' : 'en',
      ),
    );
  }, [
    props.navigation,
    props.user,
    props.user.ArabicName,
    props.user.fullName,
    RootNavigation.navigationRef.current.getCurrentRoute().name,
  ]);
  if (isVIP && !props.getHeader) {
    return <StatusBar backgroundColor="#00042B" barStyle="light-content" />;
  }
  function getCustomColor() {
    if (isTransfer) {
      return presetColors.A2B_Transfer;
    }
    if (isVIP) {
      return presetColors.A2B_VIP;
    }
    return presetColors.A2B;
  }
  const AccountTitle = I18nManager.isRTL ? ' الحساب' : 'Account ';
  const PanValue =
    userInfo && userInfo.CashBackPercentage
      ? props.accounts[props.defaultAccount].Pan
      : '';
  return (
    <View renderToHardwareTextureAndroid={true}>
      {/* <AppTab.Screen
        name="More"
        component={HomeStack}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.toggleDrawer();
          },
        })}
        options={{
          tabBarOnPress: ({navigation, defaultHandler}) => {},
          tabBarIcon: ({color}) => (
            <MIcon name="text" color={color} size={24} />
          ),
        }}
      /> */}
      <Modal useNativeDriver={true} animationIn="slideInUp" isVisible={isModal}>
        <ModalBody>
          <ModalTitle>{Translate('Choose Account')}</ModalTitle>
          <ModalSwitchContainer>
            <FlatList
              data={props.accounts}
              keyExtractor={item => item.Pan}
              renderItem={account => {
                const {item, index} = account;
                return (
                  <SwitchBtn
                    activeOpacity={0.7}
                    onPress={() => setSelectedAccount(index)}>
                    <BtnTitle>{item.Pan}</BtnTitle>
                    <Indicator>
                      {selectedAccount === index && <Selected />}
                    </Indicator>
                  </SwitchBtn>
                );
              }}
            />
          </ModalSwitchContainer>
          <ButtonContainer>
            <Button
              secondary
              onPress={() => {
                props.onChangeAccount(selectedAccount);
                setModal(false);
              }}
              title={Translate('Save')}
            />
          </ButtonContainer>
        </ModalBody>
      </Modal>
      <AnimatedLinearGradient
        points={{start: {x: 1.0, y: 0.0}, end: {x: 0.0, y: 0.0}}}
        style={[
          LinearStyle,
          {paddingTop: topPadding + 5, height: 105 + topPadding},
        ]}
        speed={10000}
        customColors={getCustomColor()}>
        <StatusBar backgroundColor={BackgroundBlue} barStyle="light-content" />
        <Circle />
        <Column>
          <HeaderRightBtns Home={isHome} {...props} />
        </Column>
        <Column center={true}>
          <HeaderTitle isVIP={isVIP}>{headerTitle}</HeaderTitle>
          <Info>
            <WalCon>
              <HeaderColumns>{AccountTitle + PanValue}</HeaderColumns>
              <Amount>
                {userInfo && userInfo.CashBackPercentage
                  ? userInfo.CashBackPercentage + ' %'
                  : props.accounts[props.defaultAccount].Pan}
              </Amount>
            </WalCon>
            <WalCon>
              <HeaderColumns>
                {I18nManager.isRTL ? 'الرصيد' : 'Balance'}
              </HeaderColumns>
              <Amount>{`${props.accounts[props.defaultAccount].Balance} ${
                props.accounts[props.defaultAccount].Currency
              }`}</Amount>
            </WalCon>
          </Info>
        </Column>
        <Column>
          <HeaderLeftBtns
            card={isCards}
            openModal={() => setModal(true)}
            Home={isHome}
            {...props}
          />
          {!isCards && (
            <ButtonHeader onPress={() => props.navigation.toggleDrawer()}>
              <MIcon name="text" color={White} size={24} />
            </ButtonHeader>
          )}
        </Column>
      </AnimatedLinearGradient>
    </View>
  );
}

Header.defaultProps = {
  balance: 0,
  accountNumber: 0,
  title: 'Header',
};

const mapDispatchToProps = dispatch => ({
  onChangeAccount: account => {
    dispatch(GetAccount(account));
  },
  onLogout: () => {
    dispatch(PopUser());
  },
});

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  accounts: state.accounts,
  user: state.user,
  defaultAccount: state.defaultAccount,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
