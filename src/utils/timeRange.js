import { parseTime } from '@/utils/ddc';
/**
 * 近t月转化为开始/结束时间
 * @param {Number} t 范围为 1~12, 例子：t=6
 * @returns {Object} {end: '2020-10-30', start: "2021-4-30"}
 */
export function getTimeRange(t) {
  const end = new Date();
  const year = end.getFullYear();
  const month = end.getMonth() + 1;// 0-11表示1-12月
  const day = end.getDate();
  const dateObj = {};
  dateObj.end = year + '-' + month + '-' + day;
  const endMonthDay = new Date(year, month, 0).getDate(); // 当前月的总天数
  if (month - t <= 0) { // 如果不在当年，年数往前推一年
    const startMonthDay = new Date((year - 1), (12 - (t - parseInt(month))), 0).getDate(); // t个月前所在月的总天数
    if (startMonthDay < day) { // t个月前所在月的总天数小于现在的天日期
      dateObj.start = (year - 1) + '-' + (12 - (t - month)) + '-' + startMonthDay;
    } else {
      dateObj.start = (year - 1) + '-' + (12 - (t - month)) + '-' + day;
    }
  } else {
    const startMonthDay = new Date(year, (parseInt(month) - t), 0).getDate(); // t个月前所在月的总天数
    if (startMonthDay < day) { // t个月前所在月的总天数小于现在的天日期
      if (day < endMonthDay) { // 当前天日期小于当前月总天数
        dateObj.start = year + '-' + (month - t) + '-' + (startMonthDay - (endMonthDay - day));
      } else {
        dateObj.start = year + '-' + (month - t) + '-' + startMonthDay;
      }
    } else {
      dateObj.start = year + '-' + (month - t) + '-' + day;
    }
  }
  dateObj.start = parseTime(dateObj.start, '{y}-{m}-{d}');
  dateObj.end = parseTime(dateObj.end, '{y}-{m}-{d}');
  return dateObj;
}

/**
 * 获取近一周
 * @returns {Object} {end: '2020-4-23', start: "2021-4-30"}
 */
export function getWeekRange() {
  const end = new Date();
  const year = end.getFullYear();
  const month = end.getMonth() + 1;// 0-11表示1-12月
  const day = end.getDate();
  const dateObj = {};
  dateObj.end = year + '-' + month + '-' + day;
  if (day - 7 <= 0) { // 如果在当月7日之前
    const startMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate(); // 1周前所在月的总天数
    if (month - 1 <= 0) { // 如果在当年的1月份
      dateObj.start = (year - 1) + '-' + 12 + '-' + (31 - (7 - day));
    } else {
      dateObj.start = year + '-' + (month - 1) + '-' + (startMonthDay - (7 - day));
    }
  } else {
    dateObj.start = year + '-' + month + '-' + (day - 7);
  }
  dateObj.start = parseTime(dateObj.start, '{y}-{m}-{d}');
  dateObj.end = parseTime(dateObj.end, '{y}-{m}-{d}');
  return dateObj;
}
