<?php
// ヘッダ（データ形式、文字コードなど指定）
header('Content-type: application/json; charset=utf-8');
// 送ったデータの受け取り（配列を受け取る場合は第3, 4引数の指定が必要）
$jsonData = filter_input(INPUT_POST, 'クリックした日付', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);

$clickDay        = $jsonData['clickDayStr'];
$holidayAry      = $jsonData['holidayAry'];
$sunday          = 0;
$saturday        = 6;
$accepPriod      = 5; // 受取可能期間 (5日)
$endDate         = date('Y/n/t', strtotime($clickDay)); // 月の最終日
$acceptDateAry   = []; // 受取可能日を格納する配列

// ➀の完了日
$toPlant = addDate($clickDay, 2);

// ➁の完了日
$clening = $toPlant;
$cleaningCount = 0;
do {
    $clening = addDate($clening, 1);
    $datetime = new DateTime($clening);
    $week = $datetime->format('w');
    if ($week != $sunday && $week != $saturday && !isHoliday($holidayAry, $clening)) $cleaningCount++;
} while ($cleaningCount < 5);


// ➂の完了日
$toCheck = addDate($clening, 1);


// ➃の完了日
$cheking =  $toCheck;
do {
    $cheking = addDate($cheking, 1);
    $datetime = new DateTime($cheking);
    $week = $datetime->format('w');
} while ($week == $sunday || $week == $saturday || isHoliday($holidayAry, $cheking));


// ➄の完了日
$toshop = addDate($cheking, 2);

// ➅の開始日 
$strageStart = addDate($toshop, 1);

$count = 0;
while($count < $accepPriod) {
  array_push($acceptDateAry, $strageStart);
  $strageStart = addDate($strageStart, 1);
  $count++;
}

echo json_encode($acceptDateAry); //　echoするとデータを返せる（JSON形式に変換して返す）


/**
 * 祝日か判定するメソッド
 *
 * @return boolean
*/
function isHoliday($dateList, $checkDate) {
  forEach ($dateList as $date) {
    if ($date[0] == $checkDate) return true;
  }
  return false;
}

/**
 * 日付を指定日数分加算するメソッド
 *
 * @return string
*/
function addDate($date, $addDayNum) {
  return date("Y/n/j", strtotime("{$date} ".$addDayNum." day"));
}

?>