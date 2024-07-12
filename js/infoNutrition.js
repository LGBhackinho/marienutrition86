// Fonction pour charger dynamiquement un script
function loadScript(url, callback) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

// Charger Chart.js et chartjs-adapter-date-fns puis exécuter la fonction principale
loadScript("https://cdn.jsdelivr.net/npm/chart.js", function () {
  loadScript("https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns", main);
});

// Fonction principale qui s'exécute après le chargement de Chart.js et de chartjs-adapter-date-fns
function main() {
  const userId = 1; // Remplacez ceci par l'ID de l'utilisateur connecté

  fetch(`/siteMarie/php/infoNutrition.php`)
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.date);
      const poidsData = data.map((item) => item.poidsInitial);
      const poidsAAteindreData = data.map((item) => item.poidsAtteindre);
      const imcData = data.map((item) => item.imc);

      const ctx = document.getElementById("nutritionChart").getContext("2d");
      const nutritionChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "POIDS",
              data: poidsData,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              fill: false,
            },
            {
              label: "POIDS À ATTEINDRE",
              data: poidsAAteindreData,
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              fill: false,
            },
            {
              label: "IMC",
              data: imcData,
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
            },
            y: {
              beginAtZero: true,
            },
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const item = data[index];
              document.getElementById("infoBox").innerHTML = `
                <h3>Information du ${item.date}</h3>
                <br>
                <p><span>IMC:</span> ${item.imc}</p>
                <p><span>Poids à date:</span> ${item.poidsInitial} Kg</p>
                <p><span>Dépense Calorique:</span> ${item.depenseCal} Cal</p>
                <p><span>Taux de Masse Grasse:</span> ${item.tauxMasseGrasse} %</p>
                <p><span>Objectif Calorique:</span> ${item.objectifCal} Cal/j</p>
                <p><span>Glucides:</span> ${item.glucides} gr/j</p>
                <p><span>Lipides:</span> ${item.lipides} gr/j</p>
                <p><span>Protéines:</span> ${item.proteines} gr/j</p>
                <p><span>Poids à Atteindre:</span> ${item.poidsAtteindre} Kg</p>
              `;
            }
          },
        },
      });
    });

  // Récupérer et afficher la liste des fichiers de l'utilisateur
  fetch(`/siteMarie/php/getUserFiles.php`)
    .then((response) => response.json())
    .then((files) => {
      const userFilesContainer = document.getElementById("userFiles");
      if (files.length > 0) {
        let fileList = "<h3>Vos fichiers :</h3><ul>";
        files.forEach((file) => {
          fileList += `<li><a href="${file.filepath}" download>${file.filename}</a> (Uploaded at: ${file.uploaded_at})</li>`;
        });
        fileList += "</ul>";
        userFilesContainer.innerHTML = fileList;
      } else {
        userFilesContainer.innerHTML = "<p>Aucun fichier disponible.</p>";
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des fichiers:", error);
      document.getElementById("userFiles").innerHTML =
        "<p>Erreur lors de la récupération des fichiers.</p>";
    });
}
