<?php
header("Content-Type: application/json"); 
header("Access-Control-Allow-Origin: *"); 

$products = [
    ['barcode' => 1001, 'product_name' => 'Bulad', 'product_price' => 10],
    ['barcode' => 1002, 'product_name' => 'Mantika', 'product_price' => 30],
    ['barcode' => 1003, 'product_name' => 'Noodles', 'product_price' => 20],
    ['barcode' => 1004, 'product_name' =>  'Sabon', 'product_price' => 35],
    ['barcode' => 1005, 'product_name' => 'Shampoo', 'product_price' => 15],
    ['barcode' => 1006, 'product_name' => 'Eggs', 'product_price' => 8],
    ['barcode' => 1007, 'product_name' => 'Milk', 'product_price' => 14],
    ['barcode' => 1008, 'product_name' => 'Milo', 'product_price' => 10],
    ['barcode' => 1009, 'product_name' => 'HotDog', 'product_price' => 48],
    ['barcode' => 10010, 'product_name' => 'Ice Cream', 'product_price' => 250],
];

echo json_encode($products);
?>