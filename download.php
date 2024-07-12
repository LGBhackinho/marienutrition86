<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}



// Configuration de la base de données (comme dans register.php)
$host = 'localhost';
$db = 'marienutrition';
$user = 'root';
$pass = '';

// Connexion à la base de données
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Échec de la connexion : " . $e->getMessage());
}

if (isset($_SESSION['user_id'])) {
   
    $stmt = $pdo->prepare("SELECT * FROM files WHERE  user_id = :user_id");
    $stmt->execute(['id' => $id, 'user_id' => $_SESSION['user_id']]);
    $file = $stmt->fetch();

    if ($file) {
        $filepath = $file['filepath'];
        if (file_exists($filepath)) {
            header('Content-Type: application/pdf');
            header('Content-Disposition: inline; filename="' . basename($filepath) . '"');
            header('Content-Transfer-Encoding: binary');
            header('Accept-Ranges: bytes');
            @readfile($filepath);
            exit;
        }
    }
    die("Fichier non trouvé.");
}
?>
