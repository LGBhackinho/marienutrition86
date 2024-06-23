

// Fonction de filtrage des articles par mot-clé
function filterArticles() {
    const keyword = document.getElementById('keyword').value.toLowerCase();
    const articles = document.querySelectorAll('.rss-item');

    articles.forEach(article => {
        const title = article.querySelector('h3 a').innerText.toLowerCase();
        const description = article.querySelector('p').innerText.toLowerCase();

        if (title.includes(keyword) || description.includes(keyword)) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}







function displayRssFeed(data) {
    const feedContainer = document.getElementById('rss-feed');
    const items = data.channel.item;

    // Vérifier s'il y a des articles
    if (!items) {
        feedContainer.innerHTML = '<p>Aucun article trouvé.</p>';
        return;
    }

    // Parcourir et afficher chaque article
    items.forEach(item => {
        const itemLi = document.createElement('li');
        itemLi.classList.add('rss-item');

        const descriptionDiv = document.createElement('div');
        descriptionDiv.innerHTML = item.description;

        // Extraire et afficher les images de la description
        const img = descriptionDiv.querySelector('img');
        if (img) {
            const imgElement = document.createElement('img');
            imgElement.src = img.getAttribute('data-src') || img.getAttribute('src');
            itemLi.appendChild(imgElement);
        }

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('rss-item-content');

        const title = document.createElement('h3');
        title.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
        contentDiv.appendChild(title);

        const description = document.createElement('p');
        description.textContent = descriptionDiv.textContent;
        contentDiv.appendChild(description);

        // Ajouter un lien "En savoir plus" si le texte est trop long
        if (descriptionDiv.textContent.length > 100) {
            const readMore = document.createElement('div');
            readMore.classList.add('read-more');
            readMore.innerHTML = `<a href="${item.link}" target="_blank">En savoir plus</a>`;
            contentDiv.appendChild(readMore);
        }

        itemLi.appendChild(contentDiv);
        feedContainer.appendChild(itemLi);
    });
}


