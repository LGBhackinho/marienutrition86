<?php

// Configuration de la base de données

include 'configBDD.php';

$servername = servername;
$dbname = dbname;
$username = username;
$password = password;

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
    $poids = $_POST['poidsInitial']; // Assurez-vous que les noms de champs correspondent
    $taille = $_POST['taille'];
    $adresse = $_POST['adresse'];
    $telephone = $_POST['telephone'];
    $email = $_POST['email'];
    $activite = $_POST['activite'];

    session_start();


    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = "Adresse e-mail non valide.";
    } else {
        // Vérification si l'email existe déjà dans la base de données et récupérer l'ID utilisateur
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $_SESSION['email']);
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
        $stmt = $conn->prepare("UPDATE users SET email = ?, prenom = ?, nom = ?, age = ?, poids = ?, taille = ?, adresse = ?, telephone = ?, activite = ? WHERE id = ?");
        $stmt->bind_param("sssidsisii", $email, $prenom, $nom, $age, $poids, $taille, $adresse, $telephone, $activite, $id);

        // Exécuter la requête
        if ($stmt->execute()) {
            // Démarrage de la session
           

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
            $_SESSION['activite'] = $activite;
            $_SESSION['taille'] = $taille;

            $response['success'] = true;
            $response['updated_prenom'] = $prenom; // Envoyer le nouveau prénom mis à jour
        } else {
            $response['errors']['general'] = "Erreur: " . $stmt->error;
        }

        $stmt->close();
    }
}

$conn->close();

// Toujours retourner une réponse JSON


header('Content-Type: application/json');
echo json_encode($response);
?>
