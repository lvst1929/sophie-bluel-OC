console.log("Chargement ADMIN.JS OK")

//Structurer mon JS avec des fonctions sinon pas maintenable 

function initAdmin() {
    const token = localStorage.getItem("token");
    console.log("token récupéré dans le localstorage", token);
    const login = document.getElementById("login");

    if (!login) return;
    if (token) {
        console.log("Utilisateur connecté sur la page Admin");
        userAdminConnected();

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
    openModalEvent();
    closeModalEvent();
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

}

function hidingFilters() {
    //Cacher les filtres
    const filters = document.querySelector(".filters");
    console.log("éléments filtres récupérés dans le DOM");
    filters.classList.add("hidden");
    console.log("filtres cachés");
};

function openModalEvent() {
    //affichage de la modale
    const editLogo = document.getElementById("edit-bar-logo");
    const modal = document.getElementById("edit-modal");
    if (!editLogo || !modal)
        return;
    modal.classList.add("hidden");
    editLogo.addEventListener("click", () => {
        modal.classList.remove("hidden");

        // Remplir la modale avec les projets récupérés
        if (window.displayModalWorks && window.works) {
            window.displayModalWorks(window.works);
        }
    });
}


function closeModalEvent() {
    const modal = document.getElementById("edit-modal");
    if (!modal) return;

    const closeButton = modal.querySelector(".modal-closing-cross")

    //fermeture avec la croix  
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            modal.classList.add("hidden");
        });

        //fermeture overlay
        // comment target ?
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.add("hidden");
            }

        })


    }
};

// appel fonction initAdmin
initAdmin();