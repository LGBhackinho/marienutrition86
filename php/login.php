<?php
header('Content-Type: application/json');

// Activer l'affichage des erreurs (à désactiver en production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Connexion à la base de données (à adapter avec vos paramètres)
$servername = "localhost"; // Remplacez par le bon nom d'hôte si nécessaire
$username = "root";
$password = "";
$dbname = "marienutrition";

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connexion échouée : ' . $conn->connect_error]));
}

// Initialisation des variables pour récupérer les données du formulaire
$username = $_POST['username'];
$password = $_POST['password'];

// Requête SQL pour récupérer l'utilisateur par nom
$stmt = $conn->prepare("SELECT id, password FROM users WHERE prenom = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Utilisateur trouvé, vérifier le mot de passe
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];

    if (password_verify($password, $hashed_password)) {
        // Authentification réussie
        session_start();
        $_SESSION['loggedin'] = true;
        $_SESSION['userid'] = $row['id']; // Stocker l'ID de l'utilisateur dans la session
        echo json_encode(['success' => true]);
    } else {
        // Mot de passe incorrect
        echo json_encode(['success' => false, 'message' => 'Mot de passe incorrects.']);
    }
} else {
    // Utilisateur non trouvé
    echo json_encode(['success' => false, 'message' => 'Identifiants incorrects.']);
}

$stmt->close();
$conn->close();
?>
