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

<?php
session_start();


// Vérifiez si l'utilisateur est connecté
if (!isset($_SESSION['userid'])) {
  echo json_encode(['success' => false, 'message' => 'User not authenticated']);
  exit();
}

// Obtenez les données POST
$data = json_decode(file_get_contents('php://input'), true);
$postId = $data['postId'];
$isFavorite = $data['isFavorite'] ? 1 : 0;
$userId = $_SESSION['userid'];

// Mettre à jour la base de données
$stmt = $conn->prepare("INSERT INTO recette (user_id, post_id, is_favorite) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE is_favorite = ?");
$stmt->bind_param("iiii", $userId, $postId, $isFavorite, $isFavorite);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => 'Failed to update favorite']);
}

$stmt->close();
$conn->close();
?>
