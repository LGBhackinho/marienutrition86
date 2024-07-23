<?php
session_start();

if (!isset($_SESSION['userid'])|| (!$_SESSION['userid']=== 1 && !$_SESSION['userid']=== 2) ) {
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

// Traitement de la suppression d un fichier
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_file'])) {
    $file_id = $_POST['delete_file'];

    // Récupérer le chemin du fichier pour pouvoir le supprimer du serveur
    $stmt = $pdo->prepare("SELECT filepath FROM files WHERE id = ?");
    $stmt->execute([$file_id]);
    $file = $stmt->fetch();

    if ($file) {
        // Supprimer le fichier du serveur 
        unlink($file['filepath']);

        // Supprimer l'entrée de la base de données
        $stmt = $pdo->prepare("DELETE FROM files WHERE id = ?");
        $stmt->execute([$file_id]);

        echo "Fichier supprimé avec succès.";
    }
}

///// TRAITEMENT DE SUPPRESSION D UN USER ET DES DONNEES PROPRE A LUI  NON FONCTIONNEL A CE JOUR 

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_user_files'])) {
    $user_id = $_POST['delete_user_files'];

    // Récupérer les chemins des fichiers pour pouvoir les supprimer du serveur si nécessaire
    $stmt = $pdo->prepare("SELECT filepath FROM files WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $files = $stmt->fetchAll();

    foreach ($files as $file) {
        // Supprimer chaque fichier du serveur
        unlink($file['filepath']);
    }

    // Supprimer les entrées de la base de données
    $stmt = $pdo->prepare("DELETE FROM files WHERE user_id = ?");
    $stmt->execute([$user_id]);

    echo "Tous les fichiers de l'utilisateur supprimés avec succès.";
}

// Récupération des utilisateurs et de leurs fichiers associés
$stmt = $pdo->prepare("
    SELECT users.*, files.id AS file_id, files.filename, files.filepath
    FROM users
    LEFT JOIN files ON users.id = files.user_id
    ORDER BY users.id, files.id
");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_GROUP); // Regrouper les résultats par ID utilisateur
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link rel="stylesheet" href="../css/dashbordAdmin.css">
</head>
<body>
    <h1>Uploader un fichier</h1>
    <form action="/php/upload.php" method="post" enctype="multipart/form-data">
        <label for="user_id">Utilisateur :</label>
        <select name="user_id" id="user_id">
            <!-- Remplir dynamiquement avec les utilisateurs de la base de données -->
            <?php foreach ($users as $user_id => $files): ?>
                <option value="<?= htmlspecialchars($user_id) ?>"><?= htmlspecialchars($files[0]['nom']) ?> <?= htmlspecialchars($files[0]['prenom']) ?></option>
            <?php endforeach; ?>
        </select>
        <br><br>
        <label for="file">Fichier :</label>
        <input type="file" name="file" id="file" required>
        <br><br>
        <button type="submit">Uploader</button>
    </form>

    <h1>Liste des utilisateurs et leurs fichiers</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Poids</th>
                <th>Fichier</th>
                <th>Utilisateur</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($users as $user_id => $files): ?>
            <tr>
                <td><?= htmlspecialchars($user_id) ?></td>
                <td><?= htmlspecialchars($files[0]['nom']) ?></td>
                <td><?= htmlspecialchars($files[0]['prenom']) ?></td>
                <td><?= htmlspecialchars($files[0]['email']) ?></td>
                <td><?= htmlspecialchars($files[0]['telephone']) ?></td>
                <td><?= htmlspecialchars($files[0]['poids']) ?></td>
                <td>
                    <?php if (!empty($files)): ?>
                        <form action="dashboardAdmin.php" method="post">
                            <select name="delete_file">
                                <option value="">Choisir un fichier</option>
                                <?php foreach ($files as $file): ?>
                                    <option value="<?= htmlspecialchars($file['file_id']) ?>"><?= htmlspecialchars($file['filename']) ?></option>
                                <?php endforeach; ?>
                            </select>
                            <button type="submit">Supprimer</button>
                        </form>
                    <?php else: ?>
                        Aucun fichier
                    <?php endif; ?>
                </td>
                <td>
                    <form action="dashboardAdmin.php" method="get">
                        <input type="hidden" name="delete_user_files" value="<?= htmlspecialchars($user_id) ?>">
                        <button type="submit">Supprimer</button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
