import moment from 'moment';

function ParseArabic(text) {
  return text
    .split(' ')
    .reverse()
    .join('  ');
}

function TranslateCur(cur, lang) {
  const langs = {
    ar: {
      LYD: 'دينار ليبي',
      USD: 'دولار امريكي',
    },
    en: {
      LYD: 'LYD',
      USD: 'ْUSD',
    },
  };
  if (langs[lang][cur]) {
    return langs[lang][cur];
  }
  return cur;
}

function GetTXN(lang, text) {
  if (lang !== 'ar') {
    return text === 'DB' ? 'Debit' : 'Credit';
  }
  return text === 'DB' ? 'ايداع' : 'سحب';
}

function row(doc, height, header, configs) {
  doc
    .lineJoin('miter')
    .rect(30, height, 612 - 60, 20)
    .fillAndStroke(
      header ? configs.theme.header.fill : configs.theme.body.fill,
      configs.theme.body.stroke,
    );
  configs.rowLines.forEach(item => {
    doc
      .lineCap('butt')
      .moveTo(item, height)
      .lineTo(item, height + 20)
      .stroke(configs.theme.body.stroke);
  });
  return doc;
}

function textInRowFirst(doc, text, height, left) {
  const Doc = doc;
  Doc.y = height;
  Doc.x = left;
  doc.fillColor('black');
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 1,
  });
  return Doc;
}

function walletPDF(props) {
  const {
    data,
    fromDate,
    toDate,
    AccountNumber,
    name,
    lang,
    fileName,
    balance,
  } = props;
  const itemsPerPage = 31;
  const ar = lang === 'ar';
  const configs = {
    rowLines: ar
      ? [
          582 - 145,
          582 - 145 - 115,
          582 - 145 - 115 - 120,
          582 - 145 - 115 - 120 - 82,
          30,
        ]
      : [30, 175, 290, 410, 492],
    theme: {
      header: {
        stroke: 'green',
        fill: 'yellow',
      },
      body: {
        stroke: 'green',
        fill: 'white',
      },
    },
  };
  const doc = new PDFDocument({
    margin: 0,
  });
  const arPadding = (addedPadding, text) =>
    ar ? addedPadding - 10 - doc.widthOfString(text) : 0;
  const Header = () => {
    const ArName = () => ParseArabic(`الاسم: ${name}`);
    doc
      .fontSize(10)
      .font(ar ? 'src/GE-SS-Two-Medium.otf' : 'src/Barlow-Medium.otf')
      .text(ar ? ArName() : `Name: ${name}`, 30, 30)
      .text(
        ar
          ? ParseArabic(`من: ${fromDate} الى: ${toDate}`)
          : `From: ${fromDate} to ${toDate}`,
        612 -
          30 -
          doc.widthOfString(
            ar
              ? ParseArabic(`من: ${fromDate} الى ${toDate}`)
              : `From: ${fromDate} to ${toDate}`,
          ),
        30,
      )
      .font('src/Barlow-Medium.otf')
      .text(`Card Number: ${AccountNumber}`, 30, 47)
      .text(
        `Report Date: ${moment().format('DD-MM-YYYY')}`,
        612 -
          30 -
          doc.widthOfString(`Report Date: ${moment().format('DD-MM-YYYY')}`),
        47,
      )
      .fontSize(22)
      .font(ar ? 'src/GE-SS-Two-Medium.otf' : 'src/Barlow-Medium.otf')
      .text(
        ar ? ParseArabic('قائمة الحركات') : 'Transaction List',
        612 / 2 -
          doc.widthOfString(
            ar ? ParseArabic('قائمة الحركات') : 'Transaction List',
          ) /
            2,
        59,
      )
      .fontSize(12);
    row(doc, 90, true, configs);
    textInRowFirst(
      doc,
      ar ? ParseArabic('تاريخ الحركة') : 'Transaction Date',
      !ar ? 92.5 : 94,
      configs.rowLines[0] + arPadding(145, ParseArabic('تاريخ الحركة')),
    );
    textInRowFirst(
      doc,
      ar ? ParseArabic('حساب المرسل') : 'Sender Account',
      !ar ? 92.5 : 94,
      configs.rowLines[1] + arPadding(115, ParseArabic('حساب المرسل')),
    );
    textInRowFirst(
      doc,
      ar ? ParseArabic('حساب المرسل له') : 'Receiver Account',
      !ar ? 92.5 : 94,
      configs.rowLines[2] + arPadding(120, ParseArabic('حساب المرسل له')),
    );
    textInRowFirst(
      doc,
      ar ? ParseArabic('المبلغ') : 'Amount',
      !ar ? 92.5 : 94,
      configs.rowLines[3] + arPadding(82, ParseArabic('المبلغ')),
    );
    textInRowFirst(
      doc,
      ar ? ParseArabic('الحالة') : 'Status',
      !ar ? 92.5 : 94,
      configs.rowLines[4] + arPadding(90, ParseArabic('الحالة')),
    );
    doc.font('src/Barlow-Medium.otf');
  };
  Header();
  doc.pipe(fs.createWriteStream(`src/files/${fileName}.pdf`));
  doc.text(`1 / ${Math.ceil((data.length + 1) / itemsPerPage)}`, 30, 762);
  if (balance) {
    if (ar) {
      const arblns = 'الرصيد';
      doc
        .font('src/GE-SS-Two-Medium.otf')
        .rect(
          612 - (doc.widthOfString(`${balance} : ${arblns}`) + 30) - 60,
          753,
          doc.widthOfString(`${balance} : ${arblns}`) + 60,
          30,
        )
        .fillAndStroke('white', 'black')
        .fill('black')
        .text(arblns, 612 - doc.widthOfString(arblns) - 40, 761)
        .font('src/Barlow-Medium.otf')
        .text(
          `${balance} :`,
          612 - doc.widthOfString(`${balance} ${arblns}`) - 50,
          760,
        );
    } else {
      doc
        .rect(
          612 - (doc.widthOfString(`Balance: ${balance}`) + 30) - 60,
          753,
          doc.widthOfString(`Balance: ${balance}`) + 60,
          30,
        )
        .fillAndStroke('white', 'black')
        .fill('black')
        .font('src/Barlow-Medium.otf')
        .text(
          `Balance: ${balance}`,
          612 - doc.widthOfString(`Balance: ${balance}`) - 60,
          760,
        )
        .font('src/Barlow-Medium.otf');
    }
  }
  let page = 1;
  data.forEach((txns, index) => {
    const initial = 110;
    const pureIndex = index % itemsPerPage;
    if (index < itemsPerPage * page) {
      row(doc, 20 * (index % itemsPerPage) + 110, false, configs);
      textInRowFirst(
        doc,
        txns['Transaction Date'],
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[0] + arPadding(145, txns['Transaction Date']),
      );
      textInRowFirst(
        doc,
        txns['Sender Account'],
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[1] + arPadding(115, txns['Sender Account']),
      );
      textInRowFirst(
        doc,
        txns['Receiver Account'],
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[2] + arPadding(120, txns['Receiver Account']),
      );
      textInRowFirst(
        doc,
        txns.Amount,
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[3] + arPadding(82, txns.Amount),
      );
      textInRowFirst(
        doc,
        txns.Status,
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[4] + arPadding(90, txns.Status),
      );
    } else {
      doc.addPage({
        margin: 0,
      });
      doc.text(
        `${page + 1} / ${Math.ceil((data.length + 1) / itemsPerPage)}`,
        30,
        762,
      );
      if (balance) {
        if (ar) {
          const arblns = 'الرصيد';
          doc
            .font('src/GE-SS-Two-Medium.otf')
            .rect(
              612 - (doc.widthOfString(`${balance} : ${arblns}`) + 30) - 60,
              753,
              doc.widthOfString(`${balance} : ${arblns}`) + 60,
              30,
            )
            .fillAndStroke('white', 'black')
            .fill('black')
            .text(arblns, 612 - doc.widthOfString(arblns) - 40, 761)
            .font('src/Barlow-Medium.otf')
            .text(
              `${balance} :`,
              612 - doc.widthOfString(`${balance} ${arblns}`) - 50,
              760,
            );
        } else {
          doc
            .rect(
              612 - (doc.widthOfString(`Balance: ${balance}`) + 30) - 60,
              753,
              doc.widthOfString(`Balance: ${balance}`) + 60,
              30,
            )
            .fillAndStroke('white', 'black')
            .fill('black')
            .font('src/Barlow-Medium.otf')
            .text(
              `Balance: ${balance}`,
              612 - doc.widthOfString(`Balance: ${balance}`) - 60,
              760,
            )
            .font('src/Barlow-Medium.otf');
        }
      }
      Header();
      row(doc, 20 * pureIndex + 110, false, configs);
      textInRowFirst(
        doc,
        txns['Transaction Date'],
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[0] + arPadding(145, txns['Transaction Date']),
      );
      textInRowFirst(
        doc,
        txns['Sender Account'],
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[1] + arPadding(115, txns['Sender Account']),
      );
      textInRowFirst(
        doc,
        txns['Receiver Account'],
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[2] + arPadding(120, txns['Receiver Account']),
      );
      textInRowFirst(
        doc,
        txns.Amount,
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[3] + arPadding(82, txns.Amount),
      );
      textInRowFirst(
        doc,
        txns.Status,
        initial + 2.5 + 20 * pureIndex,
        configs.rowLines[4] + arPadding(90, txns.Status),
      );
      page += 1;
    }
  });
  doc.end();
}
