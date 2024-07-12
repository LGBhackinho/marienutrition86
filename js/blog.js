console.log("testttttt");

// Maintenant que le contenu est chargé, vérifiez si #rss-feed existe
const feedContainer = document.getElementById("rss-feed");
if (feedContainer) {
  // Appeler appelRss() ou toute autre fonction de manipulation ici
  appelRss();
}

// Fonction de filtrage des articles par mot-clé
function filterArticles() {
  const keyword = document.getElementById("keyword").value.toLowerCase();
  const articles = document.querySelectorAll(".rss-item");

  articles.forEach((article) => {
    const title = article.querySelector("h3 a").innerText.toLowerCase();
    const description = article.querySelector("p").innerText.toLowerCase();

    if (title.includes(keyword) || description.includes(keyword)) {
      article.style.display = "block";
    } else {
      article.style.display = "none";
    }
  });
}

// Fonction pour charger le flux RSS et afficher les articles
function appelRss() {
  const rssUrl = "php/fetch_rss.php";
  fetch(rssUrl)
    .then((response) => response.json())
    .then((data) => {
      displayRssFeed(data);
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
}

// Fonction pour afficher les articles du flux RSS
function displayRssFeed(data) {
  const feedContainer = document.getElementById("rss-feed");
  if (!feedContainer) {
    console.error('Element with id "rss-feed" not found.');
    return;
  }

  feedContainer.innerHTML = ""; // Efface le contenu existant au cas où

  const items = data.channel.item;
  if (!items) {
    feedContainer.innerHTML = "<p>Aucun article trouvé.</p>";
    return;
  }

  items.forEach((item) => {
    const itemLi = document.createElement("li");
    itemLi.classList.add("rss-item");

    const descriptionDiv = document.createElement("div");
    descriptionDiv.innerHTML = item.description;

    const img = descriptionDiv.querySelector("img");
    if (img) {
      const imgElement = document.createElement("img");
      imgElement.src = img.getAttribute("data-src") || img.getAttribute("src");
      itemLi.appendChild(imgElement);
    }

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("rss-item-content");

    const title = document.createElement("h3");
    title.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
    itemLi.appendChild(title);

    const description = document.createElement("p");
    description.textContent = descriptionDiv.textContent;
    contentDiv.appendChild(description);

    if (descriptionDiv.textContent.length > 100) {
      const readMore = document.createElement("div");
      readMore.classList.add("read-more");
      readMore.innerHTML = `<a href="${item.link}" target="_blank">En savoir plus</a>`;
      contentDiv.appendChild(readMore);
    }

    itemLi.appendChild(contentDiv);
    feedContainer.appendChild(itemLi);
  });
}
