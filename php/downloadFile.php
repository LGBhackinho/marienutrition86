<?php
// Commencez par une session pour gérer les utilisateurs connectés
session_start();

// Vérifiez si l'utilisateur est autorisé


if (isset($_SESSION['userid'])) {
   


if (isset($_GET['file'])) {
    $file = basename($_GET['file']); // Sécurisez l'entrée de l'utilisateur
    $filePath = '../fichiers_pdf/' . $file;

    if (file_exists($filePath)) {
        // Définir les en-têtes pour le téléchargement
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename=' . $file);
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));
        flush(); // Videz le tampon de sortie
        readfile($filePath);
        exit;
    } else {
        die("Le fichier n'existe pas.");
    }
} else {
    die("Aucun fichier spécifié.");
}
}else{
    die("Vous n'êtes pas autorisé à accéder à ce fichier.");
}
?>
