import React, {useState, useEffect, useContext, useRef} from 'react';
import styled from 'styled-components/native';
import {
  FlatList,
  View,
  Button as RNButton,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Text,
  RefreshControl,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {parseString} from 'react-native-xml2js';
import axios from 'axios';
import {DataContext} from '../context/dataContext';
import {UpdatedAccounts} from '../actions';

import {
  getXmlData,
  Translate,
  Font,
  EnglishFont,
  serverLink,
  getKeyChain,
} from '../Helpers';
import {connect} from 'react-redux';

const BalanceList = props => {
  const {width, height} = useWindowDimensions();

  const {fcmToken} = useContext(DataContext);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  const [ListData, setListData] = useState([]);
  const [FilteredListData, setFilteredListData] = useState([]);
  const [text, onChangeText] = React.useState('');
  const {user, accounts, defaultAccount} = props;
  const inputRef = useRef();
  const getList = async () => {
    setLoading(true);
    const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <CheckLimit xmlns="http://tempuri.org/">
        <UserId>${user.UserId}</UserId>
        <MerchantId></MerchantId>
        <FCMtoken>${fcmToken}</FCMtoken>
        <Security></Security>
      </CheckLimit>
    </soap:Body>
  </soap:Envelope>`;

    console.log(xmls);
    await axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/CheckLimit',
        },
      })
      .then(res => {
        parseString(res.data.toString(), (err, result) => {
          if (err) {
            return err;
          }
          const serverData = getXmlData(result, 'CheckLimit');
          console.log('serverData');
          console.log(serverData['GetUserLimit'].length);
          if (serverData.ErrorMessage === '') {
            var newList = serverData['GetUserLimit'];
            newList.sort((a, b) => {
              return parseFloat(b.Limit) - parseFloat(a.Limit);
            });
            setListData(newList);
            setFilteredListData(newList);
            setLoading(false);
          } else {
            setErrorMessage(Translate(serverData.ErrorMessage));
            setLoading(false);
          }
        });
      })
      .catch(() => {
        setLoading(false);
        setErrorMessage(Translate('Something went wrong'));
      });
  };
  useEffect(() => {
    getList();
  }, [accounts, defaultAccount, user.UserId]);

  const FilterData = txt => {
    if (txt.length >= 1) {
      var newList = ListData.filter(function (item) {
        return (
          item.MerchantName.includes(txt) || item.MerchantMobile.includes(txt)
        );
      });
      console.log(newList.length);
      setFilteredListData(newList);
    } else {
      setFilteredListData(ListData);
    }
  };

  const HandleonChangeText = txt => {
    onChangeText(txt);
    FilterData(txt);
  };
  const RenderItem = ({item, index}) => {
    const {Limit, MerchantName, MerchantMobile, UserId} = item;
    if (index == 0) {
      console.log(item);
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 35,
          justifyContent: 'space-between',
          marginHorizontal: 20,
          borderBottomWidth: 0.5,
          direction: 'ltr',
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 35,
            width: '40%',
          }}>
          <Text style={Styles.TextStyle}>{index + 1 + '_ '}</Text>
          <Text style={Styles.TextStyle}>{MerchantName}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 35,
            width: '40%',
          }}>
          <Text style={Styles.TextStyle}>{MerchantMobile}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 35,
            width: '20%',
          }}>
          <Text style={Styles.TextStyle}>{Limit}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <View>
        <TextInput
          onChangeText={text => HandleonChangeText(text)}
          value={text}
          style={Styles.InputStyle}
          placeholder={Translate('SearchByName')}
        />
        <View
          style={{
            flexDirection: 'row',
            height: 35,
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              height: 35,
              width: '40%',
            }}>
            <Text style={Styles.TextStyleHeader}>
              {Translate('MerchantName')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 35,
              width: '40%',
            }}>
            <Text style={Styles.TextStyleHeader}>{Translate('Mobile')}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 35,
              width: '20%',
            }}>
            <Text style={Styles.TextStyleHeader}>{Translate(`Limit`)}</Text>
          </View>
        </View>
      </View>
      <FlatList
        style={{flex: 1, flexGrow: 1}}
        data={FilteredListData}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        extraData={[FilteredListData, ListData]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <RenderItem item={item} index={index} />}
        ItemSeparatorComponent={<View style={{height: 15}}></View>}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={loading}
            onRefresh={getList}
            style={{backgroundColor: 'transparent'}}
            tintColor="transparent"
          />
        }
        initialNumToRender={FilteredListData.length}
        ListHeaderComponent={<View></View>}
        ListEmptyComponent={
          !loading && (
            <View>
              <Text style={Styles.TextStyle}>{Translate(`NoData`)}</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  defaultAccount: state.defaultAccount,
  accounts: state.accounts,
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  updateAccount: accounts => {
    dispatch(UpdatedAccounts(accounts));
  },
});
const Styles = StyleSheet.create({
  TextStyle: {
    padding: 5,
    textAlign: 'center',
    fontFamily: Font,
    justifyContent: 'center',
    fontSize: 14,
    //lineHeight: 20,
  },
  TextStyleHeader: {
    padding: 5,
    textAlign: 'center',
    fontFamily: Font,
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  InputStyle: {
    //padding: 5,
    //textAlign: 'center',
    fontFamily: Font,
    justifyContent: 'center',
    fontSize: 16,
    height: 40,
    margin: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    padding: 10,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(BalanceList);
