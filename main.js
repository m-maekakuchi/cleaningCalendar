'use strict'

let notDisplayAcceptDays; // カレンダーに色付けされていない受取可能日の数

function clickDay(clickDayDOM) {
  const preRequestDay = document.getElementsByClassName('requestDay');
  // preRequestDay.classList.remove('requestDay');
  console.log(preRequestDay);

  let clickDay = getCalenderDate(clickDayDOM);
  clickDayDOM.classList.add('requestDay');
  console.log(`クリックした日：${clickDay}`);

  // PHPに送るデータ
  const jsonData = {
    "clickDay" : clickDay,
    "holidayAry" : holidayAry
  };

  $.ajax({
    type: "POST", // GETでも可
    url: "main.php", // 送り先
    data: { 'クリックした日付' : jsonData }, // 渡したいデータをオブジェクトで渡す
    dataType : "json", // データ形式を指定
    scriptCharset: 'utf-8' // 文字コードを指定
  })
  .then(
    // 帰ってきたら実行する処理
    function(param){  // paramに処理後のデータが入って戻ってくる
      console.log(`受取可能期間：${param}`);

      const tdDOMs = document.getElementsByTagName('td');
      notDisplayAcceptDays = 5;
      for (let acceptableDate of param) {
        for (let tdDOM of tdDOMs) {
          let tdDate = getCalenderDate(tdDOM);
          if (acceptableDate === tdDate && !tdDOM.classList.contains('disabled')) {
            tdDOM.classList.add('acceptable');
            notDisplayAcceptDays--;
          }
        }
      }
      if (notDisplayAcceptDays === 5) {
        next();
        const tdDOMs = document.getElementsByTagName('td');
        for (let acceptableDate of param) {
          for (let tdDOM of tdDOMs) {
            let tdDate = getCalenderDate(tdDOM);
            if (acceptableDate === tdDate && !tdDOM.classList.contains('disabled')) {
              tdDOM.classList.add('acceptable');
            }
          }
        }
      }
    },
    function(XMLHttpRequest, textStatus, errorThrown){ // エラーが起きた時はこちらが実行される
      console.log(XMLHttpRequest); // エラー内容表示
  });
}



//カレンダーのヘッダーとtd要素の値を結合して、指定文字列に変換するメソッド
function getCalenderDate (tdDOM) {
  const header = document.getElementById('header');
  let date = header.textContent;
  date += tdDOM.textContent;
  date = replaceDateFormat(date, '/');
  return date;
}