<?php
header('Content-Type: application/json');


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
$email = $_POST['email'];
$password = $_POST['password'];

// Requête SQL pour récupérer l'utilisateur par nom
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
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
        $_SESSION['prenom'] = $row['prenom'];
        $_SESSION['nom'] = $row['nom'];
        $_SESSION['age'] = $row['age'];
        $_SESSION['poids'] = $row['poids'];
        $_SESSION['adresse'] = $row['adresse'];
        $_SESSION['telephone'] = $row['telephone'];
        $_SESSION['email'] = $row['email'];
        $_SESSION['genre'] = $row['genre'];
        $_SESSION['activite'] = $row['activite'];
        $_SESSION['taille'] = $row['taille'];

        echo json_encode(['success' => true]);
    } else {
        // Mot de passe incorrect
        echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect.']);
    }
} else {
    // Utilisateur non trouvé
    echo json_encode(['success' => false, 'message' => 'Identifiants incorrects.']);
}

$stmt->close();
$conn->close();
?>
