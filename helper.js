const getXmlData = (data, name) =>
  JSON.parse(
    data['soap:Envelope']['soap:Body'][0][`${name}Response`][0][
      `${name}Result`
    ][0],
  );

export function translateDetails(lang, text) {
  const translate = {
    en: {
      AccNum: 'Account Number',
      AccType: 'Account Type',
      Amount: 'Amount',
      Balance: 'Balance',
      BranchId: 'Branch ID',
      Credit: 'Credit',
      Currency: 'Currency',
      Debit: 'Debit',
      SN: 'Serial Number',
      'Transaction Date': 'Transaction Date',
      'Transaction Name': 'Transaction Name',
      TransactionType: 'Transaction Type',
      TxnCode: 'Transaction Code',
      TxnSubTiltle: 'Transaction Subtiltle',

      TxnTitle: 'Transaction Title',
      'Transaction Id': 'Transaction ID',
      Status: 'Status',
      From: 'From',
      Receiver: 'Receiver',
      'Sender Account': 'Sender Account',
      'Receiver Account': 'Receiver',
      'To Merchant': 'To Merchant',
      TerminalId: 'Terminal ID',
      MerchantName: 'Merchant Name',
      isReversable: 'Reversable',
      Done: 'Done',
      DB: 'Debit',
      CR: 'Credit',
      //card history transaaction details
      AtmAndPos: 'Code',
      Card_Number: 'Card Number',
      DateTraxRun: 'Transaction Date',
      TypeAmountCuntry: 'Transaction Country',
      TypePlaceTrans: 'Transaction Place Type',
      Type_Amount: 'Transaction Currency',
      Type_tanx: 'Transaction Type',
      amountCuntry: 'Ammount Country',
    },
    ar: {
      AccNum: 'رقم الحساب',
      AccType: 'نوع الحساب',
      Amount: 'المبلغ',
      Balance: 'الرصيد',
      BranchId: 'رمز الفرع',
      Credit: 'الرصيد',
      Currency: 'العملة',
      Debit: 'سحب',
      SN: 'الرقم التسلسلي',
      'Transaction Date': 'تاريخ الحركة',
      'Transaction Name': 'اسم الحركة',
      TransactionType: 'نوع الحركة',
      TxnCode: 'رمز الحركة',
      TxnSubTiltle: 'عنوان الحركة الفرعي',
      TxnTitle: 'عنوان الحركة',
      'Transaction Id': 'رقم الحركة',
      Status: 'الحالة',
      From: 'من',
      Receiver: 'المرسل اليه',
      'Sender Account': 'حساب المرسل',
      'Receiver Account': 'المرسل اليه',
      'To Merchant': 'إلى التاجر',
      TerminalId: 'رمز المحطة',
      MerchantName: 'اسم التاجر',
      isReversable: 'قابلة للارجاع',
      Done: 'تم التنفيذ',
      DB: 'مدين',
      CR: 'دائن',

      //card history transaaction details
      AtmAndPos: 'رمز',
      Card_Number: 'رقم البطاقة',
      DateTraxRun: 'تاريخ العملية',
      TypeAmountCuntry: 'بلد العملية',
      TypePlaceTrans: 'نوع مكان الحركة',
      Type_Amount: 'عملة الحركة',
      Type_tanx: 'نوع الحركة',
      amountCuntry: 'القيمة المسحوبة',
    },
  };
  if (translate[lang] && translate[lang][text]) {
    return translate[lang][text];
  }
  return text;
}

export default getXmlData;
