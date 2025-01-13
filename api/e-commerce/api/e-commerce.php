<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Ecommerce
{

    //for admin login
    function adminLogin($json)
    {
        include 'connection.php';
        //{"username":"admin","password":123}
        $json = json_decode($json, true);
        $sql = "SELECT * FROM `admin` WHERE username = :username AND password = :password";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $json['username']);
        $stmt->bindParam(':password', $json['password']);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for adding a product (for admin only)
    function adminAddProduct($json)
    {
        include 'connection.php';
        //{"productName":"Poco X3", "productPrice":17000, "category":1, "admin":1}
        $json = json_decode($json, true);
        $sql = "INSERT INTO `product`(`product_name`, `product_price`, `category`, `admin`)";
        $sql .= "VALUES ( :productName, :productPrice, :category, :admin )";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productName', $json['productName']);
        $stmt->bindParam(':productPrice', $json['productPrice']);
        $stmt->bindParam(':category', $json['category']);
        $stmt->bindParam(':admin', $json['admin']);
        $stmt->execute();
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    //for displaying the product (for admin only)
    function adminDisplayProduct($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "SELECT
        product.product_id,
        product.product_name,
        product.product_price,
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

    //for adding a category (for admin only)
    function adminAddCategory($json)
    {
        include 'connection.php';
        //{"categoryName":"Laptop", "admin":1}
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

    //for displaying the category (for admin only)
    function adminDisplayCategory($json)
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
        //{"username":"joie","password":123}
        $json = json_decode($json, true);
        $sql = "SELECT
        user.user_id,
        user.firstname,
        user.lastname,
        gender.gender_name,
        user.username,
        user.password
        FROM user
        INNER JOIN gender ON user.gender = gender.gender_id
        WHERE user.username = :username AND user.password = :password
        ORDER BY user.lastname";
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
    function userRegistration($json)
    {
        include 'connection.php';
        //{"firstname":"Ivan Carl", "lastname":"Ubanan", "gender":1, "username":"ivan:", "password":123}
        $json = json_decode($json, true);
        $sql = "INSERT INTO `user`(`firstname`, `lastname`, `gender`, `username`, `password`)";
        $sql .= "VALUES ( :firstname, :lastname, :gender, :username, :password)";
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
        return json_encode($returnValue);
    }

    //for displaying gender (for user only)
    function userDisplayGender($json)
    {
        include 'connection.php';
        $json = json_decode($json, true);
        $sql = "SELECT * FROM `gender` ORDER BY gender_name ASC";
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
    case "adminAddProduct":
        echo $ecommerce->adminAddProduct($json);
        break;
    case "adminDisplayProduct":
        echo $ecommerce->adminDisplayProduct($json);
        break;
    case "adminAddCategory":
        echo $ecommerce->adminAddCategory($json);
        break;
    case "adminDisplayCategory":
        echo $ecommerce->adminDisplayCategory($json);
        break;
    case "userLogin":
        echo $ecommerce->userLogin($json);
        break;
    case "userRegistration":
        echo $ecommerce->userRegistration($json);
        break;
    case "userDisplayGender":
        echo $ecommerce->userDisplayGender($json);
        break;
}
