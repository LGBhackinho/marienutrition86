<?php
// Connexion à la base de données (à adapter avec vos paramètres)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "marienutrition";

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    die("Connexion échouée : " . $conn->connect_error);
}

// Initialisation des variables pour récupérer les données du formulaire
$username = $_POST['username']; // Remplacez 'username' par le nom du champ dans votre formulaire
$password = $_POST['password']; // Remplacez 'password' par le nom du champ dans votre formulaire

// Requête SQL pour vérifier les informations d'identification
$sql = "SELECT id FROM users WHERE nom = '$username' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Authentification réussie
    session_start();
    $_SESSION['loggedin'] = true;
    header('Location: ../index.html'); // Redirection vers la page d'accueil après connexion
    exit();
} else {
    // Identifiants incorrects
    echo "Identifiants incorrects.";
}

$conn->close();
?>
