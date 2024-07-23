<?php

// Configuration de la base de données

include 'configBDD.php';

$servername = servername;
$dbname = dbname;
$username = username;
$password = password;

session_start();
$user_id = $_SESSION['userid'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM infoNutrition WHERE user_id = $user_id";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo "0 results";
}

$conn->close();

echo json_encode($data);
?>
