<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Ecommerce
{
    //for admin login
    function adminLogin($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        if (empty($json['username']) || empty($json['password'])) {
            return json_encode([]);
        }
        $sql = "SELECT * FROM `admin` WHERE BINARY username = :username AND BINARY password = :password";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $json['username']);
        $stmt->bindParam(':password', $json['password']);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for adding new product (admin only)
    function addProduct()
    {
        include 'connection.php';
        
        // Check if product exists
        $productName = $_POST['productName'];
        $checkSql = "SELECT COUNT(*) FROM `product` WHERE `product_name` = :productName";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindParam(':productName', $productName);
        $checkStmt->execute();
        $productExists = $checkStmt->fetchColumn() > 0;
        if ($productExists) {
            return json_encode(['success' => false, 'message' => 'Product already exists']);
        }
    
        // Handle image upload
        if (isset($_FILES['productImage'])) {
            $image = $_FILES['productImage'];
            $imagePath = 'uploads/' . basename($image['name']); // Directory to store the image
    
            if (!move_uploaded_file($image['tmp_name'], $imagePath)) {
                return json_encode(['success' => false, 'message' => 'Failed to upload image']);
            }
        } else {
            return json_encode(['success' => false, 'message' => 'No image uploaded']);
        }
    
        // Insert product into database
        $productPrice = $_POST['productPrice'];
        $productDescription = $_POST['productDescription'];
        $category = $_POST['category'];
        $admin = $_POST['admin'];
    
        $sql = "INSERT INTO `product`(`product_name`, `product_price`, `product_description`, `category`, `admin`, `image_path`) 
                VALUES (:productName, :productPrice, :productDescription, :category, :admin, :imagePath)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productName', $productName);
        $stmt->bindParam(':productPrice', $productPrice);
        $stmt->bindParam(':productDescription', $productDescription);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':admin', $admin);
        $stmt->bindParam(':imagePath', $imagePath);
        $stmt->execute();
    
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
        unset($conn);
        unset($stmt);
        return json_encode(['success' => true, 'result' => $returnValue]);
    }
    

    //for displaying all products (both admin & users can see)
    function displayProducts($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "SELECT
        product.product_id,
        product.product_name,
        FORMAT(product.product_price, 2) AS product_price,
        product.product_description,
        category.category_id,
        category.category_name
        FROM product
        INNER JOIN category ON product.category = category.category_id
        ORDER BY product.product_name ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for displaying all products by its product_id (admin & users can see)
    function displayProductsbyId($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "SELECT
        product.product_id,
        product.product_name,
        product.product_price, 
        product.product_description,
        category.category_id,
        category.category_name
        FROM product
        INNER JOIN category ON product.category = category.category_id
        WHERE product.product_id = :productId
        ORDER BY product.product_name ASC";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productId', $json['productId']);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for updating product (admin only)
    function updateProduct($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $checkSql = "SELECT COUNT(*) FROM `product` WHERE `product_name` = :productName AND `product_id` != :productId";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindParam(':productName', $json['productName']);
        $checkStmt->bindParam(':productId', $json['productId']);
        $checkStmt->execute();
        $productExists = $checkStmt->fetchColumn() > 0;
        if ($productExists) {
            return json_encode(['success' => false, 'message' => 'Product name already exists']);
        }
        $sql = "UPDATE `product` SET `product_name` = :productName, `product_price` = :productPrice, `product_description` = :productDescription, 
                `category` = :category, `admin` = :admin WHERE product_id = :productId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productName', $json['productName']);
        $stmt->bindParam(':productPrice', $json['productPrice']);
        $stmt->bindParam(':productDescription', $json['productDescription']);
        $stmt->bindParam(':category', $json['category']);
        $stmt->bindParam(':admin', $json['admin']);
        $stmt->bindParam(':productId', $json['productId']);
        $stmt->execute();
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
        unset($conn);
        unset($stmt);
        return json_encode(['success' => true, 'result' => $returnValue]);
    }

    //for adding new category (admin only)
    function addCategory($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "INSERT INTO `category`(`category_name`, `admin`) VALUES ( :categoryName, :admin )";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':categoryName', $json['categoryName']);
        $stmt->bindParam(':admin', $json['admin']);
        $stmt->execute();
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for displaying all categories (both admin & users can see)
    function displayCategory($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "SELECT * FROM `category` ORDER BY category_name ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for user login
    function userLogin($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        if (empty($json['username']) || empty($json['password'])) {
            return json_encode([]);
        }
        $sql = "SELECT * FROM `user` WHERE BINARY username = :username AND BINARY password = :password";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $json['username']);
        $stmt->bindParam(':password', $json['password']);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for user registration
    function userRegister($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);

        // Check if username already exists
        $checkSql = "SELECT COUNT(*) FROM `user` WHERE `username` = :username";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindParam(':username', $json['username']);
        $checkStmt->execute();
        $usernameExists = $checkStmt->fetchColumn() > 0;
        if ($usernameExists) {
            return json_encode(['success' => false, 'message' => 'Username already exists']);
        }
        $sql = "INSERT INTO `user`(`firstname`, `lastname`, `gender`, `username`, `password`) 
                VALUES (:firstname, :lastname, :gender, :username, :password)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':firstname', $json['firstname']);
        $stmt->bindParam(':lastname', $json['lastname']);
        $stmt->bindParam(':gender', $json['gender']);
        $stmt->bindParam(':username', $json['username']);
        $stmt->bindParam(':password', $json['password']);
        $stmt->execute();
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
        unset($conn);
        unset($stmt);
        return json_encode(['success' => true, 'result' => $returnValue]);
    }

    //for adding product to cart (user only)
    function addToCart($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "INSERT INTO `cart`(`user_id`, `product_id`, `quantity`)";
        $sql .= "VALUES ( :userId, :productId, :quantity )";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':userId', $json['userId']);
        $stmt->bindParam(':productId', $json['productId']);
        $stmt->bindParam(':quantity', $json['quantity']);
        $stmt->execute();
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for ordering the product (user only)
    /*Note: This function can be used for adding products to the cart, placing an order, or for direct ordering.*/
    function orders($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $orders = $json['orders'];
        foreach ($orders as $order) {
            $sql = "INSERT INTO `orders`(`user_id`, `product_id`, `quantity`)";
            $sql .= "VALUES ( :userId, :productId, :quantity )";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':userId', $order['userId']);
            $stmt->bindParam(':productId', $order['productId']);
            $stmt->bindParam(':quantity', $order['quantity']);
            $stmt->execute();
        }
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    function displayOrdersOnDashboard($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "SELECT
        user.user_id,
        user.firstname,
        user.lastname,
        product.product_id,
        product.product_name,
        FORMAT(product.product_price, 2) AS product_price,  
        orders.quantity,
        category.category_id,
        category.category_name,
        FORMAT(orders.quantity * product.product_price, 2) AS total_price 
        FROM orders
        INNER JOIN product ON orders.product_id = product.product_id
        INNER JOIN category ON product.category = category.category_id
        INNER JOIN user ON orders.user_id = user.user_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    function displayUsers($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "SELECT * FROM `user` ORDER BY lastname ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }
}


if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = $_GET['operation'];
    $json = $_GET['json'];
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = $_POST['operation'];
    $json = $_POST['json'];
}

$ecommerce = new Ecommerce();
switch ($operation) {
    case "adminLogin":
        echo $ecommerce->adminLogin($json);
        break;
        case "addProduct":
            echo $ecommerce->addProduct(); // No argument needed
            break;
        
    case "displayProducts":
        echo $ecommerce->displayProducts($json);
        break;
    case "displayProductsbyId":
        echo $ecommerce->displayProductsbyId($json);
        break;
    case "updateProduct":
        echo $ecommerce->updateProduct($json);
        break;
    case "addCategory":
        echo $ecommerce->addCategory($json);
        break;
    case "displayCategory":
        echo $ecommerce->displayCategory($json);
        break;
    case "userLogin":
        echo $ecommerce->userLogin($json);
        break;
    case "userRegister":
        echo $ecommerce->userRegister($json);
        break;
    case "addToCart":
        echo $ecommerce->addToCart($json);
        break;
    case "orders":
        echo $ecommerce->orders($json);
        break;
    case "displayOrdersOnDashboard":
        echo $ecommerce->displayOrdersOnDashboard($json);
        break;
    case "displayUsers":
        echo $ecommerce->displayUsers($json);
        break;
}
