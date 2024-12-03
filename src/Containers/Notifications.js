import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {
  Dimensions,
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {EmptyData} from '../Components';
const {width, height} = Dimensions.get('window');
import {Translate, Font} from '../Helpers';
import {connect} from 'react-redux';
import {PopUser, UpdatedAccounts} from '../actions';
import * as RootNavigation from '../Navigation/RootNavigation';
import axios from 'axios';
import {parseString} from 'react-native-xml2js';
import {serverLink, getXmlData} from '../Helpers';
import {DataContext} from '../context/dataContext';
import {BackgroundBlue, DefaultBackgroundColor} from '../assets/colors';

function Notification(props) {
  const {notifications, fcmToken, setNotifications} = useContext(DataContext);
  const userid = props.user.UserId;
  const [refreshing, setRefreshingh] = useState(false);

  const updatePayment = async () => {
    console.log(`updatePayment`);
    setRefreshingh(true);
    const xmls = `<?xml version="1.0" encoding="utf-8"?>
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                      <CheckBalance xmlns="http://tempuri.org/">
                      <UserId>${userid}</UserId>
                      <FCMtoken>${fcmToken}</FCMtoken>
                    </CheckBalance>
                    </soap:Body>
                    </soap:Envelope>
                    `;
    await axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/CheckBalance',
        },
      })
      .then(res => {
        parseString(res.data.toString(), (err, result) => {
          if (err) {
            setRefreshingh(false);
            console.log(err);
          }
          const serverData = getXmlData(result, 'CheckBalance');
          setNotifications(serverData['UserNotifications']);
          if (serverData.ErrorMessage === '') {
            for (var i = 0; i < serverData.Accounts.length; i++) {
              if (serverData.Accounts[i].Balance === '-999999999') {
                serverData.Accounts[i].Balance = 'Variables.notAvailable';
                serverData.Accounts[i].Currency = '';
              }
            }
            props.updateAccount(serverData);
            setRefreshingh(false);
          } else {
            console.log({errorMessage: serverData.ErrorMessage});
            setRefreshingh(false);
          }
        });
      })
      .catch(err => {
        console.error(err); /* eslint-disable-line */
        setRefreshingh(false);
      });
  };
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      updatePayment();
    });

    return unsubscribe;
  }, [props.navigation]);
  useEffect(() => {
    updatePayment();
  }, []);
  const renderItem = ({item}) => {
    const {NotificationBody, NotificationDateTime, NotificationTitle, UserId} =
      item;

    const date = NotificationDateTime.split(' ')[0];
    const time =
      NotificationDateTime.split(' ')[1] +
      ' ' +
      NotificationDateTime.split(' ')[2];

    return (
      <View style={Styles.item}>
        <Text style={Styles.dateTime}>{date}</Text>
        <Text style={Styles.dateTime}>{time}</Text>
        <Text style={Styles.notificationBody}>{NotificationBody}</Text>
      </View>
    );
  };
  return (
    <FlatList
      style={{backgroundColor: DefaultBackgroundColor}}
      refreshControl={
        <RefreshControl
          enabled={true}
          refreshing={refreshing}
          onRefresh={updatePayment}
          style={{backgroundColor: 'transparent'}}
          tintColor="transparent"
        />
      }
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      extraData={notifications}
      data={notifications}
      renderItem={renderItem}
      ItemSeparatorComponent={
        <View
          style={{backgroundColor: DefaultBackgroundColor, height: 15}}></View>
      }
      ListHeaderComponent={
        <View
          style={{backgroundColor: DefaultBackgroundColor, height: 40}}></View>
      }
      ListEmptyComponent={<EmptyData height={200} width={width} />}
    />
  );
}
const Styles = StyleSheet.create({
  item: {paddingVertical: 10, marginHorizontal: 10},
  dateTime: {color: 'white', textDecorationColor: 'white', fontSize: 16},
  notificationBody: {
    color: 'white',
    textDecorationColor: 'white',
    fontSize: 18,
  },
});
const mapStateToProps = state => ({
  user: state.user,
  tokenBM: state.tokenBM,
  userInfo: state.userInfo,
  accounts: state.accounts,
  defaultAccount: state.defaultAccount,
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => {
    dispatch(PopUser());
  },
  updateAccount: accounts => {
    dispatch(UpdatedAccounts(accounts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
