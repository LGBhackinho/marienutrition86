<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "marienutrition";

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Vérification de l'authentification de l'utilisateur
if (!isset($_SESSION['userid'])) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit();
}

// Récupération des données POST
$data = json_decode(file_get_contents('php://input'), true);
$postId = $data['postId'];
$isFavorite = $data['isFavorite'] ? 1 : 0; // Convertit en 1 ou 0

$userId = $_SESSION['userid'];

// Vérification si l'enregistrement existe déjà
$stmt = $conn->prepare("SELECT * FROM recette WHERE user_id = ? AND post_id = ?");
$stmt->bind_param("ii", $userId, $postId);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows > 0) {
    // L'enregistrement existe, on met à jour ou on supprime selon la valeur de isFavorite
    if ($isFavorite == 1) {
        $stmt_update = $conn->prepare("UPDATE recette SET is_favorite = ? WHERE user_id = ? AND post_id = ?");
        $stmt_update->bind_param("iii", $isFavorite, $userId, $postId);
        $success = $stmt_update->execute();
        $stmt_update->close();
    } else {
        $stmt_delete = $conn->prepare("DELETE FROM recette WHERE user_id = ? AND post_id = ?");
        $stmt_delete->bind_param("ii", $userId, $postId);
        $success = $stmt_delete->execute();
        $stmt_delete->close();
    }
} else {
    // L'enregistrement n'existe pas, on l'insère si isFavorite est vrai
    if ($isFavorite == 1) {
        $stmt_insert = $conn->prepare("INSERT INTO recette (user_id, post_id, is_favorite) VALUES (?, ?, ?)");
        $stmt_insert->bind_param("iii", $userId, $postId, $isFavorite);
        $success = $stmt_insert->execute();
        $stmt_insert->close();
    } else {
        // Ne rien faire si isFavorite est faux et l'enregistrement n'existe pas
        $success = true; // Considéré comme réussi car aucune action n'est nécessaire
    }
}

// Réponse JSON en fonction du succès de l'opération
if ($success) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update favorite']);
}

$conn->close();
?>
