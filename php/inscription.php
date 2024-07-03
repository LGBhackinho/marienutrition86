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

$response = [
    'success' => false,
    'errors' => [
        'email' => '',
        'password' => '',
        'general' => ''
    ]
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $prenom = $_POST['prenom'];
    $nom = $_POST['nom'];
    $age = $_POST['age'];
    $poids = $_POST['poids'];
    $taille = $_POST['taille'];
    $adresse = $_POST['adresse'];
    $telephone = $_POST['telephone'];
    $email = $_POST['email'];
    $genre = $_POST['genre'];
    $activite = $_POST['activite'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validation du mot de passe
    if ($password != $confirm_password) {
        $response['errors']['password'] = "Les mots de passe ne correspondent pas.";
    }

    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = "Adresse e-mail non valide.";
    } else {
        // Vérification si l'email existe déjà dans la base de données
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $response['errors']['email'] = "Cet e-mail est déjà utilisé. Veuillez en choisir un autre.";
        }

        $stmt->close();
    }

    if (empty($response['errors']['email']) && empty($response['errors']['password'])) {
        // Hash du mot de passe
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Préparer et lier
        $stmt = $conn->prepare("INSERT INTO users (prenom, nom, age, poids, taille, adresse, telephone, email, genre, activite, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssidisissss", $prenom, $nom, $age, $poids, $taille, $adresse, $telephone, $email, $genre, $activite, $hashed_password);

        // Exécuter la requête
        if ($stmt->execute()) {
            // Récupérer l'ID de l'utilisateur inséré
            $userid = $stmt->insert_id;

            // Démarrage de la session
            session_start();

            // Stockage des informations de l'utilisateur dans des variables de session
            $_SESSION['loggedin'] = true;
            $_SESSION['userid'] = $userid;
            $_SESSION['prenom'] = $prenom;
            $_SESSION['nom'] = $nom;
            $_SESSION['age'] = $age;
            $_SESSION['poids'] = $poids;
            $_SESSION['adresse'] = $adresse;
            $_SESSION['telephone'] = $telephone;
            $_SESSION['email'] = $email;
            $_SESSION['genre'] = $genre;
            $_SESSION['activite'] = $activite;
            $_SESSION['taille'] = $taille;

            $response['success'] = true;
        } else {
            $response['errors']['general'] = "Erreur: " . $stmt->error;
        }

        $stmt->close();
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
