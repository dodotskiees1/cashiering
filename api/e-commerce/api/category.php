<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'connection.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
   
    $sql = "SELECT category.category_id, category.category_name FROM category";
    $stmt = $pdo->query($sql);
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categories);
} elseif ($method == 'POST') {
 
    $data = json_decode(file_get_contents("php://input"), true);
    $category_name = $data['category_name'];

    if ($category_name) {
        $sql = "INSERT INTO category (category_name) VALUES (:category_name)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':category_name', $category_name);

        if ($stmt->execute()) {
            $response = [
                'success' => true,
                'category_id' => $pdo->lastInsertId(),
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'Failed to add category',
            ];
        }
    } else {
        $response = [
            'success' => false,
            'message' => 'Invalid input',
        ];
    }

    echo json_encode($response);
}
?>
