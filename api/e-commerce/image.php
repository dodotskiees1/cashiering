<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class uploadImage
{

    function addImage($json)
    {
        //{"theImage":"infinixGt20.jpg","imageId":1}
        include 'connection.php';
        // decode the JSON data recieved from the client
        $jsonData = json_decode($json, true);

        // extract the image ID and base64-encoded image data from the JSON data
        $imageId = $jsonData['imageId'];
        $imageData = $jsonData['file'];

        // decode the base64-encoded image data
        $imageDataDecoded = base64_decode($imageData);

        //specify the the directory where you want to save the uploaded image
        $targetDir = '../images/';

        //determine the file extension based on the MIME type of the image data
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->buffer($imageDataDecoded);

        $extensions = [
            'image/jpeg' => '.jpg',
            'image/png' => '.png',
            'image/gif' => '.gif',
            'image/webp' => '.webp',
            'image/bmp' => '.bmp',
        ];

        $extension = isset($extensions[$mime]) ? $extensions[$mime] : '.jpg';

        //Generate the unique filename for the uploaded image (to be saved in database)
        //$filename = uniqid() . $extension; //not following the image id
        $filename = $imageId . $extension;

        // specify the full path to the uploaded image file
        $targetFile = $targetDir . $filename;

        //write the decoded image data to the file
        if (file_put_contents($targetFile, $imageDataDecoded)) {
            //save to database
            $sql = "UPDATE upload SET the_image=:theImage
            WHERE image_id=:imageId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':theImage', $filename);
            $stmt->bindParam(':imageId', $imageId);
            $stmt->execute();
            $returnValue = 'Image uploaded succesfully';
        } else {
            $returnValue = 'Failed to upload image';
        }

        return $returnValue;
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = $_GET['operation'];
    $json = $_GET['json'];
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = $_POST['operation'];
    $json = $_POST['json'];
}

$image = new uploadImage();
switch ($operation) {
    case "addImage":
        echo $image->addImage($json);
        break;
}
