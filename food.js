var STORAGE_KEY = "baseDonneesMiamGo";

function afficherMessage(id, texte, type) {
  var box = document.getElementById(id);
  if (!box) return;

  box.textContent = texte;
  box.style.display = "block";
  box.style.padding = "0.6vh 1vh";
  box.style.borderRadius = "10px";
  box.style.fontWeight = "600";

  if (type === "error") {
    box.style.background = "rgba(120, 20, 20, 0.18)";
    box.style.color = "#ffdede";
    box.style.border = "1px solid rgba(255,180,180,0.35)";
  } else {
    box.style.background = "rgba(18, 95, 36, 0.18)";
    box.style.color = "#e6ffe8";
    box.style.border = "1px solid rgba(150,255,180,0.35)";
  }
}

function cacherMessage(id) {
  var box = document.getElementById(id);
  if (box) {
    box.style.display = "none";
    box.textContent = "";
  }
}

function lireComptes() {
  var texte = localStorage.getItem(STORAGE_KEY);
  if (!texte) return [];
  return JSON.parse(texte);
}

function sauvegarderComptes(liste) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(liste));
}

function verifierEmail(email) {
  if (email.indexOf("@") === -1) return false;
  if (email.indexOf(".") === -1) return false;
  return true;
}

function ouvrirInscription() {
  document.querySelector(".z1").style.display = "none";
  document.querySelector(".z2").style.display = "block";
  document.querySelector(".z3").style.display = "none";
}

function ouvrirConnexion() {
  document.querySelector(".z2").style.display = "none";
  document.querySelector(".z1").style.display = "block";
  document.querySelector(".z3").style.display = "none";
}

function chargerDonneesMiamGo() {
  fetch("food.json")
    .then(function (reponse) {
      return reponse.json();
    })
    .then(function (data) {
      var titre = document.querySelector(".z3 .decr11");
      if (titre) {
        titre.textContent = data.restaurant + " - " + data.slogan;
      }

      var texte = document.querySelector(".z3 .decr12");
      if (texte) {
        if (data.intro) {
          texte.innerHTML = data.intro;
        } else {
          var phrase = "Découvrez les catégories de MiamGo : ";
          for (var i = 0; i < data.categories.length; i++) {
            phrase = phrase + data.categories[i].name + ", ";
          }
          texte.textContent = phrase;
        }
      }
    })
    .catch(function () {
      console.log("Impossible de charger food.json");
    });
}

var boutonInscription = document.getElementById("goToSignup");
if (boutonInscription) {
  boutonInscription.addEventListener("click", ouvrirInscription);
}

var boutonConnexion = document.getElementById("goToLogin");
if (boutonConnexion) {
  boutonConnexion.addEventListener("click", ouvrirConnexion);
}

var boutonProfil = document.getElementById("profileBtn");
if (boutonProfil) {
  boutonProfil.addEventListener("click", ouvrirConnexion);
}

var formulaireInscription = document.getElementById("formInscription");
if (formulaireInscription) {
  formulaireInscription.addEventListener("submit", function (e) {
    e.preventDefault();
    cacherMessage("msgInscription");

    var prenom = document.getElementById("insPrenom").value.trim();
    var nom = document.getElementById("insNom").value.trim();
    var email = document.getElementById("insEmail").value.trim().toLowerCase();
    var telephone = document.getElementById("insPhone").value.trim();
    var motDePasse = document.getElementById("insPassword").value;

    if (
      prenom === "" ||
      nom === "" ||
      email === "" ||
      telephone === "" ||
      motDePasse === ""
    ) {
      afficherMessage("msgInscription", "Remplissez tous les champs.", "error");
      return;
    }

    if (verifierEmail(email) === false) {
      afficherMessage(
        "msgInscription",
        "L’e-mail doit contenir @ et un point.",
        "error",
      );
      return;
    }

    var comptes = lireComptes();
    var existe = false;

    for (var i = 0; i < comptes.length; i++) {
      if (comptes[i].email === email) {
        existe = true;
      }
    }

    if (existe === true) {
      afficherMessage("msgInscription", "Cet e-mail existe déjà.", "error");
      return;
    }

    comptes.push({
      prenom: prenom,
      nom: nom,
      email: email,
      telephone: telephone,
      mdp: motDePasse,
    });

    sauvegarderComptes(comptes);
    afficherMessage(
      "msgInscription",
      "Compte créé. Vous pouvez vous connecter.",
      "success",
    );
    this.reset();
  });
}

var formulaireConnexion = document.getElementById("formConnexion");
if (formulaireConnexion) {
  formulaireConnexion.addEventListener("submit", function (e) {
    e.preventDefault();
    cacherMessage("msgConnexion");

    var email = document
      .getElementById("loginEmail")
      .value.trim()
      .toLowerCase();
    var motDePasse = document.getElementById("loginPassword").value;

    if (email === "" || motDePasse === "") {
      afficherMessage(
        "msgConnexion",
        "Écrivez votre e-mail et votre mot de passe.",
        "error",
      );
      return;
    }

    var comptes = lireComptes();
    var compte = null;

    for (var i = 0; i < comptes.length; i++) {
      if (comptes[i].email === email) {
        compte = comptes[i];
      }
    }

    if (compte === null) {
      afficherMessage("msgConnexion", "Aucun compte trouvé.", "error");
      return;
    }

    if (compte.mdp !== motDePasse) {
      afficherMessage("msgConnexion", "Le mot de passe est faux.", "error");
      return;
    }

    afficherMessage(
      "msgConnexion",
      "Connexion réussie. Redirection…",
      "success",
    );

    setTimeout(function () {
      document.querySelector(".z1").style.display = "none";
      document.querySelector(".z2").style.display = "none";
      document.querySelector(".z3").style.display = "block";

      var nomBienvenue = compte.prenom || email.split("@")[0];
      var nomNav = document.getElementById("welcomeName");
      if (nomNav) {
        nomNav.textContent = "Bonjour, " + nomBienvenue;
        nomNav.style.display = "block";
      }

      var infoProfil = document.getElementById("profileInfo");
      if (infoProfil) {
        infoProfil.innerHTML =
          "Prénom : " + compte.prenom + "<br>" +
          "Nom : " + compte.nom + "<br>" +
          "Email : " + compte.email + "<br>" +
          "Téléphone : " + compte.telephone;
        infoProfil.style.display = "none";
      }

      chargerDonneesMiamGo();
    }, 1500);
  });
}

chargerDonneesMiamGo();
