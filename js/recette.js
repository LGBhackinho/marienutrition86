function decodeUTF8(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch (e) {
    return str;
  }
}

function createFavoriteIcon(postId, isActive) {
  const favorite = document.createElement("span");
  favorite.className = "favorite" + (isActive ? " active" : "");
  favorite.innerHTML = "&#9829;"; // Caractère du cœur

  favorite.onclick = function () {
    favorite.classList.toggle("active");
    const isFavorite = favorite.classList.contains("active");
    updateFavorite(postId, isFavorite);
  };

  return favorite;
}

function updateFavorite(postId, isFavorite) {
  fetch("update_favorite.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId: postId, isFavorite: isFavorite }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Favorite updated successfully");
      } else {
        console.error("Failed to update favorite");
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

fetch("data_instagram/your_instagram_activity/content/posts_1.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const content = document.getElementById("content");
    if (!content) {
      console.error('Element with id "content" not found.');
      return;
    }

    data.forEach((post) => {
      const media = post.media[0];
      if (media.title && media.title.length > 308) {
        const postElement = document.createElement("div");
        postElement.className = "post";

        const img = document.createElement("img");
        img.src = "data_instagram/" + media.uri;
        postElement.appendChild(img);

        let mediaTitleSplit = media.title.split("#")[0];
        const title = document.createElement("div");
        title.className = "title";
        title.textContent = decodeUTF8(mediaTitleSplit);
        postElement.appendChild(title);

        const favorite = createFavoriteIcon(post.id, post.isFavorite);
        postElement.appendChild(favorite);

        content.appendChild(postElement);
      }
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

function filterRecettes() {
  const motCle = document.getElementById("motCle").value.toLowerCase();
  fetch("data_instagram/your_instagram_activity/content/posts_1.json")
    .then((response) => response.json())
    .then((data) => {
      const content = document.getElementById("content");
      content.innerHTML = "";

      let searchIsFind = false;
      data.forEach((post) => {
        const media = post.media[0];
        if (
          media.title.toLowerCase().includes(motCle) &&
          media.title.length > 308
        ) {
          const postElement = document.createElement("div");
          postElement.className = "post";

          const img = document.createElement("img");
          img.src = "data_instagram/" + media.uri;
          postElement.appendChild(img);

          let mediaTitleSplit = media.title.split("#")[0];
          const title = document.createElement("div");
          title.className = "title";
          title.textContent = decodeUTF8(mediaTitleSplit);
          postElement.appendChild(title);

          const favorite = createFavoriteIcon(post.id, post.isFavorite);
          postElement.appendChild(favorite);

          content.appendChild(postElement);
          searchIsFind = true;
        }
      });

      if (!searchIsFind) {
        const postElement = document.createElement("div");
        postElement.className = "post";

        const img = document.createElement("img");
        img.src = "images/recherche_introuvable.png";
        postElement.appendChild(img);

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
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function filterFavoris() {
  fetch("data_instagram/your_instagram_activity/content/posts_1.json")
    .then((response) => response.json())
    .then((data) => {
      const content = document.getElementById("content");
      content.innerHTML = "";

      data.forEach((post) => {
        if (post.isFavorite) {
          const media = post.media[0];
          if (media.title.length > 308) {
            const postElement = document.createElement("div");
            postElement.className = "post";

            const img = document.createElement("img");
            img.src = "data_instagram/" + media.uri;
            postElement.appendChild(img);

            let mediaTitleSplit = media.title.split("#")[0];
            const title = document.createElement("div");
            title.className = "title";
            title.textContent = decodeUTF8(mediaTitleSplit);
            postElement.appendChild(title);

            const favorite = createFavoriteIcon(post.id, post.isFavorite);
            postElement.appendChild(favorite);

            content.appendChild(postElement);
          }
        }
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
