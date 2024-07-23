<?php
session_start();

if (!isset($_SESSION['userid'])) {
    header('Location: ../html/login.html');
    exit;
}

// Configuration de la base de données

include 'configBDD.php';

$host = servername;
$db = dbname;
$user = username;
$pass = password;

$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Échec de la connexion : " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file']) && isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
    $filename = $_FILES['file']['name'];
    $file_tmp = $_FILES['file']['tmp_name'];
    $upload_dir = '../fichiers_pdf/';

    // Vérifier et créer le dossier s'il n'existe pas
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Déplacer le fichier uploadé
    $file_path = $upload_dir . basename($filename);
    if (move_uploaded_file($file_tmp, $file_path)) {
        // Insérer l'entrée dans la base de données
        $stmt = $pdo->prepare("INSERT INTO files (user_id, filename, filepath) VALUES (:user_id, :filename, :filepath)");
        $stmt->execute(['user_id' => $user_id, 'filename' => $filename, 'filepath' => $file_path]);

        echo "Fichier uploadé avec succès.";
    } else {
        echo "Erreur lors de l'upload du fichier.";
    }
}
?>
