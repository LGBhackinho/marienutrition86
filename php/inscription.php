<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "marienutrition";

// Créer une connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $prenom = $_POST['prenom'];
    $nom = $_POST['nom'];
    $age = $_POST['age'];
    $poids = $_POST['poids'];
    $adresse = $_POST['adresse'];
    $telephone = $_POST['telephone'];
    $email = $_POST['email'];
    $genre = $_POST['genre'];
    $activite = $_POST['activite'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validation du mot de passe
    if ($password != $confirm_password) {
        echo "Les mots de passe ne correspondent pas.";
        exit();
    }

    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Adresse e-mail non valide.";
        exit();
    }

    // Validation de l'email avec regex pour structure
    $email_regex = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/";
    if (!preg_match($email_regex, $email)) {
        echo "Structure de l'adresse e-mail non valide.";
        exit();
    }

    // Hash du mot de passe
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Préparer et lier
    $stmt = $conn->prepare("INSERT INTO users (prenom, nom, age, poids, adresse, telephone, email, genre, activite, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssidsissss", $prenom, $nom, $age, $poids, $adresse, $telephone, $email, $genre, $activite, $hashed_password);

    // Exécuter la requête
    if ($stmt->execute()) {
        // Démarrage de la session
        session_start();

        // Stockage des informations de l'utilisateur dans des variables de session
        $_SESSION['prenom'] = $prenom;
        $_SESSION['nom'] = $nom;
        $_SESSION['email'] = $email;
        $_SESSION['loggedin'] = true;
        $_SESSION['userid'] = $row['id']; // Stocker l'ID de l'utilisateur dans la session
        // Redirection vers la page d'accueil après inscription réussie
        header("Location: ../index.html");
        exit();
    } else {
        echo "Erreur: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
