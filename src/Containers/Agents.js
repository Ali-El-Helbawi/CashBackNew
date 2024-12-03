/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useContext} from 'react';
import styled from 'styled-components/native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {
  Dimensions,
  Platform,
  I18nManager,
  View,
  FlatList,
  Text,
} from 'react-native';
import {LocationItem} from '../Components';
import EIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Feather';
import SlidingUpPanel from 'rn-sliding-up-panel';
import axios from 'axios';
import {parseString} from 'react-native-xml2js';
import {getUniqueId} from 'react-native-device-info';
import {getXmlData, serverLink, Font, Translate} from '../Helpers';
import {DataContext} from '../context/dataContext';
import SelectDropdown from 'react-native-select-dropdown';
import {BackgroundBlue} from '../assets/colors';

const {height} = Dimensions.get('window');

const Container = styled.View`
  background-color: ${BackgroundBlue};
`;

const Body = styled.View`
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  min-height: 100%;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
`;
const ContainerOver = styled.View`
  width: 100%;
  position: absolute;
`;
// const FlatList = styled.FlatList.attrs(() => ({
//   contentContainerStyle: {
//     paddingBottom: 320,
//   },
// }))``;

const CategoriesList = styled.FlatList.attrs(() => ({
  contentContainerStyle: {
    minWidth: '100%',
  },
}))``;

const PanelContainer = styled.View`
  background: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
  flex: 1;
`;
const Handler = styled.View`
  width: 50px;
  align-self: center;
  height: 5px;
  border-radius: 5px;
  background: #c4c4c6;
  margin-top: 10px;
  margin-bottom: 5px;
`;
const UpperContainer = styled.View`
  position: absolute;
  width: 100%;
  padding-top: 10px;
  top: 0;
  overflow: hidden;
`;
const CountrySearchbar = styled.TouchableOpacity`
  height: 45px;
  width: 95%;
  align-self: center;
  border-radius: 30px;
  overflow: hidden;
  margin-bottom: 5px;
  background: white;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.23;
  shadow-radius: 2.62px;
  elevation: 2;
  flex-direction: row;
  padding: 5px 5px 5px 20px;
  align-items: center;
  justify-content: space-between;
`;
const CategorySearchbar = styled.View`
  height: 45px;
  width: 100%;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.5;
  shadow-radius: 1.62px;
  elevation: 2;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const Items = styled.TouchableOpacity`
  height: 30px;
  // background: ${props => (props.isActive ? 'white' : 'lightgrey')};
  background-color: ${props => (props.isActive ? 'white' : 'lightgrey')};
  //background-color: lightgrey;
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: row-reverse;
  align-items: center;
  opacity: 1;
  justify-content: space-between;
  margin-right: 10px;
`;
const Cat = styled.Text`
  font-family: ${Font};
  line-height: 30px;
  color: #1c1c1c;
`;
const CountryText = styled.Text`
  font-family: ${Font};
  line-height: 38px;
  flex: 1;
  padding-left: 10px;
  text-align: left;
  color: #1c1c1c;
`;
const IconContainer = styled.TouchableOpacity`
  width: 50px;
  align-items: center;
`;

const additionalStyle = {
  icon: {paddingTop: 2, paddingLeft: 5},
  MapView: {height: height - 200, width: '100%'},
};

const Agents = props => {
  const [countries, setCountries] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [table, setTable] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [servicesName, setServicesName] = useState([]);
  const [addressName, setAddressName] = useState([]);
  const {fcmToken, userInfo} = useContext(DataContext);
  const _panel = useRef();
  const [selectedCatIndex, setselectedCatIndex] = useState([]);
  const [lng, setlng] = useState(20.0868);
  const [lat, setlat] = useState(32.1194);

  const [categoriesAreaOne, setCategoriesAreaOne] = useState([]);
  const flattenDeep = arr =>
    Array.isArray(arr)
      ? arr.reduce((a, b) => a.concat(flattenDeep(b)), [])
      : [arr];

  // const getData = flattenDeep(
  //   selectedCatIndex.map(item => {
  //     return categoriesAreaOne[item].items;
  //   }),
  // );
  const getData = () => {
    return addressName;
  };
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (_panel.current && _panel.current.hide) {
      _panel.current.hide();
    }
  }, []);
  async function getMapList(type, category) {
    console.log('getMapList');

    const xmls = `<?xml version="1.0" encoding="utf-8"?>
                  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <GetTerminalsList xmlns="http://tempuri.org/">
                      <UserId>${userInfo.UserId}</UserId>
                      <TerminalType>${type}</TerminalType>
                      <Category>${category}</Category>
                      <SubCategory></SubCategory>
                      <Lable></Lable>
                      <FCMtoken>${fcmToken}</FCMtoken>
                    </GetTerminalsList>
                  </soap:Body>
                  </soap:Envelope>
                  `;
    console.log(xmls);
    await axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/GetTerminalsList',
        },
      })
      .then(res => {
        parseString(res.data.toString(), (err, result) => {
          if (err) {
            console.log(err);
          }
          const serverData = getXmlData(result, 'GetTerminalsList');
          console.log('serverData');
          // setLoading(false);
          if (serverData === 'OTP verification') {
            console.log(serverData);
          } else if (serverData.ErrorMessage === '') {
            const GetTerminalCategories = serverData['GetTerminalsList'];
            setAddressName(GetTerminalCategories);
            // setlng(parseFloat(GetTerminalCategories[0][`Long`]));
            // setlat(parseFloat(GetTerminalCategories[0][`Lat`]));

            console.log(GetTerminalCategories);
            return GetTerminalCategories;
          } else if (serverData.ErrorMessage) {
            setErrorMessage(Translate(serverData.ErrorMessage));
          }
        });
      })
      .catch(err => {
        console.error(err); /* eslint-disable-line */
      });
  }
  async function getMapCategory(type) {
    console.log('getMapCategory');

    const xmls = `<?xml version="1.0" encoding="utf-8"?>
                  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <GetTerminalCategories xmlns="http://tempuri.org/">
                      <UserId>${userInfo.UserId}</UserId>
                      <TerminalType>${type}</TerminalType>
                      <Category></Category>
                      <FCMtoken>${fcmToken}</FCMtoken>
                    </GetTerminalCategories>
                  </soap:Body>
                  </soap:Envelope>
                  `;
    console.log(xmls);
    await axios
      .post(serverLink, xmls, {
        headers: {
          'Content-Length': '255',
          'Content-Type': 'text/xml;charset=UTF-8',
          SOAPAction: 'http://tempuri.org/GetTerminalCategories',
        },
      })
      .then(async res => {
        parseString(res.data.toString(), async (err, result) => {
          if (err) {
            console.log(err);
          }
          const serverData = getXmlData(result, 'GetTerminalCategories');
          console.log('serverData');
          // console.log(serverData);
          // setLoading(false);
          if (serverData === 'OTP verification') {
            console.log(serverData);
          } else if (serverData.ErrorMessage === '') {
            // setResponse('Confirmed');

            const GetTerminalCategories = serverData['GetTerminalCategories'];
            console.log('GetTerminalCategories');
            console.log(GetTerminalCategories);
            setTable(GetTerminalCategories);
            let arr = [];
            GetTerminalCategories.map((item, idx) => {
              console.log('item');
              console.log(item);
              const {ReferenceCategoryId, CategoryName} = item;
              if (ReferenceCategoryId != '') {
                setCategoryName(CategoryName);

                arr.push(item);
              }
            });

            setCountries(arr);

            // await getMapCategory('', Category, 1);
          } else if (serverData.ErrorMessage) {
            setErrorMessage(Translate(serverData.ErrorMessage));
          }
        });
      })
      .catch(err => {
        console.error(err); /* eslint-disable-line */
      });
  }
  useEffect(() => {
    const fetchData = async () => {
      await getMapCategory('');
    };
    fetchData();
  }, []);
  return (
    <Container>
      <Body>
        <MapView
          // provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE} // remove if not using Google Maps
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={additionalStyle.MapView}
          region={{
            latitude: lat ? lat : getData.length > 0 ? getData[0].lat : 32.1194,
            longitude: lng
              ? lng
              : getData.length > 0
              ? getData[0].lng
              : 20.0868,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          {addressName.length > 0 &&
            addressName.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(marker.Lat),
                  longitude: parseFloat(marker.Long),
                }}
                description={marker.Lable}
                //   description={marker.description}
              />
            ))}
          {/* {getData.length > 0 &&
            getData.map(item => {
              return (
                <MapView.Marker
                  coordinate={{latitude: item.Lat, longitude: item.Long}}
                />
              );
            })} */}
        </MapView>
        <UpperContainer>
          {countries.length > 0 && (
            <SelectDropdown
              data={countries}
              onSelect={async (selectedItem, index) => {
                const {CategoryId: Id, Lat, Long} = selectedItem;
                setlat(parseFloat(Lat));
                setlng(parseFloat(Long));
                let arr = [];
                setAddressName([]);
                if (_panel.current && _panel.current.hide) {
                  _panel.current.hide();
                }
                setCategoriesAreaOne([]);

                table.map((item, idx) => {
                  const {ReferenceCategoryId} = item;
                  if (ReferenceCategoryId == Id) {
                    arr.push(item);
                  }
                });
                //  console.log(arr);

                setCategoriesAreaOne(arr);
                // await getMapList('', ReferenceCategoryId);
                // console.log(selectedItem, index);
              }}
              buttonTextStyle={{
                width: '100%',
                alignSelf: 'center',
                borderRadius: 30,
                overflow: 'hidden',
                height: 40,
                backgroundColor: '#ffffff',
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                padding: 5,
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 2,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.95,
              }}
              defaultButtonText={' اختار' + ' ' + categoryName + ' '}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return categoryName + ': ' + selectedItem.Category;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item.Category;
              }}
            />
          )}

          {/* <FIcon
              style={additionalStyle.icon}
              name="menu"
              size={18}
              color="grey"
            /> */}
          {/* 
            <CountryText>{Translate('Benghazi')}</CountryText>
            <IconContainer>
              <EIcon
                style={additionalStyle.icon}
                name="cross"
                size={18}
                color="grey"
              />
            </IconContainer> */}

          <CategorySearchbar>
            <FlatList
              scrollEnabled={true}
              contentContainerStyle={{
                minWidth: '100%',
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              data={categoriesAreaOne}
              renderItem={({item, index}) => {
                const {TerminalCategoryID, ReferenceCategoryId, CategoryId} =
                  item;
                return (
                  <Items
                    key={index}
                    onPress={async () => {
                      setSelectedId(CategoryId);
                      const arr = await getMapList('', CategoryId);
                      if (_panel.current && _panel.current.show) {
                        _panel.current.show();
                      }
                      // console.log(item);
                      // let selectedArray = selectedCatIndex;
                      // if (selectedCatIndex.includes(index)) {
                      //   selectedArray.splice(selectedArray.indexOf(index), 1);
                      //   if (selectedArray.length > 1) {
                      //     if (_panel.current && _panel.current.hide) {
                      //       _panel.current.hide();
                      //     }
                      //   }
                      // } else {
                      //   selectedArray.push(index);
                      //   if (_panel.current && _panel.current.show) {
                      //     _panel.current.show();
                      //   }
                      // }
                      // setselectedCatIndex(selectedArray);
                    }}
                    isActive={CategoryId == selectedId}
                    selected={selectedCatIndex.includes(index)}>
                    {/* {selectedCatIndex.includes(index) && (
                      <EIcon
                        style={additionalStyle.icon}
                        name="cross"
                        size={18}
                        color="grey"
                      />
                    )} */}
                    <Cat>
                      {I18nManager.isRTL ? item.Category : item.Category}
                    </Cat>
                  </Items>
                );
              }}
            />
          </CategorySearchbar>
        </UpperContainer>
        <ContainerOver>
          <SlidingUpPanel
            friction={0.3}
            backdropOpacity={0.3}
            allowDragging={true}
            draggableRange={{top: height / 2, bottom: 0}}
            ref={_panel}>
            <PanelContainer>
              <Handler />
              <FlatList
                contentContainerStyle={{
                  paddingBottom: 320,
                }}
                ListEmptyComponent={
                  <CountryText>{Translate(`NoData`)}</CountryText>
                }
                data={addressName}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <LocationItem
                    onPress={() => {
                      setlng(parseFloat(item.Long));
                      setlat(parseFloat(item.Lat));
                    }}
                    addressLine1={item.addressLine1}
                    phone={item[`Phone`]}
                    lat={item.Lat}
                    lng={item.Long}
                    addressLine2={item[`الشارع`]}
                    name={I18nManager.isRTL ? item.ArabicName : item.ArabicName}
                    CashBackPercentage={
                      item.CashBackPercentage ? item.CashBackPercentage : ''
                    }
                  />
                )}
              />
            </PanelContainer>
          </SlidingUpPanel>
        </ContainerOver>
      </Body>
    </Container>
  );
};
[
  {
    ArabicName: 'كابو مول',
    CashBackPercentage: '10.0',
    Category: 'مول',
    CategoryId: '22',
    City: '',
    Currency: 'LYD',
    FullName: 'كابو فنيسيا مول',
    Lable: '',
    Lat: '32.085559',
    Long: '20.095587',
    Phone: '218920601111',
    الحالة: '',
    الحي: '',
    الشارع: '',
    العملة: '',
    المدينه: '',
    'رقم الجهاز': '',
    'نوع الخدمة': '',
    هاتف: '',
  },
];
export default Agents;
