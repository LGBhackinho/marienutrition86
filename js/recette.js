// Fonction pour décoder les caractères UTF-8
function decodeUTF8(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch (e) {
    return str;
  }
}

/////////////////////////////////////////////////////////////////////
//////////////// CREATION DES ELEMENT DU DOM /////////////////////////////
async function creationDom(index, post, media) {
  const postElement = document.createElement("div");
  postElement.className = "post";

  const divImg = document.createElement("div");
  divImg.className = "contener-img";
  const img = document.createElement("img");
  img.className = "img-recette";
  img.src = "data_instagram/" + media.uri;
  divImg.appendChild(img);

  const content = document.getElementById("content");
  const loggedIn = content.getAttribute("data-logged-in") === "true";

  if (loggedIn) {
    const favorite = await createFavoriteIcon(index, post.isFavorite); // Attendre la création de l'icône favori
    if (favorite) {
      favorite.className = "img-favoris";
      divImg.appendChild(favorite);
    }
  }

  postElement.appendChild(divImg);
  let mediaTitleSplit = media.title.split("#")[0];
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = decodeUTF8(mediaTitleSplit);
  postElement.appendChild(title);

  content.appendChild(postElement);
}

////////////////////////////////////////////////////////////////////////////////
// Fonction pour charger l'état des favoris depuis la base de données
async function loadFavoritesFromDatabase(postId) {
  try {
    const response = await fetch("php/get_posts_with_favorites.php");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const found = data.find((recipe) => postId === recipe.post_id);
    return !!found; // Retourne true si trouvé, sinon false
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return false;
  }
}

// //////////////////////////////////////////////////////////////////////
// Fonction pour créer l'icône de favori avec gestion du clic
async function createFavoriteIcon(postId, isActive) {
  try {
    isActive = await loadFavoritesFromDatabase(postId);

    const favorite = document.createElement("img");
    favorite.src = isActive
      ? "images/coeur_favoris.png"
      : "images/coeur_vide.png";

    favorite.onclick = async function () {
      const newFavoriteStatus = !isActive;
      const success = await updateFavorite(postId, newFavoriteStatus);
      if (success) {
        favorite.src = newFavoriteStatus
          ? "images/coeur_favoris.png"
          : "images/coeur_vide.png";
        isActive = newFavoriteStatus; // Mettre à jour l'état local après mise à jour en base
      }
    };

    return favorite;
  } catch (error) {
    console.error("Failed to create favorite icon:", error);
    return null;
  }
}

// Fonction pour mettre à jour le statut des favoris dans la base de données
async function updateFavorite(postId, isFavorite) {
  try {
    const response = await fetch("php/update_favoris.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: postId, isFavorite: isFavorite }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data.success) {
      console.log("Favorite updated successfully");
      return true;
    } else {
      console.error("Failed to update favorite");
      return false;
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return false;
  }
}
// //////////////////////////////////////////////////////////////
// Fonction pour afficher les recettes avec gestion des favoris
async function DisplayRecettes() {
  try {
    const response = await fetch(
      "data_instagram/your_instagram_activity/content/posts_1.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const content = document.getElementById("content");
    content.innerHTML = "";

    for (let index = 0; index < data.length; index++) {
      const post = data[index];
      const media = post.media[0];
      if (media.title.length > 308) {
        ////FONCTION CREATION DES ELEMENTS DASN LE DOM
        creationDom(index, post, media);
      }
    }
  } catch (error) {
    console.error("Failed to filter and display recipes:", error);
  }
}

//////////////////////////////////////////////////////////////////////////////
// Fonction pour filtrer et afficher les recettes avec gestion des favoris
async function filterRecettes() {
  const motCle = document.getElementById("motCle").value.toLowerCase(); // Récupère le mot-clé en minuscules
  let searchIsFind = false;

  try {
    const response = await fetch(
      "data_instagram/your_instagram_activity/content/posts_1.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const content = document.getElementById("content");
    content.innerHTML = "";

    for (let index = 0; index < data.length; index++) {
      const post = data[index];
      const media = post.media[0];
      if (
        media.title.toLowerCase().includes(motCle) &&
        media.title !== "" &&
        media.title.length > 308
      ) {
        ////FONCTION CREATION DES ELEMENTS DASN LE DOM
        creationDom(index, post, media);

        searchIsFind = media.title.toLowerCase().includes(motCle);
      }
    }
    if (!searchIsFind) {
      const postElement = document.createElement("div");
      postElement.className = "post";

      // Image
      const img = document.createElement("img");
      img.src = "images/recherche_introuvable.png";
      postElement.appendChild(img);

      // Titre
      // Divise la chaîne en fonction du caractère "#"
      let mediaTitleSplit =
        "Oups Aucune recette ne correspond, essaye encore " +
        String.fromCodePoint(0x1f609);
      const title = document.createElement("div");
      title.className = "title";
      title.textContent = decodeUTF8(mediaTitleSplit);
      title.style.textAlign = "center";
      postElement.appendChild(title);
      content.appendChild(postElement);
    }
  } catch (error) {
    console.error("Failed to filter and display recipes:", error);
  }
}

//////////////////////////////////////////////////////////////////////////////
// Fonction pour filtrer et afficher les recettes mise en favoris dasn la BDD avec gestion des favoris
async function filterFavoris() {
  let searchIsFind = false;
  let memFavoris = false;

  try {
    const response = await fetch(
      "data_instagram/your_instagram_activity/content/posts_1.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const content = document.getElementById("content");
    content.innerHTML = "";

    for (let index = 0; index < data.length; index++) {
      const post = data[index];
      const media = post.media[0];

      searchIsFind = await loadFavoritesFromDatabase(index);

      searchIsFind ? (memFavoris = true) : null;

      if (media.title !== "" && media.title.length > 308 && searchIsFind) {
        ////FONCTION CREATION DES ELEMENTS DASN LE DOM
        creationDom(index, post, media);
      }
    }
    if (!memFavoris) {
      const postElement = document.createElement("div");
      postElement.className = "post";

      // Image
      const img = document.createElement("img");
      img.src = "images/recherche_introuvable.png";
      postElement.appendChild(img);

      // Titre
      // Divise la chaîne en fonction du caractère "#"
      let mediaTitleSplit =
        "Oups Aucun favoris n'a été sélectionné " +
        String.fromCodePoint(0x1f609);
      const title = document.createElement("div");
      title.className = "title";
      title.textContent = decodeUTF8(mediaTitleSplit);
      title.style.textAlign = "center";
      postElement.appendChild(title);
      content.appendChild(postElement);
    }
  } catch (error) {
    console.error("Failed to filter and display recipes:", error);
  }
}

/////////////////////////////////////////////////////////////////
// Appel initial pour filtrer le json et afficher les recettes avec gestion des favoris
DisplayRecettes();

///////////////////////////////////////////////////////////////////////
// Fonction pour afficher/masquer la flèche en fonction du défilement
window.onscroll = function () {
  let scrollTopBtn = document.getElementById("scrollTopBtn");
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
};

// Fonction pour remonter en haut de la page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
