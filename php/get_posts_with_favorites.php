<?php
session_start();

// Configuration de la base de données

include 'configBDD.php';

$servername = servername;
$dbname = dbname;
$username = username;
$password = password;

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Vérifiez si l'utilisateur est connecté
if (!isset($_SESSION['userid'])) {
  echo json_encode(['success' => false, 'message' => 'User not authenticated']);
  exit();
}

$userId = $_SESSION['userid'];

// Récupérer les posts avec leur statut de favori pour l'utilisateur donné
$sql = "
SELECT post_id, is_favorite 
FROM recette 
WHERE user_id = ?
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$posts = [];
while($row = $result->fetch_assoc()) {
    $posts[] = $row;
}

echo json_encode($posts);

$stmt->close();
$conn->close();
?>
