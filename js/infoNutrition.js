


// Fonction pour charger dynamiquement un script
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Charger Chart.js et chartjs-adapter-date-fns puis exécuter la fonction principale
loadScript('https://cdn.jsdelivr.net/npm/chart.js', function() {
    loadScript('https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns', main);
});

// Fonction principale qui s'exécute après le chargement de Chart.js et de chartjs-adapter-date-fns
function main() {
    const userId = 1; // Remplacez ceci par l'ID de l'utilisateur connecté

    fetch(`/siteMarie/php/infoNutrition.php`)
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.date);
            const poidsData = data.map(item => item.poidsInitial);

            const ctx = document.getElementById('nutritionChart').getContext('2d');
            const nutritionChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'POIDS',
                        data: poidsData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const item = data[index];
                            document.getElementById('infoBox').innerHTML = `
                                <h3>Information du ${item.date}</h3>
                                <br>
                                <p>IMC: ${item.imc}</p>
                                <p>Poids Initial: ${item.poidsInitial}</p>
                                <p>Dépense Calorique: ${item.depenseCal}</p>
                                <p>Taux de Masse Grasse: ${item.tauxMasseGrasse}</p>
                                <p>Objectif Calorique: ${item.objectifCal}</p>
                                <p>Glucides: ${item.glucides}</p>
                                <p>Lipides: ${item.lipides}</p>
                                <p>Protéines: ${item.proteines}</p>
                                <p>Poids à Atteindre: ${item.poidsAtteindre}</p>
                            `;
                        }
                    }
                }
            });
        });
}
