console.log("Chargement SCRIPT.JS OK");

// *****************************WORKS (PROJETS)*******************************************
// stocke l'appel des éléments de l'API (évite de refaire un fetch)
let works = []
window.works = works;

//fonction qui récupère les projets de l'API
async function getWorks() { //créer la variable + async demande d'attendre la réponse de l'API 
  try {
    const response = await fetch("http://localhost:5678/api/works"); // attend la réponse serveur
    const data = await response.json(); // attend les données au format json (on récupère un tableau)
    works = data; // pour réafficher les projets dans la modale (utilisation de la variable works)
    window.works = works; // màj de la variable globale
    console.log("projets récupérés", works);
    return data
  } catch (error) {
    console.error("erreur fetch", error);
  }
}

// fonction qui affiche la liste de projets (+indentation HTML)
function displayWorks(data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; //je vide la gallery avant chaque affichage j'évite des doublons 
  console.log("affichage projets", data);
  data.forEach(work => { //mon appel renvoie un tableau je dois créer les balises pour CHAQUE éléments
    const figure = document.createElement("figure");
    console.log(figure)
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl
    img.alt = work.title
    figcaption.textContent = work.title

    figure.appendChild(img); //indentation HTML, gallery > figure > img + figcaption
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}


// **************************************CATEGORIES (BOUTONS)*********************************************
//fonction qui récupère les categories de l'API
async function getCategories() {
  console.log("filtersOK");
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    return data
  } catch (error) {
    console.error("erreur fetch", error);
  }
}

//fonction stylise les boutons sélectionnés 
function setSelectedButton(clickedButton) {
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("selected"));
  clickedButton.classList.add("selected");
}

// ************************************FILTRES
//fonction qui filtre et affiche les projets 
function filterWorks(categoryId) {
  console.log("ID categorie choisie", categoryId);
  const filteredWorks = works.filter(work => {
    console.log("Projet", work.title, "categoryID du projet", work.categoryId);
    return work.categoryId === categoryId;
  });
  console.log("projets filtrés", filteredWorks);
  displayWorks(filteredWorks);
}

//fonction qui créer les boutons + ecouteur 'click'
async function displayCategories() {
  const data = await getCategories()
  const filters = document.querySelector(".filters");
  const allCategoriesButton = document.createElement("button"); //création du bouton tous 
  allCategoriesButton.textContent = "Tous";
  allCategoriesButton.classList.add("selected");
  allCategoriesButton.addEventListener("click", () => {
    displayWorks(works);
    setSelectedButton(allCategoriesButton);//au click, ajotuer la class selected
    console.log("allCategoriesButton cliqué");
  });
  filters.appendChild(allCategoriesButton);
  data.forEach(category => {
    const apiButton = document.createElement("button");
    console.log(apiButton);
    apiButton.textContent = category.name
    apiButton.addEventListener("click", () => {
      filterWorks(category.id);
      setSelectedButton(apiButton);
      console.log("apiButton cliqué");
    });
    filters.appendChild(apiButton);
  });
}

function displayModalWorks(data) {
  const modalGallery = document.querySelector(".modal-works-gallery");
  if (!modalGallery) return;

  modalGallery.innerHTML = "";

  data.forEach(work => {
    const figure = document.createElement("figure");
    figure.classList.add("modal-work");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const btn = document.createElement("button");
    btn.classList.add("trash-button");
    btn.type = "button";
    btn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    figure.append(img, btn);
    modalGallery.appendChild(figure);
  });
}

//****************************INIT**********************************************
// éviter de faire un nouveau fetch à chaque fois 
async function initWorks() {
  await getWorks();
  displayWorks(window.works);
  await displayCategories();
}

initWorks();


