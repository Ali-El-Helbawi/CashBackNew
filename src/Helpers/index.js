import {I18nManager} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import Font, {ArabicFont, EnglishFont} from './font';
import * as Keychain from 'react-native-keychain';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import CheckBalance from './commonFunc';
import icoMoonConfig from './selection.json';
import updatePayment from './updatePayment';
import {getDataBySection} from './groupByDate';
import createEVPDF from './createEvoucherPDF';
import messaging from '@react-native-firebase/messaging';
const getToken = async () => {
  try {
    const token = await firebase.messaging().getToken();
    if (token) return token;
  } catch (error) {
    console.log(error);
  }
};

const getFCMToken = async () => {
  try {
    const authorized = await messaging().hasPermission();
    const fcmToken = await getToken();

    if (authorized) return fcmToken;

    await messaging().requestPermission();
    return fcmToken;
  } catch (error) {
    console.log(error);
  }
};

const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig);

const getXmlData = (data, name) =>
  JSON.parse(
    data['soap:Envelope']['soap:Body'][0][`${name}Response`][0][
      `${name}Result`
    ][0],
  );
function convertToAsc(str1) {
  const hex = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

const deviceID = getUniqueId();
const serverLink = 'https://mobile.pay-bts.com/BTSMobPay/mobpayservice.asmx';
// const serverLink = 'https://mobile.pay-bts.com:82/mobpayservice.asmx';
// const serverLink = 'https://www.newpos-bts.com:82/BTSMobPay/mobpayservice.asmx';

function Translate(word, lang) {
  const language = lang || (I18nManager.isRTL ? 'ar' : 'en');

  const dictionary = {
    ar: {
      MerchantName: 'اسم التاجر',
      Limit: 'مقدار',
      Mobile: 'رقم الهاتف',
      SearchByName: 'البحث عن طريق الاسم أو رقم الهاتف',
      Directions: 'اتجاهات',
      Call: 'اتصل',
      NoData: 'لا تتوافر بيانات',
      BalanceList: 'قائمة الرصيد',
      optional: 'اختياري',
      'Invalid FCMtoken': 'Invalid FCMtoken',
      'invalid OTP': 'invalid OTP',
      ReceivedAmount: 'ايداع لحسابك',
      SentTOCustomerAmount: 'تحويل من حسابك',
      Succesfull: 'تمت العملية بنجاح',
      InvoiceAmmount: 'قيمة الفاتورة',
      InvoiceCashback: 'Invoice value after cashback',
      CashbackToCustomer: 'Cashback sent to customer',
      'Invalid Security': 'Invalid Security',
      CustomerNumber: 'رقم المشترك',
      CustomerCashback: 'كاش باك الزبون',
      CashbackPrecentage: 'نسبة التخفيض',
      NextStep: 'متابعة',
      'Mohammed Ali': 'محمد علي',
      'QR Code': 'رمز الاستجابة السريعة',
      CashBack: 'كاش باك',
      Info: 'استعلامات',
      More: 'معلومات اخرى',
      Notifications: 'الاشعارات',
      Deals: 'أفضل العروض',
      Account: 'الحســــــــــــــــــــاب',
      Receive: 'اســــتـــــــــقــبــــال',
      Transfer: 'تحويــــــــــــــــــــل',
      Cards: 'بطاقــــــــــــــــــات',
      'Cards History': 'البطاقات السابقة',
      VIP: 'VIP',
      Agents: 'الوكـــــــــــــــــلاء',
      'Accept Terms': 'موافق على الشروط والاحكام',
      'Mobile Number': 'رقم الهاتف',
      Verify: 'تاكيد',
      'Create an account': 'انشاء حساب جديد',
      Verification: 'تاكيد',
      VerificationCode: 'رمز التاكيد',
      VerifySubtitle: 'الرجاء ادخال رمز التاكيد الذي وصلك على الهاتف',
      Password: 'كلمه السر',
      Login: 'تسجيل الدخول',
      'Please check your Email': 'يرجى التحقق من بريدك الالكتروني',
      'Transactions List Sent': 'تم ارسال قائمة الحوالات لبريدك الإلكتروني',
      'Forgot Password': 'هل نسيت كلمة المرور',
      'Something went wrong': 'حدث خطأ',
      'Invalid input.': 'ادخال خاطئ',
      'Incorrect verification code.': 'رمز خطا',
      'Username or Password is empty': 'الرقم أو الرمز فارغ ',
      'Registration Error, Register Now?': 'خطأ في التسجيل، تسجيل الآن؟',
      cancel: 'إلغاء',
      yes: 'نعم',
      'Login failed.': 'خطأ في الدخول',
      msg_UnregisteredDevice: 'رقم غير مسجل',
      'Login using TouchID': 'الدخول باستخدام البصمة',
      'Add Credit': 'اضافة رصيد',
      'Download PDF File': 'تحميل PDF',
      'Send Report to Email': 'ارسال للبريد الالكتروني',
      'Transaction History': 'الحوالات السابقة',
      'Choose Account': 'اختر حساب',
      Save: 'حفظ',
      _PayUsingQR: 'دفع عن طريق الQR',
      _PayUsingSMS: 'دفع عن طريق ال SMS',
      _Transfer: 'تحويل',
      _PayMeUsingSMS: 'استقبال بستخدام الSMS',
      _PayMeUsingSMSVIP: 'استلام نقدي عن طريق الهاتف',
      'From Account': 'من حساب',
      'To Account': 'الـى حساب',
      Amount: 'القيمة',
      'By QR': 'عن طريق الQR',
      'By Account': 'عن طريق الحساب',
      'By Phone': 'عن طريق الهاتف',
      'Transfer Using QR Code': 'للتحويل عن طريق رمز الQR',
      'Transfer Using Account Number': 'للتحويل عن طريق الحساب',
      'Transfer Using Phone Number': 'للتحويل عن طريق الهاتف',
      'Enter beneficiary account number and the amount':
        'ادخل رقم الحساب المرسل له و القيمة',
      'Receive Using Phone Number': 'استقبل باستخدام رقم الهاتف',
      'Enter phone number and voucher number and the amount':
        'ادخل رقم الهاتف ورقم القسيمة',
      'Enter beneficiary phone number and the amount':
        'ادخل رقم الهاتف المرسل له و القيمة',
      'To Phone Number': 'الى رقم هاتف',
      'From Phone Number': 'من رقم هاتف',
      Confirmed: 'تمت العملية بنجاح',
      'OTP verification': 'التحقق من OTP ',
      'password verification': 'التحقق من كلمة المرور',
      'Not Allowed Sender Receiver': 'لا يمكن ارسال لهذا الحساب',
      'Corebank Rejection': 'لا يمكن تنفيذ العملية',
      'Above ceilling': 'مبلغ اعلى من المسموح',
      'Please Verify sender phone number and the amount':
        'الرجاء التاكد من رقم المرسل وقيمة',
      From: 'من',
      Done: 'تم',
      To: 'الى',
      'Receiver Name': 'اسم المستقبل',
      Loading: 'جار التحميل',
      'Please enter a valid account': 'الرجاء ادخال رقم حساب صحيح',
      'Please enter a valid amount': 'الرجاء ادخال قيمة صحيحة',
      'Please Verify beneficiary account number and the amount':
        'الرجاء التحقق من الحساب المرسل له والقيمة المرسلة',
      'Please Verify beneficiary phone number and the amount':
        'الرجاء التحقق من رقم المرسل له والقيمة المرسلة',
      Quit: 'خروج',
      'Insufficiant Balance': 'عدم كفاية الرصيد',
      'Please enter a valid Phone Number': 'الرجاء ادخال رقم صحيح',
      'Please enter a valid Email Address': 'الرجاء ادخال بريد الكتروني صحيح',
      'Please enter a valid National Number': 'الرجاء ادخال رقم وطني صحيح',
      'Show QR Code': 'عرض رمز الQR',
      'Change Amount': 'تعديل القيمة',
      'Receive Using QR Code': 'استقبال عن طريق رمز الQR',
      'Selected amount': 'المبلغ المطلوب',
      'Please enter the amount': 'الرجاء ادخال القيمة',
      Benghazi: 'بنغازي',
      MADAR: 'المدار',
      LIBYANA: 'لبيانا',
      LTT_ADSL: 'LTT ADSL',
      Connect: 'كونكت',
      'Please Select card amount from': 'الرجاء اختيار قيمة البطاقة من',
      'Please Select Provider': 'الرجاء اختيار مزود الخدمة',
      'NO INTERNET CONNECTION': 'لا يوجد اتصال بالإنترنت',
      'Please check your internet connection and try again':
        'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى',
      'No Data Found': 'لاتوجد بيانات',
      'Voucher Number': 'رقم القسيمة',
      'Your current blanace is': 'رصيدك الحالي',
      'Payment failed': 'خطأ في الدفع',
      'Start Date': 'من تاريخ',
      'Until Date': 'الي تاريخ',
      Provider: 'مزود الخدمة',
      Denomination: 'فئة',
      Price: 'السعر',
      'This field could not be empty': 'هذا الحقل لا يمكن أن يكون فارغا',
      'Please enter your password to verify this transaction':
        'الرجاء ادخال كلمة المرور لاتمام العملية',
      'Not Available': 'غير متوفر حاليا',
      'User not found.': 'خطأ في الادخال',
      'Last 48 Hours Transactions': 'تحويلات اخر ٤٨ ساعة',
      'Last Week Transactions': 'تحويلات اخر اسبوع',
      'Last Month Transactions': 'تحويلات اخر شهر',
      'Last Year Transactions': 'تحويلات اخر سنة',
      'Last 6 Months Transactions': 'تحولات اخر ٦ اشهر',
      'Transaction Date Filter': 'تصفية تاريخ التحويلات',
      'Choose a date range': 'اختيار نطاق التاريخ',
      Show: 'عرض',
      'From Date': 'من تاريخ',
      'ُTo Date': 'الى تاريخ',
      'Create new account': 'انشاء حساب جديد',
      'Please fill the information below': 'الرجاء ادخال المعلومات التالية',
      'Email Address': 'البريد الالكتروني',
      'National Number': 'الرقم الوطني',
      Next: 'التالي',
      Back: 'رجوع',
      'First Name': 'الاسم الاول',
      'Middle Name': 'اسم الاب',
      'Last Name': 'اللقب',
      'Date of birth': 'تاريخ الولادة',
      Address: 'العنوان',
      'Account Number': 'رقم الحساب',
      Submit: 'إرسال',
      'Select Date of birth': 'اختيار تاريخ الميلاد',
      'Reset Password': 'إعادة تعيين كلمة المرور',
      'Please enter mobile number, email and national ID number':
        'الرجاء إدخال رقم الهاتف المحمول والبريد الإلكتروني ورقم الوطني',
      'Retype Password': 'اعد ادخال كلمة المرور',
      'Pin Code': 'الرمز السري',
      'Pin Code has been sent to your mobile, please enter pin number and new password':
        'تم إرسال الرمز السري إلى هاتفك المحمول ، يرجى إدخال الرمز السري وكلمة المرور الجديدة',
      'Please enter the old password and new password':
        'الرجاء إدخال كلمة المرور القديمة وكلمة المرور الجديدة',
      'Receiver Account': 'حساب المستقبل',
      'Password dont match': 'كلمة المرور لا تتطابق',
      'Sender Account': 'حساب المرسل',
      Receiver: 'المستقبل',
      'PDF file is created in Downloads': 'تم تحميل الملف في Downloads',
      'Not available': 'غير متوفر في الوقت الحالي',
      'Change Password': 'تغيير كلمة السر',
      'Finger Print Settings': 'اعدادات البصمة',
      'FaceID Settings': 'اعدادات تحديد الوجه',
      'Contact Us': 'تواصل معنا',
      'Unlock with fingerprint': 'الدخول باستدام البصمة',
      'App Version': 'نسخة التطبيق',
      'Developed By': 'طورت بواسطة',
      'Current Password': 'كلمة المرور الحالية',
      'Retype New Password': 'أعد كتابة كلمة السر الجديدة',
      'New Password': 'كلمة مرور جديدة',
      'When enabled, you can use fingerprint to login. You can still login using password.':
        'عند السماح ، بإمكانك استخدام بصمة لتسجيل الدخول، ويمكنك تسجيل الدخول باستخدام كلمة المرور.',
      'Your account will be activated within 24 hours':
        'سيتم تفعيل حسابكم خلال ٢٤ ساعة',
      'Enter sender phone number and the amount':
        'أدخل رقم هاتف المرسل والمبلغ',
      'Transfer By QR': 'تحويل عن طريق الQR',
      'Transfer By Account': 'تحويل عن طريق الحساب',
      'Transfer By Phone': 'تحويل عن طريق الهاتف ',
      'Pay Cash Using Phone Number': 'استلام نقدي بواسطة رقم الهاتف',
      'Pay Cash': 'استلام نقدي ',
      'Receive Using SMS': 'استقبال عن طريق الهاتف',
      'Allow TouchID for the next Login': 'السماح بالدخول باستخدام البصمة',
      Approved: 'ناجحة',
      response_status: 'الحالة',
      Auth_code: 'رقم auth code',
      Expiry: 'تاريخ الانتهاء',
      Help: 'للتعبئة',
      PIN: 'PIN رقم سري',
      RRN: 'رقم RRN',
      STAN: 'رقم Stan',
      Serial: 'الرقم التسلسل',
      evoucher_receipt: 'الوصل',
      Rejected: 'مرفوضة',
      'Send PIN by SMS': 'إرسال برسالة قصيرة',
      'Recharge this Number': 'تعبئة البطاقة',
      _Sale: 'مبيعات',
      'Buy E-Voucher': 'شراء بطاقة',
      'Please verify provider and the amount': 'يرجى التحقق من مزود والمبلغ',
      'Go to website': 'الذهاب الي الموقع',
      Services: 'خدمات',
    },

    en: {
      //  NoData: 'No data available',
      MerchantName: 'Merchant Name',
      Limit: 'Limit',
      SearchByName: 'Search By Name or Mobile number',
      Directions: 'Directions',
      Mobile: 'Mobile number',
      Call: 'Call',
      NoData: 'لا تتوافر بيانات',
      BalanceList: 'Balance list',
      optional: 'optional',
      'invalid OTP': 'invalid OTP',
      'Invalid FCMtoken': 'Invalid FCMtoken',
      'Invalid Security': 'Invalid Security',
      ReceivedAmount: 'Amount received',
      SentTOCustomerAmount: 'Amount sent to customer',
      InvoiceAmmount: 'Invoice amount',
      Succesfull: 'Transaction successful',
      InvoiceCashback: 'Invoice value after cashback',
      CashbackToCustomer: 'Cashback sent to customer',
      VerificationCode: 'Verification code',
      CustomerNumber: 'Customer number',
      CustomerCashback: 'Cashback amount',
      CashbackPrecentage: 'Cashback precentage',
      NextStep: 'Continue',
      _Sale: 'Sale',
      CashBack: 'CashBack',
      Info: 'Info',
      'Mohammed Ali': 'Mohammed Ali',
      'QR Code': 'QR Code',
      More: 'More',
      Notifications: 'Notifications',
      Deals: 'Top Deals',
      Account: 'Account',
      Transfer: 'Transfer',
      Cards: 'Cards',
      VIP: 'VIP',
      Agents: 'Agents',
      'Accept Terms': 'Accept Terms',
      'Mobile Number': 'Mobile Number',
      Verify: 'Verify',
      'Create an account': 'Create an account',
      Verification: 'Verification',
      VerifySubtitle:
        'Please enter the verification code we send to your phone ',
      Password: 'Password',
      Login: 'Login',
      'Forgot Password': 'Forgot Password',
      'Something went wrong': 'Something went wrong',
      'Invalid input.': 'Invalid input',
      'Incorrect verification code.': 'Incorrect verification code',
      'Username or Password is empty': 'Username or Password is empty',
      'Registration Error, Register Now?': 'Registration Error, Register Now?',
      cancel: 'Cancel',
      yes: 'Yes',
      'Login failed.': 'Login failed',
      msg_UnregisteredDevice: 'Unregistered Device',
      'Login using TouchID': 'Login using TouchID',
      'Add Credit': 'Add Credit',
      'Download PDF File': 'Download PDF File',
      'Send Report to Email': 'Send Report to Email',
      'Transaction History': 'Transaction History',
      'Choose Account': 'Choose Account',
      Save: 'Save',
      _PayUsingSMS: 'Pay Using SMS',
      _Transfer: 'Transfer',
      _PayMeUsingSMS: 'Receive Using SMS',
      _PayUsingQR: 'Pay Using QR',
      _PayMeUsingSMSVIP: 'Pay Cash Using SMS',
      'From Account': 'From Account',
      'To Account': 'To Account',
      Amount: 'Amount',
      'By QR': 'By QR',
      'By Account': 'By Account',
      'By Phone': 'By Phone',
      'Transfer Using Account Number': 'Transfer Using Account Number',
      'Enter beneficiary account number and the amount':
        'Enter beneficiary account number and the amount',
      'Enter beneficiary phone number and the amount':
        'Enter beneficiary phone number and the amount',
      'To Phone Number': 'To Phone Number',
      Confirmed: 'Confirmed',
      'OTP verification': 'OTP verification',
      'password verification': 'Password verification',
      'Not Allowed Sender Receiver': 'Not Allowed Sender Receiver',
      'Corebank Rejection': 'Corebank Rejection',
      'Above ceilling': 'Above ceilling',
      MADAR: 'Madar',
      LIBYANA: 'Libyana',
      LTT_ADSL: 'LTT ADSL',
      Connect: 'Connect',
      Services: 'Services',
    },
  };
  if (dictionary[language][word]) {
    return dictionary[language][word];
  }
  return word;
}

const setKeyChain = async key => {
  await Keychain.setGenericPassword('111', key);
};

const getKeyChain = async () => {
  const val = await Keychain.getGenericPassword();
  return val;
};

export {
  Translate,
  Font,
  ArabicFont,
  convertToAsc,
  EnglishFont,
  setKeyChain,
  getKeyChain,
  getXmlData,
  serverLink,
  deviceID,
  CustomIcon,
  CheckBalance,
  getDataBySection,
  updatePayment,
  createEVPDF,
  getFCMToken,
};
