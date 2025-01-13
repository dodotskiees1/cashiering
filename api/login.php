<?php
header("Content-Type: application/json"); 
header("Access-Control-Allow-Origin: *"); 

$accounts = [
    ['username' => 'Kulas', 'password' => '54321'],
    ['username' => 'Anadel', 'password' => 'duke'],
    ['username' => 'Raul', 'password' => '12345'],
    ['username' => 'warren', 'password' => '12345'],
    ['username' => 'ivan', 'password' => '12345'],
];

echo json_encode($accounts);

?>