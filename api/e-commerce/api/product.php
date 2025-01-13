<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'connection.php'; 
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "
      SELECT product.product_id,
            product.product_name,
            product.product_price,
            category.category_name AS category
            
            FROM product
            
            INNER JOIN
            category ON product.category = category.category_id
    ";

    try {
        $stmt = $pdo->query($sql);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $data]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Query failed: ' . $e->getMessage()]);
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $data = json_decode(file_get_contents("php://input"));

    $product_name = $data->product_name;
    $product_price = $data->product_price;
    $category_id = $data->category_id;
    $admin_id = 1;

    $sql = "INSERT INTO product (product_name, product_price, category, admin) 
            VALUES (:product_name, :product_price, :category_id, :admin_id)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':product_name', $product_name);
        $stmt->bindParam(':product_price', $product_price);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':admin_id', $admin_id);
        $stmt->execute();
        echo json_encode(['success' => true, 'message' => 'Product added successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Insert failed: ' . $e->getMessage()]);
    }
}
?>
