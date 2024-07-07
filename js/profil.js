///////////////////////////////////////////////////////////////////////////////
/////////////////////// MISE A JOUR PROFIL DASN BDD ///////////////////
/////////////////////////////////////////////////////////////////////////


document.getElementById("registrationForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire (soumission traditionnelle)

  var formData = new FormData(document.getElementById('registrationForm')); // 'this' doit être un HTMLFormElement

  fetch('/siteMarie/php/profil.php', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Assurez-vous que le serveur renvoie des données JSON
  })
  .then(data => {
      // Traitez les données JSON ici
     
      if (data.success) {
          // Mettre à jour le prénom dans le titre du profil
          document.getElementById('prenom').textContent = "Profil de " + data.updated_prenom;
          document.getElementById('emailError').textContent = 'Mise a jour effectuée';
          document.getElementById('emailError').style.color = 'green';
      } else {
         
          document.getElementById('emailError').textContent = data.errors.email;
          document.getElementById('emailError').style.color = 'red';
      }
  })
  .catch(error => {
      console.error('Erreur lors de la récupération des données:', error);
  });
});






