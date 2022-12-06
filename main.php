<?php
// ヘッダ（データ形式、文字コードなど指定）
header('Content-type: application/json; charset=utf-8');
// 送ったデータの受け取り（配列を受け取る場合は第3, 4引数の指定が必要）
$jsonData = filter_input(INPUT_POST, 'クリック日と祝日', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);

$clickDate     = $jsonData['clickDayStr']; //クリックした日付
$holidayAry    = $jsonData['holidayAry'];  //祝日
$sunday        = 0;
$saturday      = 6;
$accepPriod    = 5;  // 受取可能期間 (5日)
$acceptDateAry = []; // 受取可能日を格納する配列
$endDate       = date('Y/n/t', strtotime($clickDate)); // 月の最終日
$toPlantDays   = 2;  // ➀店舗から工場への移送にかかる日数
$cleaningDays  = 5;  // ➁工場でのクリーニングにかかる日数
$toCheckDays   = 1;  // ➂工場から検品場所への移送にかかる日数
$chekingDays   = 1;  // ➃検品にかかる日数
$toshopDays    = 2;  // ➄検品場所から店舗への移送にかかる日数

// ➀の完了日
$toPlantEndDate = addDate($clickDate, $toPlantDays);

// ➁の完了日
$cleningEndDate = $toPlantEndDate;
$cleaningCount = 0;
do {
    $cleningEndDate = addDate($cleningEndDate, 1);
    $datetime = new DateTime($cleningEndDate);
    $week = $datetime->format('w');
    if ($week != $sunday && $week != $saturday && !isHoliday($holidayAry, $cleningEndDate)) $cleaningCount++;
} while ($cleaningCount < $cleaningDays);


// ➂の完了日
$toCheckEndDate = addDate($cleningEndDate, $toCheckDays);


// ➃の完了日
$chekingEndDate =  $toCheckEndDate;
do {
    $chekingEndDate = addDate($chekingEndDate, $chekingDays);
    $datetime = new DateTime($chekingEndDate);
    $week = $datetime->format('w');
} while ($week == $sunday || $week == $saturday || isHoliday($holidayAry, $chekingEndDate));


// ➄の完了日
$toshopEndDate = addDate($chekingEndDate, $toshopDays);

// ➅の開始日 
$strageStartDate = addDate($toshopEndDate, 1);

//受取可能日を配列に格納
$count = 0;
while($count < $accepPriod) {
  array_push($acceptDateAry, $strageStartDate);
  $strageStartDate = addDate($strageStartDate, 1);
  $count++;
}

// echoするとデータを返せる（JSON形式に変換して返す）
echo json_encode($acceptDateAry);


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