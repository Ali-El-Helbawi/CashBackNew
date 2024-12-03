import axios from 'axios';
import {getXmlData, serverLink, Translate} from '../Helpers';
import {parseString} from 'react-native-xml2js';

function CheckBalance(userID) {
  console.log(userID);
  const xmls = `<?xml version="1.0" encoding="utf-8"?>
                  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <CheckBalance xmlns="http://tempuri.org/">
                    <UserId>${userID}</UserId>
                    <FCMtoken></FCMtoken>
                  </CheckBalance>
                  </soap:Body>
                  </soap:Envelope>
                  `;
  console.log(xmls);
  axios
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
          console.log(err);
        }
        const serverData = getXmlData(result, 'CheckBalance');
        console.log('here', serverData);
        if (serverData.ErrorMessage === '') {
          this.setState({loading: false});
          for (var i = 0; i < serverData.Accounts.length; i++) {
            if (serverData.Accounts[i].Balance === '-999999999') {
              serverData.Accounts[i].Balance = Translate('Not Available');
              serverData.Accounts[i].Currency = '';
            }
          }
          return serverData.Accounts;
        } else {
          return serverData.ErrorMessage;
        }
      });
  }).catch((err) => { console.error(err); /* eslint-disable-line */});
}

export {CheckBalance};
