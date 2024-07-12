<?php
session_start();

$userId = $_SESSION['userid']; // Assurez-vous que l'ID utilisateur est stocké en session lors de la connexion
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "marienutrition";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, filename, filepath, uploaded_at FROM files WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$files = array();
while ($row = $result->fetch_assoc()) {
    $files[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($files);
?>
