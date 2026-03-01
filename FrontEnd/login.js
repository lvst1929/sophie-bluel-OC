console.log("Chargement LOGING.JS OK")

function loginUser() {
    const connectionMode = document.querySelector("form");
    connectionMode.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("fonction loginUser appelée");
        //charge utile
        const dataLogin = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        console.log(dataLogin);
        //transformation de la charge utile au format JSON
        const convertJSON = JSON.stringify(dataLogin);
        //fetch données utilisateurs avec try et catch
        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: convertJSON

            });

            // si erreur API
            if (!response.ok) {
                throw new Error("invalid credentials");
            }

            const result = await response.json();
            console.log("Connexion réussie :", result);

            //stockage token 
            window.localStorage.setItem("token", result.token);

            // redirection vers la page d'accueil
            window.location.href = "index.html";


        } catch (error) {
            console.log("Une erreur est survenue : " + error.message)
        }

    });
}

//****APPEL FONCTION*****
loginUser();