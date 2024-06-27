document.addEventListener('DOMContentLoaded', function() {
    // Charger l'en-tête et le pied de page
    loadHeader();
    loadFooter();
    
    
    // Fonction pour charger le contenu dans la partie principale de la page
    window.loadContent = function(page) {
        document.querySelector('#main').style.opacity = 0;
        document.querySelector('#main').style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            page_html = "html/" + page;
            page_css = "css/" + page;
            
            fetch(page_html)
                .then(response => response.text())
                .then(data => {
                    setTimeout(() => {
                        document.querySelector('#main').style.opacity = 1;
                        document.querySelector('#main').style.transition = 'opacity 0.3s';
                    }, 300);
                    
                    document.getElementById('main').innerHTML = data;
                    loadPageSpecificCSS(page);
                    if ((page === "recette.html" ) || (page === "alimentation.html")|| (page === "blog.html")){
                        loadPageSpecificJS(page);
                    }
                    
                    // Maintenant que le contenu est chargé, vérifiez si #rss-feed existe
                    const feedContainer = document.getElementById('rss-feed');
                    if (feedContainer) {
                        // Appeler appelRss() ou toute autre fonction de manipulation ici
                        appelRss();
                    }
                });
        }, 400);
    };
    
    // Fonction pour charger l'en-tête
    function loadHeader() {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
            });
    }

    // Fonction pour charger le pied de page
    function loadFooter() {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer').innerHTML = data;
            });
    }

    // Fonction pour charger le CSS spécifique à chaque page
    function loadPageSpecificCSS(page) {
        // Supprimer les anciennes feuilles de style
        document.querySelectorAll('link[rel="stylesheet"]').forEach(element => {
            if (element.href.includes('css/')) {
                element.parentNode.removeChild(element);
            }
        });
    
        // Charger la nouvelle feuille de style spécifique à la page
        const cssFile = "css/" + (page.replace('.html', '.css'));
        const linkElement = document.createElement('link');
        const linkElement1 = document.createElement('link');
        const linkElement2 = document.createElement('link');
        linkElement1.rel = 'stylesheet';
        linkElement1.href = 'css/reset.css'
        document.head.appendChild(linkElement1);
        linkElement2.rel = 'stylesheet';
        linkElement2.href = 'css/style.css'
        document.head.appendChild(linkElement2);
        linkElement.rel = 'stylesheet';
        linkElement.href = cssFile;
        console.log(cssFile)
        document.head.appendChild(linkElement);
        
    }

    // Fonction pour charger le JS spécifique à chaque page
    function loadPageSpecificJS(page) {
        const jsFile = "js/" + (page.replace('.html', '.js'));
        const scriptElement = document.createElement('script');
        scriptElement.src = jsFile;
        document.body.appendChild(scriptElement);
    }


//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// GEstion des log

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");

// Simulate the login state of the user
const isLoggedIn = false; // Change this to true if the user is logged in

if (isLoggedIn) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "block";
} else {
    loginBtn.style.display = "block";
    signupBtn.style.display = "block";
    logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", function() {
    // Logic to handle logout
    alert("Déconnecté");
    // After logout, reload the page or redirect to the homepage
    location.reload();
});

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// POUR LA PAGE BLOG /////////////////////////////////////////////////////////

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

    // Fonction pour charger le flux RSS et afficher les articles
    function appelRss() {
        const rssUrl = 'php/fetch_rss.php';
        fetch(rssUrl)
            .then(response => response.json())
            .then(data => {
                displayRssFeed(data);
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
    }

    // Fonction pour afficher les articles du flux RSS
    function displayRssFeed(data) {
        const feedContainer = document.getElementById('rss-feed');
        if (!feedContainer) {
            console.error('Element with id "rss-feed" not found.');
            return;
        }

        feedContainer.innerHTML = ''; // Efface le contenu existant au cas où

        const items = data.channel.item;
        if (!items) {
            feedContainer.innerHTML = '<p>Aucun article trouvé.</p>';
            return;
        }

        items.forEach(item => {
            const itemLi = document.createElement('li');
            itemLi.classList.add('rss-item');

            const descriptionDiv = document.createElement('div');
            descriptionDiv.innerHTML = item.description;

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
});
