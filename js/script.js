document.addEventListener("DOMContentLoaded", function () {
  // Charger l'en-tête et le pied de page
  loadHeader();
  loadFooter();

  // Fonction pour charger le contenu dans la partie principale de la page
  window.loadContent = function (page) {
    document.querySelector("#main").style.opacity = 0;
    document.querySelector("#main").style.transition = "opacity 0.5s";

    setTimeout(() => {
      page_html = "html/" + page;
      page_css = "css/" + page;

      fetch(page_html)
        .then((response) => response.text())
        .then((data) => {
          setTimeout(() => {
            document.querySelector("#main").style.opacity = 1;
            document.querySelector("#main").style.transition = "opacity 0.3s";
          }, 300);

          document.getElementById("main").innerHTML = data;
          loadPageSpecificCSS(page);
          const menuSmartphone = document.querySelector(".container-menu-smartphone");
          menuSmartphone.style.display = "none";
          document.querySelector(".hamburger").innerHTML = "&#9776;";
          if (
            page === "recette.html" ||
            page === "alimentation.html" ||
            page === "blog.html" ||
            page === "calculateur.html" ||
            page === "profil.html" ||
            page === "tarif_et_contact.html" ||
            page === "infoNutrition.html"
          ) {
            loadPageSpecificJS(page);
          }
        });
    }, 400);
  };

  // Fonction pour charger l'en-tête
  function loadHeader() {
    fetch("header.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("header").innerHTML = data;
      });
  }

  // Fonction pour charger le pied de page
  function loadFooter() {
    fetch("footer.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("footer").innerHTML = data;
      });
  }

  // Fonction pour charger le CSS spécifique à chaque page
  function loadPageSpecificCSS(page) {
    // Supprimer les anciennes feuilles de style
    document.querySelectorAll('link[rel="stylesheet"]').forEach((element) => {
      if (element.href.includes("css/")) {
        element.parentNode.removeChild(element);
      }
    });

    // Charger la nouvelle feuille de style spécifique à la page
    const cssFile = "css/" + page.replace(".html", ".css");
    const linkElement = document.createElement("link");
    const linkElement1 = document.createElement("link");
    const linkElement2 = document.createElement("link");
    linkElement1.rel = "stylesheet";
    linkElement1.href = "css/reset.css";
    document.head.appendChild(linkElement1);
    linkElement2.rel = "stylesheet";
    linkElement2.href = "css/style.css";
    document.head.appendChild(linkElement2);
    linkElement.rel = "stylesheet";
    linkElement.href = cssFile;

    document.head.appendChild(linkElement);
  }

  // Fonction pour charger le JS spécifique à chaque page
  function loadPageSpecificJS(page) {
    // Supprimer les anciens scripts spécifiques à chaque page
    document.querySelectorAll("script").forEach((script) => {
      if (
        script.src.includes("js/") &&
        !script.hasAttribute("data-persistent")
      ) {
        script.parentNode.removeChild(script);
      }
    });

    // Charger le nouveau script spécifique à la page

    const jsFile = "js/" + page.replace(".html", ".js");
    const scriptElement = document.createElement("script");
    scriptElement.src = jsFile;
    document.body.appendChild(scriptElement);
  }
});

function hamburger() {
  const menuSmartphone = document.querySelector(".container-menu-smartphone");
//   document.querySelector(".lien-header").addEventListener("click",function () {
//     menuSmartphone.style.display = "none";
//   },
//   false,
// );

  if (
    menuSmartphone.style.display === "" ||
    menuSmartphone.style.display === "none"
  ) {
    menuSmartphone.style.display = "flex";
    document.querySelector(".hamburger").innerHTML = "&#935;";
    return true;
  }

  if (menuSmartphone.style.display === "flex") {
    menuSmartphone.style.display = "none";
    document.querySelector(".hamburger").innerHTML = "&#9776;";
    return true;
  }
}
