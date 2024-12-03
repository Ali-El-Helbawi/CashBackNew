import CryptoJS from 'react-native-crypto-js';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {showMessage} from 'react-native-flash-message';
import {I18nManager} from 'react-native';

import {Translate} from './';
function convertToAsc(str1) {
  var hex = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}
async function ExportPDF({key, list, fromDate, toDate, user}) {
  var stryear = fromDate.substring(0, fromDate.indexOf('-'));
  fromDate = fromDate.substring(fromDate.indexOf('-') + 1);
  var strmonth = fromDate.substring(0, fromDate.indexOf('-'));
  fromDate = fromDate.substring(fromDate.indexOf('-') + 1);
  var strday = fromDate;

  let strfromDate = strday + '-' + strmonth + '-' + stryear;

  var stryear = toDate.substring(0, toDate.indexOf('-'));
  toDate = toDate.substring(toDate.indexOf('-') + 1);
  var strmonth = toDate.substring(0, toDate.indexOf('-'));
  toDate = toDate.substring(toDate.indexOf('-') + 1);
  var strday = toDate;

  let strtoDate = strday + '-' + strmonth + '-' + stryear;
  var now = new Date();
  now =
    now.getDate() +
    '-' +
    (now.getMonth() + 1) +
    '-' +
    now.getFullYear() +
    ' ' +
    now.getHours() +
    ':' +
    now.getMinutes() +
    ':' +
    now.getSeconds();
  var i;
  var listString = '';
  const name = user.FullName;
  const arabicName = user.ArabicName;
  const id = user.UserId;
  var MaxNumOfTxnsPerPage = 38;
  var NumOfTxnsPerPage = 30;
  var emptyLines = '';
  var PagesSeperator = MaxNumOfTxnsPerPage - NumOfTxnsPerPage; //num of <br>
  var x;
  for (x = 0; x < PagesSeperator; x++) {
    emptyLines = emptyLines + '</br>';
  }
  var pages = '';
  var numOfPages = Math.ceil(list.length / NumOfTxnsPerPage);
  var currentPage = 0;
  var providers = [];
  var denominations = [];
  var totalAmount = 0;
  console.log(list);
  if (list.length) {
    for (i = 0; i < list.length; i++) {
      list[i].PIN = CryptoJS.AES.decrypt(
        list[i].PIN.toString(),
        `${key}`,
      ).toString();
      list[i].PIN = convertToAsc(list[i].PIN);
      //aditionalInfo.PIN = PIN;

      providers.push(list[i].Provider);
      denominations.push(list[i].Denomination);
      denominations.push(list[i].Provider);
      list[i].Price = parseFloat(list[i].Price);
      totalAmount = totalAmount + list[i].Price;
      //var nDate = new Date(list[i].Transaction_Date);
      //var firstPart = nDate.getDate() + "/" + (nDate.getMonth() + 1) + "/" + nDate.getFullYear();
      //var secondPart = list[i].Transaction_Date.split(" ");
      //list[i].Transaction_Date = firstPart + " " + secondPart[1] + " " + secondPart[2];
      /////list[i]['Transaction Date'] = (nDate, 'dd/m/yy h:MM:ss TT');
      if (I18nManager.isRTL) {
        //firstPart = nDate.getFullYear()+ "/" + (nDate.getMonth() + 1) + "/" + nDate.getDate();
        //list[i].Transaction_Date = firstPart + " " + secondPart[1] + " " + secondPart[2];
        listString =
          listString +
          '<tr><td style="border-left: 1px solid transparent;">' +
          list[i].Transaction_Date +
          '</td><td style="border-left: 1px solid transparent;">' +
          list[i].Provider +
          '</td><td style="border-left: 1px solid transparent;">' +
          list[i].Denomination +
          '</td><td style="border-left: 1px solid transparent;">' +
          list[i].PIN +
          '</td><td style="border-left: 1px solid transparent;">' +
          list[i].Price +
          '</td><td>' +
          list[i].Serial_Number +
          '</td></tr>';
      } else {
        listString =
          listString +
          '<tr><td style="border-right: 1px solid transparent;">' +
          list[i].Transaction_Date +
          '</td><td style="border-right: 1px solid transparent;">' +
          list[i].Provider +
          '</td><td style="border-right: 1px solid transparent;">' +
          list[i].Denomination +
          '</td><td style="border-right: 1px solid transparent;">' +
          list[i].PIN +
          '</td><td style="border-left: 1px solid transparent;">' +
          list[i].Price +
          '</td><td>' +
          list[i].Serial_Number +
          '</td></tr>';
      }
      if ((i + 1) % NumOfTxnsPerPage === 0) {
        currentPage = currentPage + 1;
        if (I18nManager.isRTL) {
          var header =
            '<div dir="rtl" style="display:inline-block;float:right;align-items:center;><label">الاسم: ' +
            arabicName +
            '</label"><br><label>الرقم: ' +
            id +
            '</label></br><label>الصفحة: ' +
            currentPage +
            '/' +
            numOfPages +
            '</label></div><div dir="rtl" style="display:inline-block;float:left"><label>من: ' +
            strfromDate +
            '</label><br><label>الى: ' +
            strtoDate +
            '</label><br><label>تاريخ التقرير: ' +
            now +
            '</label></div><br><br><h1 style="text-align: center;">قائمة الحركات</h1>';
          var table =
            '<div style="text-align: center"><table dir="rtl" border="1px solid" bordercolor="#12307E" style="border-collapse:collapse;display:inline-block"><tr style="background-color: #7ACBF6"><th style="padding: 3">تاريخ الحركة</th><th style="padding: 3"> المزود</th><th style="padding: 3">الفئة</th><th style="padding: 3">الرقم السري</th><th style="padding: 3">السعر</th><th style="padding: 3">الرقم التسلسلي</th></tr>' +
            listString +
            '</table></div>';
        } else {
          var header =
            '<div style="display:inline-block;align-items:center;"><label>Name: ' +
            name +
            '</label><br><label>ID: ' +
            id +
            '</label></br><label>Page: ' +
            currentPage +
            '/' +
            numOfPages +
            '</label></div><div style="display:inline-block;float:right"><label>From: ' +
            strfromDate +
            '</label><br><label>To: ' +
            strtoDate +
            '</label><br><label>Report Time: ' +
            now +
            '</label></div><h1 style="text-align: center;">Transaction List</h1>';
          var table =
            '<div style="text-align: center"><table border="1px solid" bordercolor="#12307E" style="border-collapse:collapse;display:inline-block"><tr style="background-color: #7ACBF6"><th style="padding: 3">Transaction Date</th><th style="padding: 3">Provider</th><th style="padding: 3">Denomination</th><th style="padding: 3">PIN</th><th style="padding: 3">Price</th><th style="padding: 3">Serial_Number</th></tr>' +
            listString +
            '</table></div>';
        }
        var page = header + table + emptyLines;
        pages = pages + page;
        listString = '';
      } else if (list.length - 1 - i == 0) {
        currentPage = currentPage + 1;
        if (!I18nManager.isRTL) {
          var header =
            '<div style="display:inline-block;align-items:center;"><label>Name: ' +
            name +
            '</label><br><label>ID: ' +
            id +
            '</label></br><label>Page: ' +
            currentPage +
            '/' +
            numOfPages +
            '</label></div><div style="display:inline-block;float:right"><label>From: ' +
            strfromDate +
            '</label><br><label>To: ' +
            strtoDate +
            '</label><br><label>Report Time: ' +
            now +
            '</label></div><h1 style="text-align: center;">Transaction List</h1>';
          var table =
            '<div style="text-align: center"><table border="1px solid" bordercolor="#12307E" style="border-collapse:collapse;display:inline-block"><tr style="background-color: #7ACBF6"><th style="padding: 3">Transaction Date</th><th style="padding: 3">Provider</th><th style="padding: 3">Denomination</th><th style="padding: 3">PIN</th><th style="padding: 3">Price</th><th style="padding: 3">Serial Number</th></tr>' +
            listString +
            '</table></div>';
        } else {
          var header =
            '<div dir="rtl" style="display:inline-block;float:right;align-items:center;"><label">الاسم: ' +
            arabicName +
            '</label"><br><label>الرقم: ' +
            id +
            '</label></br><label>الصفحة: ' +
            currentPage +
            '/' +
            numOfPages +
            '</label></div><div dir="rtl" style="display:inline-block;float:left"><label>من: ' +
            strfromDate +
            '</label><br><label>الى: ' +
            strtoDate +
            '</label><br><label>تاريخ التقرير: ' +
            now +
            '</label></div><br><h1 style="text-align: center;">قائمة الحركات</h1>';
          var table =
            '<div style="text-align: center"><table dir="rtl" border="1px solid" bordercolor="#12307E" style="border-collapse:collapse;display:inline-block"><tr style="background-color: #7ACBF6"><th style="padding: 3">تاريخ الحركة</th><th style="padding: 3"> المزود</th><th style="padding: 3">الفئة</th><th style="padding: 3">الرقم السري</th><th style="padding: 3">السعر</th><th style="padding: 3">الرقم التسلسلي</th></tr>' +
            listString +
            '</table></div>';
        }
        var page = header + table + emptyLines;
        pages = pages + page;
        listString = '';
        var listString1 = '';
      }
    }
    var providersList = [];
    providersList = [...new Set(providers)];
    listString = '';
    var y, m;
    for (y = 0; y < providersList.length; y++) {
      var n = 0;
      var total = 0;
      for (m = 0; m < providers.length; m++) {
        if (providers[m] == providersList[y]) {
          n++;
        }
      }
      for (var i = 0; i < list.length; i++) {
        if (providersList[y] == list[i].Provider) {
          list[i].Price = parseFloat(list[i].Price);
          total = total + list[i].Price;
        }
      }
      if (!I18nManager.isRTL) {
        listString =
          listString +
          '<tr><td style="border-left: 1px solid transparent;">' +
          providersList[y] +
          '</td><td style="border-left: 1px solid transparent;">' +
          n +
          '</td><td style="border-left: 1px solid transparent;">' +
          total +
          '</td></tr>';
      } else {
        listString =
          listString +
          '<tr><td style="border-left: 1px solid transparent;">' +
          total +
          '</td><td style="border-left: 1px solid transparent;">' +
          n +
          '</td><td style="border-left: 1px solid transparent;">' +
          providersList[y] +
          '</td></tr>';
      }
      console.log('listt', listString);
    }
    if (I18nManager.isRTL) {
      listString =
        listString +
        '<tr><td style="border-left: 1px solid transparent;">' +
        totalAmount +
        '</td><td style="border-left: 1px solid transparent;">' +
        list.length +
        '</td><td style="border-left: 1px solid transparent;">المجموع</td></tr>';
      var header =
        '<div dir="rtl" style="display:inline-block;float:right;align-items:center;"><label">الاسم: ' +
        arabicName +
        '</label"><br><label>الرقم: ' +
        id +
        '</label></br><label>الصفحة: ' +
        currentPage +
        '/' +
        numOfPages +
        '</label></div><div dir="rtl" style="display:inline-block;float:left"><label>من: ' +
        strfromDate +
        '</label><br><label>الى: ' +
        strtoDate +
        '</label><br><label>تاريخ التقرير: ' +
        now +
        '</label></div><br><h1 style="text-align: center;">الاحصائيات</h1>';
      var tableProv =
        '<div style="text-align: center"><table border="1px solid" bordercolor="#12307E" style="border-collapse:collapse;display:inline-block"><tr style="background-color: #7ACBF6"><th style="padding: 3">المجموع العام</th><th style="padding: 3">عدد البطاقات</th><th style="padding: 3">المزود</th></tr>' +
        listString +
        '</table></div>';
      var pageProv = header + tableProv;
    } else {
      listString =
        listString +
        '<tr><td style="border-left: 1px solid transparent;">Total</td><td style="border-left: 1px solid transparent;">' +
        list.length +
        '</td><td style="border-left: 1px solid transparent;">' +
        totalAmount +
        '</td></tr>';
      var header =
        '<div style="display:inline-block;align-items:center;"><label>Name: ' +
        name +
        '</label><br><label>ID: ' +
        id +
        '</label></br><label>Page: ' +
        currentPage +
        '/' +
        numOfPages +
        '</label></div><div style="display:inline-block;float:right"><label>From: ' +
        strfromDate +
        '</label><br><label>To: ' +
        strtoDate +
        '</label><br><label>Report Time: ' +
        now +
        '</label></div><h1 style="text-align: center;">Statistics</h1>';
      var tableProv =
        '<div style="text-align: center"><table border="1px solid" bordercolor="#12307E" style="border-collapse:collapse;display:inline-block"><tr style="background-color: #7ACBF6"><th style="padding: 3">Provider</th><th style="padding: 3">Number of vouchers</th><th style="padding: 3">Total Amount</th></tr>' +
        listString +
        '</table></div>';
      var pageProv = header + tableProv;
    }
    var denominationList = [];
    denominationList = [...new Set(denominations)];
    let listString2 = '';
    for (y = 0; y < providersList.length; y++) {
      var arrayList = [];
      var total = 0;
      listString2 =
        listString2 +
        '<tr><td colspan="3" style="text-align: center">' +
        providersList[y] +
        '</td></tr>';
      for (m = 0; m < list.length; m++) {
        if (providersList[y] == list[m].Provider) {
          arrayList.push(list[m].Denomination);
        }
      }
      let arrayListUnique = [...new Set(arrayList)];
      for (i = 0; i < arrayListUnique.length; i++) {
        var number = 0;
        for (let j = 0; j < arrayList.length; j++) {
          if (arrayListUnique[i] == arrayList[j]) {
            number++;
          }
        }
        var denoRow = arrayListUnique[i];
        denoRow = denoRow.split(' ');
        denoRow = denoRow[0];
        denoRow = parseFloat(denoRow);
        total = denoRow * number;
        if (!I18nManager.isRTL) {
          listString2 =
            listString2 +
            '<tr><td style="border-left: 1px solid transparent; text-align: center">' +
            arrayListUnique[i] +
            '</td><td style="border-left: 1px solid transparent;text-align: center">' +
            number +
            '</td><td style="border-left: 1px solid transparent; text-align: center">' +
            total +
            '</td></tr>';
        } else {
          listString2 =
            listString2 +
            '<tr><td style="border-left: 1px solid transparent; text-align: center">' +
            total +
            '</td><td style="border-left: 1px solid transparent;text-align: center">' +
            number +
            '</td><td style="border-left: 1px solid transparent; text-align: center">' +
            arrayListUnique[i] +
            '</td></tr>';
        }
      }
      //listString2 = listString2 + '<tr><td style="border-left: 1px solid transparent;">' + arrayListUnique[y] + '</td><td style="border-left: 1px solid transparent;">' + number + '</td><td style="border-left: 1px solid transparent;">' + number + '</td><td style="border-left: 1px solid transparent;">' + total + '</td></tr>'
    }
    if (!I18nManager.isRTL) {
      listString2 =
        listString2 +
        '<tr><td style="text-align: center">Total</td><td style="text-align: center">' +
        list.length +
        '</td><td style="text-align: center">' +
        totalAmount +
        '</td></tr>';
    } else {
      listString2 =
        listString2 +
        '<tr><td style="text-align: center">' +
        totalAmount +
        '</td><td style="text-align: center">' +
        list.length +
        '</td><td style="text-align: center">المجموع العام</td></tr>';
    }
    if (I18nManager.isRTL) {
      var tableDen =
        '<div style="text-align: center"><table border="1px solid" bordercolor="#12307E" style="border-collapse:collapse;display:inline-block"><tr style="background-color: #7ACBF6"><th style="padding: 3">المجموع</th><th style="padding: 3">عدد البطاقات</th><th style="padding: 3">الفئة</th></tr>' +
        listString2 +
        '</table></div>';
    } else {
      var tableDen =
        '<div style="text-align: center"><table border="1px solid" bordercolor="#12307E" style="border-collapse:collapse;display:inline-block"><tr style="background-color: #7ACBF6"><th style="padding: 3">Denomination</th><th style="padding: 3">Number of cards</th><th style="padding: 3">Total</th></tr>' +
        listString2 +
        '</table></div>';
    }
    var pageDen = header + tableDen;
    var allPages = pageProv + '</br></br></br>' + pageDen;
  }
  let options = {
    //Content to print
    html: pages,
    //File Name
    fileName: 'eVouchers',
    //File directory
    directory: 'Download',
  };
  let options1 = {
    //Content to print
    html: allPages,
    //File Name
    fileName: 'statistics',
    //File directory
    directory: 'Download',
  };
  //console.log(options.html);
  let file = RNHTMLtoPDF.convert(options);
  // let file1 = await RNHTMLtoPDF.convert(options1);
  console.log(file);
  showMessage({
    message: Translate('PDF file is created in Downloads'),
    description: '',
    backgroundColor: '',
    color: 'white',
  });
}

export default ExportPDF;
