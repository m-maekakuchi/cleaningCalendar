'use strict'

let notShowAcceptDaysNum; // カレンダーに色付けされていない受取可能日の数

let preRequestDayDOM; // 前にクリックした日
let preAcceptDaysAry; // 前に表示された受取可能期間

function clickDay(clickDayDOM) {

  //クリックしたのが2回目以降のとき、クリック日の背景色を削除
  if (preRequestDayDOM !== undefined) {
    preRequestDayDOM.classList.remove('request');
  }
  preRequestDayDOM = clickDayDOM;
  
  clickDayDOM.classList.add('request');
  const clickDayStr = getCalenderDateStr(clickDayDOM);
  console.log(`クリックした日：${clickDayStr}`);

  // PHPに送るデータ
  const jsonData = {
    "clickDayStr" : clickDayStr,
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
    // 戻ってきたら実行する処理
    function(param){  // paramに処理後のデータが入って戻ってくる
      console.log(`受取可能期間：${param}`);

      console.log(preAcceptDaysAry);

      notShowAcceptDaysNum = addAcceptDateColor(param, 5, preAcceptDaysAry);
      // 受取可能期間すべてがクリック日の翌月の場合
      if (notShowAcceptDaysNum === 5) {
        next();
        notShowAcceptDaysNum = addAcceptDateColor(param, 5, preAcceptDaysAry);
      }
      preAcceptDaysAry = param;
    },
    // エラーが起きた時に実行される
    function(XMLHttpRequest, textStatus, errorThrown){ 
      console.log(XMLHttpRequest); // エラー内容表示
  });
}



//カレンダーのヘッダーとtd要素の値を結合して、指定文字列に変換するメソッド
function getCalenderDateStr (tdDOM) {
  const header = document.getElementById('header');
  let date = header.textContent;
  date += tdDOM.textContent;
  date = replaceDateFormat(date, '/');
  return date;
}

//受取可能期間の日付に色をつけるメソッド
function addAcceptDateColor(param, notShowAcceptDaysNum, preAcceptDaysAry) {
  const tdDOMs = document.getElementsByTagName('td');
  for (let tdDOM of tdDOMs) {
    let tdDate = getCalenderDateStr(tdDOM);
    if (preAcceptDaysAry !== undefined) {
      for (let preAcceptDay of preAcceptDaysAry) {
        if (preAcceptDay === tdDate) {
          tdDOM.classList.remove('accept');
        }
      }
    }
    for (let acceptDate of param) {
      if (acceptDate === tdDate && !tdDOM.classList.contains('disabled')) {
        tdDOM.classList.add('accept');
        notShowAcceptDaysNum--;
      }
    }
  }
  return notShowAcceptDaysNum;
}
