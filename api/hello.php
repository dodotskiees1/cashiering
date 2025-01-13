<?php 
header("Content-Type: application/json"); //send pure text
header("Access-Control-Allow-Origin: *"); //allow access any website

//$name = $_GET['name'];

$yearLevel = $_GET['year_level'];


if($yearLevel == '1'){
    $students = [
        [ 'name' => 'Bos Baby', 'balance' => '3000'],
        [ 'name' => 'Raul', 'balance' => '500'],
        [ 'name' => 'Carlos', 'balance' => '120'],
        [ 'name' => 'Ronex', 'balance' => '43'],
        [ 'name' => 'Kenneth Bayot', 'balance' => '72'],
     ];
}else{
    $students = [
        [ 'name' => 'Bos chuy', 'balance' => '100003'],
        [ 'name' => 'Raul', 'balance' => '5'],
     ];
}

// $students = [
//    [ 'name' => 'Bos Baby', 'balance' => '3000'],
//    [ 'name' => 'Raul', 'balance' => '500'],
//    [ 'name' => 'Carlos', 'balance' => '120'],
//    [ 'name' => 'Ronex', 'balance' => '43'],
//    [ 'name' => 'Kenneth Bayot', 'balance' => '72'],
// ];

echo json_encode($students);

?>