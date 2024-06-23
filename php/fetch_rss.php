<?php
// URL du flux RSS
$rss_url = 'https://www.lanutrition.fr/articles/rss/articles.xml';

// Récupérer le contenu du flux RSS
$rss_content = file_get_contents($rss_url);

if ($rss_content === FALSE) {
    // Gérer les erreurs de récupération
    die('Erreur de récupération du flux RSS');
}

// Charger le contenu du flux RSS dans un objet SimpleXMLElement
$rss_xml = simplexml_load_string($rss_content, 'SimpleXMLElement', LIBXML_NOCDATA);

if ($rss_xml === FALSE) {
    // Gérer les erreurs de parsing
    die('Erreur de parsing du flux RSS');
}

// Convertir l'objet SimpleXMLElement en JSON pour l'envoyer à la page HTML
$rss_json = json_encode($rss_xml);

header('Content-Type: application/json');
echo $rss_json;
?>