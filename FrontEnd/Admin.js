console.log("Chargement ADMIN.JS OK");

// fonction qui vérifie si token détecté 
function initAdmin() {
    const token = localStorage.getItem("token");
    console.log("token récupéré dans le localstorage", token);
    const login = document.getElementById("login");

    if (!login) return;

    if (token) {
        console.log("Utilisateur connecté sur la page Admin");
        userAdminConnected();
    } else {
        console.log("Utilisateur déconnecté");
        userAdminDisconnected();
    }
}

// fonction qui permet d'initialiser toutes les fonctionnalités de l'interface admin
// gestion de la déconnexion en cliquant sur logout
function userAdminConnected() {
    console.log("fonction userAdminConnected appelée");

    const login = document.getElementById("login");
    if (!login) return;

    login.textContent = "logout";
    login.setAttribute("href", "#");

    login.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        console.log("token supprimé dans le localstorage");
        window.location.reload();
    });

    hidingFilters();
    editBanner();
    openModalEvent();
    closeModalEvent();
    openModalAddPhotoView();
    returnToGalleryView();
    previewImage();
    initAddWorkFormValidation();
    submitAddWorkForm();
}

// remet l'interface en mode public
function userAdminDisconnected() {
    const login = document.getElementById("login");
    if (!login) return;

    login.textContent = "login";
    login.setAttribute("href", "login.html");
}

// édition mode
function editBanner() {
    const BannerEdit = document.getElementById("edit");
    if (!BannerEdit) return;

    BannerEdit.classList.remove("hidden");
    document.body.classList.add("adminconnected");
}

function hidingFilters() {
    const filters = document.querySelector(".filters");
    if (!filters) return;

    console.log("éléments filtres récupérés dans le DOM");
    filters.classList.add("hidden");
    console.log("filtres cachés");
}

//ouverture de la modale 
function openModalEvent() {
    const editLogo = document.getElementById("portfolio-edit-icon");
    const modal = document.getElementById("edit-modal");
    const galleryView = document.querySelector(".modal-gallery-view");
    const addView = document.querySelector(".modal-add-view");

    if (!editLogo || !modal || !galleryView || !addView) return;

    editLogo.classList.remove("hidden");
    modal.classList.add("hidden");

    editLogo.addEventListener("click", () => {
        modal.classList.remove("hidden");

        galleryView.classList.remove("hidden");
        addView.classList.add("hidden");

        const deleteMessage = document.getElementById("delete-message");
        if (deleteMessage) {
            deleteMessage.textContent = "";
            deleteMessage.classList.add("hidden");
            deleteMessage.classList.remove("success", "error");
        }

        displayModalWorks(works);
    });
}

//fermeture de la modale closing-cross + overlay
function closeModalEvent() {
    const modal = document.getElementById("edit-modal");
    if (!modal) return;

    const closeButtons = modal.querySelectorAll(".modal-closing-cross");

    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });
}

//affichage des projets dans la modale + création bouton suppression et écouteurs pour suppression 
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

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("trash-button");
        deleteBtn.type = "button";
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        deleteBtn.addEventListener("click", () => {
            deleteWork(work.id);
        });

        figure.append(img, deleteBtn);
        modalGallery.appendChild(figure);
    });
}

//suppression des projets
async function deleteWork(id) {
    const message = document.getElementById("delete-message");

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const updatedWorks = await getWorks();

        displayWorks(updatedWorks);
        displayModalWorks(updatedWorks);

        if (message) {
            message.textContent = "Projet supprimé avec succès";
            message.classList.remove("hidden", "error");
            message.classList.add("success");
        }

    } catch (error) {
        console.error("Erreur suppression projet :", error);

        if (message) {
            message.textContent = "Impossible de supprimer le projet";
            message.classList.remove("hidden", "success");
            message.classList.add("error");
        }
    }
}

// Gère l'ouverture de la vue d'ajout de photo 
//cache la galerie et affiche le formulaire d'ajout au clic sur "Ajouter une photo"
function openModalAddPhotoView() {
    const addButton = document.querySelector(".modal-adding-button");
    const galleryView = document.querySelector(".modal-gallery-view");
    const addView = document.querySelector(".modal-add-view");

    if (!addButton || !galleryView || !addView) return;

    addButton.addEventListener("click", async () => {
        galleryView.classList.add("hidden");
        addView.classList.remove("hidden");

        const formMessage = document.getElementById("form-message");
        if (formMessage) {
            formMessage.textContent = "";
            formMessage.classList.add("hidden");
            formMessage.classList.remove("success", "error");
        }
        await selectCategory();
    });
}

// Gère le retour vers la vue galerie depuis la vue d'ajout de photo
// au clic sur la flèche de retour
function returnToGalleryView() {
    const returnButton = document.querySelector(".modal-return");
    const galleryView = document.querySelector(".modal-gallery-view");
    const addView = document.querySelector(".modal-add-view");

    if (!returnButton || !galleryView || !addView) return;

    returnButton.addEventListener("click", () => {
        addView.classList.add("hidden");
        galleryView.classList.remove("hidden");
    });
}

// Récupère les catégories depuis l'API et peuple le select du formulaire
// option vide par défaut suivie de chaque catégorie
async function selectCategory() {
    const select = document.getElementById("category");
    if (!select) return;

    const categoriesSelection = await getCategories();
    console.log("categories OK", categoriesSelection);

    select.innerHTML = ""; //évite les doublons

    const defaultOption = document.createElement("option");
    defaultOption.value = ""; //option vide par défaut dans la liste de choix
    defaultOption.textContent = "";
    select.appendChild(defaultOption);

    categoriesSelection.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

//// Gère la prévisualisation de l'image sélectionnée dans le formulaire :
// récupère le premier fichier sélectionné, crée une URL temporaire locale,
// affiche l'aperçu et cache l'icône, le label et le texte d'upload
function previewImage() {
    const imageInput = document.getElementById("image");
    const preview = document.getElementById("image-preview");
    const uploadIcon = document.getElementById("upload-icon");
    const uploadLabel = document.getElementById("upload-label");
    const uploadText = document.getElementById("upload-text");

    if (!imageInput || !preview || !uploadIcon || !uploadLabel || !uploadText) return;

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];//récup le premier fichier sélectionné

        if (!file) return;

        const imageUrl = URL.createObjectURL(file); //créer une URL locale pour la preview avant ajout

        preview.src = imageUrl;
        preview.classList.remove("hidden");

        uploadIcon.classList.add("hidden");
        uploadLabel.classList.add("hidden");
        uploadText.classList.add("hidden");
    });
}

//vérifie le remplissage complet du formulaire et active ou désactive le bouton validation
function checkAddWorkForm() {
    const imageInput = document.getElementById("image");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const submitButton = document.querySelector(".modal-submit-button");

    if (!imageInput || !titleInput || !categorySelect || !submitButton) return; //si élément n'existe pas, pas d'exécution

    //création variable booléen
    const isCompleted =
        imageInput.files.length > 0 && //image sélectionnée + && toutes les conditions doivent être vraies
        titleInput.value.trim() !== "" &&
        categorySelect.value !== "";

    //active ou désactive le bouton
    submitButton.disabled = !isCompleted;
    submitButton.classList.toggle("enabled", isCompleted);//ajout ou suppr de la class css verte

}

// Branche les écouteurs d'événements sur les champs du formulaire
// pour déclencher la vérification à chaque modification
function initAddWorkFormValidation() {
    const imageInput = document.getElementById("image");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");

    if (!imageInput || !titleInput || !categorySelect) return;
    imageInput.addEventListener("change", checkAddWorkForm);
    titleInput.addEventListener("input", checkAddWorkForm);
    categorySelect.addEventListener("change", checkAddWorkForm);
}

//branche le submit du formulaire
function submitAddWorkForm() {

    const form = document.querySelector(".modal-add-form");
    if (!form) return;

    form.addEventListener("submit", addWork);
}

//ajout d'un projet en soumettant le formulaire complet + gestion message erreur ou succès 
async function addWork(event) {
    event.preventDefault();

    const imageInput = document.getElementById("image");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const message = document.getElementById("form-message");

    if (!imageInput || !titleInput || !categorySelect || !message) return;
    if (!imageInput.files[0]) return;

    message.textContent = "";
    message.classList.remove("success", "error", "hidden");

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", titleInput.value.trim());
    formData.append("category", categorySelect.value);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du projet");
        }

        const updatedWorks = await getWorks();

        displayWorks(updatedWorks);
        displayModalWorks(updatedWorks);

        event.target.reset();

        resetAddWorkFormView();
        checkAddWorkForm();


        message.textContent = "Projet ajouté avec succès";
        message.classList.remove("hidden", "error");
        message.classList.add("success");

        setTimeout(() => {
            message.textContent = "";
            message.classList.add("hidden");
            message.classList.remove("success");

            //fermeture de la modale à l'ajout du projet après un petit délai pour voir le msg de succès
            const modal = document.getElementById("edit-modal");
            modal.classList.add("hidden");
        }, 2000);

    } catch (error) {
        console.error("Erreur ajout projet :", error);

        message.textContent = "Erreur lors de l'ajout du projet";
        message.classList.remove("hidden", "success");
        message.classList.add("error");
    }
}

// Réinitialise la vue du formulaire après envoi :
// cache l'aperçu image et réaffiche l'icône, le label et le texte d'upload
function resetAddWorkFormView() {
    const preview = document.getElementById("image-preview");
    const uploadIcon = document.getElementById("upload-icon");
    const uploadLabel = document.getElementById("upload-label");
    const uploadText = document.getElementById("upload-text");
    const message = document.getElementById("form-message");

    if (preview) {
        preview.src = "";
        preview.classList.add("hidden");
    }

    if (uploadIcon) uploadIcon.classList.remove("hidden");
    if (uploadLabel) uploadLabel.classList.remove("hidden");
    if (uploadText) uploadText.classList.remove("hidden");

}



initAdmin();