var coeff = [];
var nb_notes = 0;
var nb_eleves = 0;

function ajouter_champ(ligne, index){
    /* Fonction pour ajouter un champ a une ligne specifique avec son index */
    var cellule = ligne.insertCell(index);
    var texte = document.createElement("input");
    texte.type = "number";
    texte.size = "16";
    texte.min = "0";
    cellule.appendChild(texte);
}

function ajouter_bouton(ligne, index, onclick){
    var cellule = ligne.insertCell(index);
    cellule.style.borderStyle = "none";
    cellule.style.background = "whitesmoke";

    var bouton = document.createElement("button");
    bouton.onclick = onclick;
    bouton.innerHTML = "X";

    cellule.appendChild(bouton);
}

function ajouter_eleve(){
    /* On cree le nombre de cellule necessaire pour la ligne du tableau */
    var zone_eleve =  document.getElementById("tbody");
    var ligne = tbody.insertRow(nb_eleves);

    
    /* On accede au nom et prénom rentrée dans les inputs */
    var prenom = document.getElementById("Prenom").value;
    var nom = document.getElementById("Nom").value;

    /* On les insere dans les cellules (et celle de la moyenne) et on les mets dans les cellules*/
    var cellule_nom = ligne.insertCell(0);
    var cellule_prenom = ligne.insertCell(1);
    var moyenne = ligne.insertCell(2);
    cellule_prenom.innerHTML = prenom;
    cellule_nom.innerHTML = nom;

    /* Créer nb_notes cellules grâce à ajouter_champ */

    for (var i = 0; i < nb_notes; i++) {
        ajouter_champ(ligne, 3 + i);
    }

    /* On crée le boutton permettant de supprimer la ligne de l'élève */
    var onclick = function() { supprimer_eleve(this); };
    ajouter_bouton(ligne, -1 , onclick) ;

    nb_eleves = nb_eleves + 1;

    /* Actualise les valeurs des moyennes */
    actualiser();
}

function supprimer_eleve(bouton){
    /* On supprime la ligne ou le bouton est present */
    tbody.deleteRow(bouton.parentNode.parentNode.rowIndex - 1);

    nb_eleves = nb_eleves - 1;

    /* Actualise les valeurs des moyennes */
    actualiser();
}

function ajouter_note(){
    /* Rajoute une la tete de la ligne de la note */
    var entete = document.getElementById("entete");
    var cellule = entete.insertCell(3 + nb_notes);

    /* Et indique le nom de la matiere et son coefficient */
    cellule.innerHTML = document.getElementById("Nom_note").value + " (" + document.getElementById("Coefficient").value + ")" ;
    
	/* Ajoute les cellules permettant de rentrer les notes */
    var tbody = document.getElementById("tbody");
	var ligne_moyenne = document.getElementById("ligne_moyenne");
	
	var cellule_moyenne = document.createElement("td");
    ligne_moyenne.appendChild(cellule_moyenne);
	
	
    /* Boucle pour créer des cellules en fonction de nb_notes */
    for (var i = 0; i < nb_eleves; i++) {
        var ligne = tbody.rows[i];
        /* Utilisation de ajouter_champ afin que l'user rentre ses moyennes */
        ajouter_champ(ligne, 3 + nb_notes);
    }
	
    /* Ajoute le bouton en dessous de la colonne note */
	var ligne_supprimer = document.getElementById("ligne_supprimer");
	var onclick = function() { supprimer_note(this); };
    ajouter_bouton(ligne_supprimer, -1 , onclick) ;

    /* Ajoute le coeff dans la liste coeff */
    coeff.push(document.getElementById("Coefficient").value);

    nb_notes = nb_notes + 1;

    /* Actualise les valeurs des moyennes */
    actualiser();
}

function supprimer_note(bouton) {
    /* On récupére l'index du bouton supprimer */
    cellule_bouton = bouton.parentNode;
    index_cellule_bouton = cellule_bouton.cellIndex;

    var tbody = document.getElementById("tbody");

    /* Supprime les cellules des eleves situe au dessus du bouton */
    for (i = 0; i < nb_eleves; i++) {
        var ligne_eleve = tbody.children[i];
        ligne_eleve.deleteCell(parseInt(index_cellule_bouton));
    }

    /* Supprimer l'entête au dessus du bouton */
    var entete = document.getElementById("entete");
    entete.deleteCell(index_cellule_bouton);
    
    /* Supprime la cellule de la moyenne */
    var ligne_moyenne = document.getElementById("ligne_moyenne");
    ligne_moyenne.deleteCell(index_cellule_bouton);

    /* Supprime le bouton supprimer */
    var ligne_supprimer = document.getElementById("ligne_supprimer");
    ligne_supprimer.deleteCell(index_cellule_bouton);

    /* Supprime le coeff de la note */
    coeff.splice(index_cellule_bouton - 3, 1);

    nb_notes = nb_notes - 1;

    /* Actualise les valeurs des moyennes */
    actualiser();
}

function actualiser(){
    /* Calcule toutes les moyennes possibles */
    
    var tbody = document.getElementById("tbody");
    
    /* Calcule les moyenne des eleves */
    for (i = 0; i < nb_eleves; i++){
        moyenne_eleve(i);
    }
        
    /* Puis calcule la moyenne de la classe */
    moyenne_classe();
    
    /* Calcule les moyennes de chaque matiere */
    for (f = 0; f < nb_notes; f++){
        moyenne_matiere(parseInt(f + 3));
    }
}

function calculer_somme(ligne){
    /* Calcule la somme de toute la ligne */

    var somme = 0;
    for (i = 0; i < ligne.children.length; i++){
        var cellule = ligne.children[i];
        var valeur_cellule = cellule.innerHTML;
        if (isNaN(valeur_cellule) == false){
            somme = somme + valeur_cellule;
        }
    }

    return somme;
}

function moyenne_eleve(i){
    /* Calcule la moyenne d'un eleve, i represente la place de l'eleve dans le tableau */
    var somme = 0;

    /* Cette variable compte une note ayant comme coeff 6, comme 6 note differente */
    var nombre_note = 0;

    /* On recupere la ligne du tableau ou l'eleve est situe */
    var tbody = document.getElementById("tbody");
    var ligne = tbody.children[i];

    /* Parcours dans toutes les notes de l'eleve */
    for (i = 3; i < ligne.children.length - 1; i++){
        var cellule_note = ligne.children[i].children;
        
        /* Recupere les notes et les coeff de l'eleve */
        var note = parseInt(cellule_note[0].value);
        var coefficient = parseInt(coeff[i - 3]);

        /* Calcule la note en prenant compte du coeff et le rajouter dans la somme des notes */
        var resultat = 0;
        for (g=0; g< coefficient ;g++){
            resultat = resultat + note;
            nombre_note += 1;
        }

        somme = somme + resultat;
    }

    /* Calcule la moyenne et l'arrondis au centieme */
    somme = somme / nombre_note;
    moyenne = Math.round(somme * 100) / 100;

    /* Verifie si la moyenne est bien un numero */
    if (isNaN(moyenne)){
        moyenne = 0;
    }

    /* Affiche la moyenne */
    ligne.children[2].innerHTML = moyenne;
}

function moyenne_matiere(index_note){
    /* Calcule la moyenne d'une matiere specifique */
    var somme = 0;
    var resultat = 0;

    /* Cette variable compte une note ayant comme coeff 6, comme 6 notes differentees */
    var nombre_note = 0;

    /* Retrouve le coeff correspondant a la matiere */
    coefficient = parseInt(coeff[index_note - 3]) ;

    for (i = 0; i < nb_eleves; i++) {
        /* Parcours sur toutes les lignes du tableau */
        var ligne = tbody.children[i];

        /* Retrouve la note */
        note = parseInt(ligne.children[index_note].children[0].value);

        /* Calcule la note en prenant compte du coeff et le rajouter dans la somme des notes */
        for (x=0; x < coefficient ; x++){
            resultat = resultat + note;
            nombre_note += 1;
            console.log(resultat)
        }
    }

    /* Calcule la moyenne et l'arrondis au centieme */
    moyenne = resultat / nombre_note;
    moyenne = Math.round(moyenne * 100) / 100;

    /* Verifie si la moyenne est bien un numero */
    if (isNaN(moyenne)){
        moyenne = 0;
    }

    /* Affiche la moyenne */
    var ligne_moyenne = document.getElementById("ligne_moyenne");
    ligne_moyenne.children[index_note].innerHTML = moyenne;
}

function moyenne_classe(){
    var somme = 0;
  
    /* Parcours de toutes les lignes du tableau */
    for (var i = 0; i < nb_eleves; i++) {
      var ligne = tbody.children[i];
      var moyenne = parseFloat(ligne.children[2].innerHTML);
      
      /* Ajout de la moyenne de chaque élève à la somme */
      somme += moyenne;
    }
  
    /* Calcul de la moyenne de la classe */
    var moyenne = somme / nb_eleves;
  
    /* Affichage de la moyenne de la classe et l'arrondis au centieme */
    var moyenne_classe = document.getElementById("moyenne_classe");
    moyenne_classe.innerHTML = Math.round(moyenne * 100) / 100;
}
