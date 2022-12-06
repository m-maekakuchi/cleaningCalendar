// 文字列を「yyyy/mm/d」に変更するメソッド
function replaceDateFormat(day, symbol) {
  day = day.replace('年', symbol);
  day = day.replace(' ', '');
  day = day.replace('月', symbol);
  day = day.replace('日', '');
  return day;
}