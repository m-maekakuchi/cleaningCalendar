const week = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();
// 月末だとずれる可能性があるため、1日固定で取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

// 祝日取得
window.onload = function () {
  showProcess(today, calendar);
};

// 前の月表示
function prev(){
  showDate.setMonth(showDate.getMonth() - 1);
  showProcess(showDate);
}

// 次の月表示
function next(){
  showDate.setMonth(showDate.getMonth() + 1);
  showProcess(showDate);
  console.log(notDisplayAcceptDays);
  if (notDisplayAcceptDays && notDisplayAcceptDays !== 5) {
    const tdDOMs = document.getElementsByTagName('td');
    for (let tdDOM of tdDOMs) {
      if (!tdDOM.classList.contains('disabled')) {
        tdDOM.classList.add('acceptable');
        notDisplayAcceptDays--;
      }
      if(notDisplayAcceptDays === 0) {
        break;
      }
    }
  }
}

// カレンダー表示
function showProcess(date) {
  var year = date.getFullYear();
  var month = date.getMonth(); // 0始まり
  document.querySelector('#header').innerHTML = year + "年 " + (month + 1) + "月";

  var calendar = createProcess(year, month);
  document.querySelector('#calendar').innerHTML = calendar;
}

// カレンダー作成
function createProcess(year, month) {
  // 曜日
  var calendar = "<table><tr class='dayOfWeek'>";
  for (var i = 0; i < week.length; i++) {
    calendar += "<th>" + week[i] + "</th>";
  }
  calendar += "</tr>";

  var count = 0;
  var startDayOfWeek = new Date(year, month, 1).getDay();
  var endDate = new Date(year, month + 1, 0).getDate();
  var lastMonthEndDate = new Date(year, month, 0).getDate();
  var row = Math.ceil((startDayOfWeek + endDate) / week.length);

  // 1行ずつ設定
  for (var i = 0; i < row; i++) {
    calendar += "<tr>";
    // 1colum単位で設定
    for (var j = 0; j < week.length; j++) {
      if (i == 0 && j < startDayOfWeek) {
        // 1行目で1日まで先月の日付を設定
        calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
      } else if (count >= endDate) {
        // 最終行で最終日以降、翌月の日付を設定
        count++;
        calendar += "<td class='disabled' onclick='clickDay(this)' >" + (count - endDate) + "</td>";
      } else {
        // 当月の日付を曜日に照らし合わせて設定
        count++;
        var dateInfo = checkDate(year, month, count);
        if(dateInfo.isToday){
          calendar += "<td class='today' onclick='clickDay(this)' >" + count + "</td>";
        } else if(dateInfo.isHoliday) {
          calendar += "<td class='holiday' onclick='clickDay(this)' title='" + dateInfo.holidayName + "'>" + count + "</td>";
        } else {
          calendar += "<td onclick='clickDay(this)' >" + count + "</td>";
        }
      }
    }
    calendar += "</tr>";
  }
  calendar += "</table>";
  return calendar;
}

// 日付チェック
function checkDate(year, month, day) {
  if(isToday(year, month, day)){
    return {
      isToday: true,
      isHoliday: false,
      holidayName: ""
    };
  }

  var checkHoliday = isHoliday(year, month, day);
  return {
    isToday: false,
    isHoliday: checkHoliday[0],
    holidayName: checkHoliday[1],
  };
}

// 当日かどうか
function isToday(year, month, day) {
  return (year == today.getFullYear()
    && month == (today.getMonth())
    && day == today.getDate());
}

// 祝日かどうか
function isHoliday(year, month, day) {
  var checkDate = year + '/' + (month + 1) + '/' + day;
  for (var i = 0; i < holidayAry.length; i++) {
    if (holidayAry[i][0] == checkDate) {
      return [true, holidayAry[i][1]];
    }
  }
  return [false, ""];
}