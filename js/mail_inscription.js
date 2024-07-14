
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Initialisation de l'API emailjs
emailjs.init("i1nVXsoiw4iBFDXil");

// Récupération du formulaire
const contactForm = document.getElementById('registrationForm');

// Écouteur d'événement pour le soumission du formulaire
contactForm.addEventListener('submit', function(e) {
    
    e.preventDefault()

    // Récupération des valeurs du formulaire
    // const formData = new FormData(contactForm);

    // Envoi du formulaire via emailjs
    
      // TODO
      emailjs.sendForm('service_z5e01po', 'template_7eva2bn', '#registrationForm')  
      .then(()=>{
        console.log("ok")}
      
      
     )
     .catch((erreur)=>{console.error(erreur)});
});
  