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

    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = "Adresse e-mail non valide.";
    } else {
        // Vérification si l'email existe déjà dans la base de données et récupérer l'ID utilisateur
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id);

        if ($stmt->num_rows > 0) {
            $stmt->fetch();
        } else {
            $response['errors']['email'] = "Aucun utilisateur trouvé avec cet e-mail.";
        }

        $stmt->close();
    }

    if (empty($response['errors']['email'])) {
        // Préparer et lier
        $stmt = $conn->prepare("UPDATE users SET prenom = ?, nom = ?, age = ?, poids = ?, taille = ?, adresse = ?, telephone = ?, genre = ?, activite = ? WHERE id = ?");
        $stmt->bind_param("ssidisisssi", $prenom, $nom, $age, $poids, $taille, $adresse, $telephone, $genre, $activite, $id);

        // Exécuter la requête
        if ($stmt->execute()) {
            // Démarrage de la session
            session_start();

            // Stockage des informations de l'utilisateur dans des variables de session
            $_SESSION['loggedin'] = true;
            $_SESSION['userid'] = $id;
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
