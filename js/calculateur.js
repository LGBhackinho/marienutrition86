document.addEventListener("click", function (event) {
  var details = document.getElementById("details");
  var images = document.getElementById("images");
  if (
    !details.contains(event.target) &&
    !document.getElementById("toggleDetailsButton").contains(event.target)
  ) {
    details.style.display = "none";
  }
  if (
    !images.contains(event.target) &&
    !document.getElementById("dropdownIcon").contains(event.target)
  ) {
    images.style.display = "none";
  }
});

function calcul() {
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
  let depenseCal = 5;
  const coefProteine = 1.8;
  const coefLipide = 0.8;
  if (genre === "femme") {
    depenseCal = 655.1 + 9.56 * poids + 1.85 * taille - 4.67 * age;
  } else if (genre === "homme") {
    depenseCal = 66.5 + 13.75 * poids + 5 * taille - 6.77 * age;
    console.log(depenseCal);
  }
  depenseCal *= activite; // Ajuster en fonction de l'activité physique
  document.getElementById("objectifCal").value = (0.75 * depenseCal).toFixed(2);
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
}

function calculLog(poids, taille, age, genre, activite) {
  // Récupérer les valeurs du formulaire

  // Calculer l'IMC
  let imc = poids / (taille / 100) ** 2;
  document.getElementById("imc").value = imc.toFixed(2);

  // Calculer la dépense calorique journalière
  let depenseCal;
  const coefProteine = 1.8;
  const coefLipide = 0.8;
  if (genre === "femme") {
    depenseCal = 655.1 + 9.56 * poids + 1.85 * taille - 4.67 * age;
  } else if (genre === "homme") {
    depenseCal = 66.5 + 13.75 * poids + 5 * taille - 6.77 * age;
  }
  depenseCal *= activite; // Ajuster en fonction de l'activité physique
  document.getElementById("objectifCal").value = (0.75 * depenseCal).toFixed(2);
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
}

function toggleDetails(button) {
  var details = document.getElementById("details");
  var rect = button.getBoundingClientRect();
  details.style.top = rect.top + window.scrollY - 400 + "px";
  details.style.left =
    rect.left + window.scrollX + button.offsetWidth - 360 + "px";
  details.style.display = details.style.display === "none" ? "block" : "none";
}

function toggleImages(icon) {
  var images = document.getElementById("images");
  var rect = icon.getBoundingClientRect();
  images.style.top = rect.top + window.scrollY - 400 + "px";
  images.style.left =
    rect.left + window.scrollX + icon.offsetWidth - 360 + "px";
  images.style.display = images.style.display === "none" ? "block" : "none";
}

function selectBodyFatPercentage(value) {
  document.getElementById("tauxMasseGrasse").value = value;
  document.getElementById("images").style.display = "none";
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////// Enregistrement Donnee DASN BDD ///////////////////
/////////////////////////////////////////////////////////////////////////

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire (soumission traditionnelle)

    var formData = new FormData(document.getElementById("registrationForm")); // 'this' doit être un HTMLFormElement

    fetch("/siteMarie/php/saveNutritionBdd.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Assurez-vous que le serveur renvoie des données JSON
      })
      .then((data) => {
        // Traitez les données JSON ici

        if (data.success) {
          // Mettre à jour le prénom dans le titre du profil

          document.getElementById("emailError").textContent =
            "Mise a jour effectuée";
          document.getElementById("emailError").style.color = "green";
        } else {
          document.getElementById("emailError").textContent = data.errors.email;
          document.getElementById("emailError").style.color = "red";
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
      });
  });
