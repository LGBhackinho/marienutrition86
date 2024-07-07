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

    session_start();

    $id = $_SESSION['userid'];

    $imc = $_POST['imc'];
    $poidsInitial = $_POST['poidsInitial'];
    $depenseCal = $_POST['depenseCal'];
    $tauxMasseGrasse = $_POST['tauxMasseGrasse'];
    $objectifCal = $_POST['objectifCal'];
    $glucides = $_POST['glucides'];
    $lipides = $_POST['lipides'];
    $proteines = $_POST['proteines'];
    $poidsAtteindre = $_POST['poidsAtteindre'];
    $date = (new DateTime())->format('Y-m-d H:i:s'); // Obtenez la date actuelle et formatez-la

    if (empty($response['errors']['email'])) {
        // Préparer et lier
        $stmt = $conn->prepare("INSERT INTO infoNutrition (user_id, imc, poidsInitial, depenseCal, tauxMasseGrasse, objectifCal, glucides, lipides, proteines, poidsAtteindre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)");
        $stmt->bind_param("iidddddddd", $id, $imc, $poidsInitial, $depenseCal, $tauxMasseGrasse, $objectifCal, $glucides, $lipides, $proteines, $poidsAtteindre);

        // Exécuter la requête
        if ($stmt->execute()) {
            $response['success'] = true;
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
