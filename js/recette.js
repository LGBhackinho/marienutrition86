
function decodeUTF8(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch (e) {
    return str;
  }
}
      
      //const url = '../data_instagram/your_instagram_activity/content/posts_1.json';
      
      // Utilisation de fetch pour charger le fichier JSON
      fetch('data_instagram/your_instagram_activity/content/posts_1.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Conversion de la réponse en JSON
        })
        .then(data => {
          // Assurez-vous que 'content' est défini
          const content = document.getElementById('content');
          if (!content) {
            console.error('Element with id "content" not found.');
            return;
          }
      
          // Affichage des données JSON dans l'élément div
          data.forEach(post => {
            const media = post.media[0];
            
                    
            
            // Title
            if ((media.title !== "") && (media.title.length > 308)) { 
              const postElement = document.createElement('div');
            postElement.className = 'post';
              // Image
            const img = document.createElement('img');
            img.src = "data_instagram/" + media.uri;
            postElement.appendChild(img);
              // Divise la chaîne en fonction du caractère "#"
              let mediaTitleSplit = media.title.split('#')[0];
              const title = document.createElement('div');
              title.className = 'title';
              title.textContent = decodeUTF8(mediaTitleSplit);
              
              postElement.appendChild(title);
              content.appendChild(postElement);
            }
            
            
          });
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });

        console.log("ok");

function decodeUTF8(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch (e) {
    return str;
  }
}

function filterRecettes() {
  const motCle = document.getElementById('motCle').value.toLowerCase(); // Récupère le mot-clé en minuscules
  let searchIsFind= false;
  // Utilisation de fetch pour charger le fichier JSON
  fetch('data_instagram/your_instagram_activity/content/posts_1.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Conversion de la réponse en JSON
    })
    .then(data => {
      const content = document.getElementById('content');
      content.innerHTML = ''; // Efface le contenu précédent
      
      // Filtrer les données JSON en fonction du mot-clé
      data.forEach(post => {
        const media = post.media[0];
        
        // Vérifie si le titre du média contient le mot-clé saisi
        if (media.title.toLowerCase().includes(motCle) && (media.title !== "") && (media.title.length > 308))  {
          const postElement = document.createElement('div');
          postElement.className = 'post';
          
          // Image
          const img = document.createElement('img');
          img.src = "data_instagram/" + media.uri;
          postElement.appendChild(img);
          
          // Titre
          // Divise la chaîne en fonction du caractère "#"
          let mediaTitleSplit = media.title.split('#')[0];
          const title = document.createElement('div');
          title.className = 'title';
          title.textContent = decodeUTF8(mediaTitleSplit);
          
          postElement.appendChild(title);
          content.appendChild(postElement);


         searchIsFind = media.title.toLowerCase().includes(motCle)
        }
        
      });
      if (!searchIsFind) {
        const postElement = document.createElement('div');
          postElement.className = 'post';
          
          // Image
          const img = document.createElement('img');
          img.src = "images/recherche_introuvable.png";
          postElement.appendChild(img);
          
          // Titre
          // Divise la chaîne en fonction du caractère "#"
          let mediaTitleSplit = "Oups Aucune recette ne correspond, essaye encore " + String.fromCodePoint(0x1F609);
          const title = document.createElement('div');
          title.className = 'title';
          title.textContent = decodeUTF8(mediaTitleSplit);
          title.style.textAlign = "center"
          postElement.appendChild(title);
          content.appendChild(postElement);
      } 
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}


        




