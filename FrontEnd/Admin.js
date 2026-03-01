console.log("Chargement ADMIN.JS OK")


//ajout de la variable ici sinon je dois la déclarer dans userAdminConnected et dans userAdminDisconnected


//Structurer mon JS avec des fonctions sinon pas maintenable 


document.addEventListener("DOMContentLoaded", init);

function init() {
    const token = localStorage.getItem("token");
    console.log("token récupéré dans le localstorage", token);
    if (token) {
        console.log("Utilisateur connecté sur la page Admin");
        userAdminConnected();
        displayWorksInModal();
    } else {
        console.log("Utilisateur déconnecté")
        userAdminDisconnected();

    }

}



function userAdminConnected() {
    console.log("fonction userAdminConnected appelée")
    //logout
    const login = document.getElementById("login");
    console.log("login récupéré", login);
    login.textContent = "logout";
    login.addEventListener("click", () => {
        localStorage.removeItem("token");
        console.log("token supprimé dans le localstorage");
        window.location.reload();
        console.log("rechargement de la page OK");
    });

    hidingFilters();

    editBanner();

}



//rendre la déconnexion possible en cliquant sur logout
function userAdminDisconnected() {
    const login = document.getElementById("login");
    console.log("login récupéré", login);
    login.textContent = "login";
    login.addEventListener("click", () => {
        console.log("renvoi vers la page login.html effectué");
        window.location.href = "login.html";
    })

}



//édition mode
function editBanner() {
    const BannerEdit = document.getElementById("edit");
    BannerEdit.classList.remove("hidden");
    //margin au body 
    document.body.classList.add("adminconnected");

    // const logo cliquable BOUTON MODIFIER AU NIVEAU DES PROJETS
    // //const editlink = document.getElementById("edit-link");
    // editlink.addEventListener("click", () => {
    //     console.log("Click sur le Mode édition");

    //     openModal();
    //     //})

}

function hidingFilters() {
    //Cacher les filtres
    const filters = document.querySelector(".filters");
    console.log("éléments filtres récupérés dans le DOM");
    filters.classList.add("hidden");
    console.log("filtres cachés");
};

function openModal() {
    //affichage de la modale
    const editModal = document.getElementById("edit-modal");
    editModal.classList.remove("hidden");

    //const closingCross = editModal.querySelector(".modal-closing-cross");

}

function displayWorksInModal() {
    const gallery = document.querySelector(".modal-works-gallery");
    gallery.innerHTML = ""; //je vide la gallery avant chaque affichage j'évite des doublons 
    console.log("affichage projets modale", works);
    works.forEach(work => { //mon appel renvoie un tableau je dois créer les balises pour CHAQUE éléments
        const figure = document.createElement("figure");
        console.log(figure)
        const img = document.createElement("img");
        const button = document.createElement("button");
        const icone = document.createElement("i");

        img.src = work.imageUrl
        img.alt = work.title
        button.classList.add("trash-button")
        icone.classList.add("fa-solid", "fa-trash-can")


        figure.appendChild(img); //indentation HTML, gallery > figure > img + figcaption
        figure.appendChild(button);
        button.appendChild(icone);
        gallery.appendChild(figure);
    });
}


