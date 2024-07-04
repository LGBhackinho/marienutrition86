document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(this);

    fetch("/siteMarie/php/profil.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "../index.html";
        } else {
          document.getElementById("emailError").textContent = data.errors.email;
        }
      })
      .catch((error) => console.error("Error:", error));
  });

document
  .getElementById("calculerButton")
  .addEventListener("click", function () {
    // Récupérer les valeurs du formulaire
    let poids = parseFloat(document.getElementById("poidsInitial").value);
    let taille = parseFloat(document.getElementById("taille").value);
    let age = parseInt(document.getElementById("age").value);
    let genre = document.getElementById("genre").value;
    let activite = parseFloat(document.getElementById("activite").value);

    // Calculer l'IMC
    let imc = poids / (taille / 100) ** 2;
    document.getElementById("imc").value = imc.toFixed(2);

    // Calculer la dépense calorique journalière
    let depenseCal;
    const coefProteine = 1.8;
    const coefLipide = 0.8;
    if (genre === "FEMME") {
      depenseCal = 655.1 + 9.56 * poids + 1.85 * taille - 4.67 * age;
    } else if (genre === "HOMME") {
      depenseCal = 66.5 + 13.75 * poids + 5 * taille - 6.77 * age;
    }
    depenseCal *= activite; // Ajuster en fonction de l'activité physique
    document.getElementById("objectifCal").value = (0.75 * depenseCal).toFixed(
      2
    );
    document.getElementById("depenseCal").value =
      Math.floor(depenseCal.toFixed(2) / 100) * 100;
    document.getElementById("proteines").value = (
      coefProteine *
      0.75 *
      poids
    ).toFixed(2);
    document.getElementById("lipides").value = (
      coefLipide *
      0.75 *
      poids
    ).toFixed(2);
    document.getElementById("glucides").value = (
      (0.75 * depenseCal.toFixed(2) -
        (coefProteine * 0.75 * poids).toFixed(2) * 4 -
        (coefLipide * 0.75 * poids).toFixed(2) * 9) /
      4
    ).toFixed(2);
  });

function toggleDetails(button) {
  var details = document.getElementById("details");
  var rect = button.getBoundingClientRect();
  details.style.top = rect.top + window.scrollY - 400 + "px";
  details.style.left =
    rect.left + window.scrollX + button.offsetWidth - 500 + "px";
  details.style.display = details.style.display === "none" ? "block" : "none";
}

function toggleImages(icon) {
  var images = document.getElementById("images");
  var rect = icon.getBoundingClientRect();
  images.style.top = rect.top + window.scrollY - 400 + "px";
  images.style.left =
    rect.left + window.scrollX + icon.offsetWidth - 500 + "px";
  images.style.display = images.style.display === "none" ? "block" : "none";
}

function selectBodyFatPercentage(value) {
  document.getElementById("tauxMasseGrasse").value = value;
  document.getElementById("images").style.display = "none";
}

window.onload = function () {
  var ctx = document.getElementById("weightChart").getContext("2d");
  var weightChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "2024-01-01",
        "2024-02-01",
        "2024-03-01",
        "2024-04-01",
        "2024-05-01",
      ], // Simulated dates
      datasets: [
        {
          label: "Poids (kg)",
          data: [78, 75, 73, 71, 70], // Simulated weights
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "month",
          },
          adapters: {
            date: {
              locale: dateFns.locale.fr,
            },
          },
        },
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};
