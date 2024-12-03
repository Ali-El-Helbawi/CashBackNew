import Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

function groupBy(list, keyGetter, title) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  let Data = map.get(true);
  if (Data) {
    return {title: title, data: [...Data]};
  }
}

function getDataBySection(ListServerData) {
  if (ListServerData.length < 1) {
    return;
  }
  const oneYear = moment().subtract(1, 'year');
  const oneMonth = moment().subtract(1, 'month');
  const oneWeek = moment().subtract(1, 'week');
  const _48Hours = moment().subtract(2, 'day');

  const _48HoursGrouped = groupBy(
    ListServerData,
    item =>
      moment(item['Transaction Date'], 'MM/DD/YYYY hh:mm:ss A').within(
        moment.range(_48Hours, moment()),
      ),
    'Last 48 Hours Transactions',
  );
  const oneWeekGrouped = groupBy(
    ListServerData,
    item =>
      moment(item['Transaction Date'], 'MM/DD/YYYY hh:mm:ss A').within(
        moment.range(oneWeek, _48Hours),
      ),
    'Last Week Transactions',
  );
  const onMonthGrouped = groupBy(
    ListServerData,
    item =>
      moment(item['Transaction Date'], 'MM/DD/YYYY hh:mm:ss A').within(
        moment.range(oneMonth, oneWeek),
      ),
    'Last Month Transactions',
  );
  const onYearGrouped = groupBy(
    ListServerData,
    item =>
      moment(item['Transaction Date'], 'MM/DD/YYYY hh:mm:ss A').within(
        moment.range(oneYear, oneMonth),
      ),
    'Last Year Transactions',
  );
  return [
    _48HoursGrouped,
    oneWeekGrouped,
    onMonthGrouped,
    onYearGrouped,
  ].filter(item => typeof item !== 'undefined');
}

export {getDataBySection};
