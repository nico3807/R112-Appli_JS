// Branche les ateliers de la page (<div data-exo="3"></div>) sur la session
// de l'étudiant·e et le certificat PDF (js/parcours.js, même principe que les
// dépôts CCJS et bases_de_js). L'identification est demandée à la première
// vérification, puis gardée d'une page à l'autre tant que l'onglet est ouvert.
//   - barre de session : #etudiant-nom, #ouvrir-certificat, #changer-etudiant
//   - compteur du TP   : #progress-tp (sur la page d'un TP, data-tp sur <main>)
//   - accueil          : #progression-tp (avancement par TP)

(function () {
  if (typeof EXERCICES === 'undefined') return;
  var main = document.querySelector('main');
  var tp = main && main.getAttribute('data-tp');
  var compteur = document.getElementById('progress-tp');
  var resume = document.getElementById('progression-tp');
  var ateliers = [];

  function exercice(id) {
    return EXERCICES.filter(function (e) { return e.id === id; })[0];
  }

  function mettreAJour() {
    var id = parcours.etudiant();
    if (compteur) {
      var duTp = EXERCICES.filter(function (e) { return e.tp === tp; });
      var faits = duTp.filter(function (e) { return parcours.estFait(e.id); }).length;
      compteur.textContent = id
        ? faits + ' / ' + duTp.length + ' dans ce TP · ' + parcours.nbFaits() + ' / ' + EXERCICES.length + ' au total'
        : '';
    }
    if (resume) {
      resume.innerHTML = TP.map(function (p) {
        var exos = EXERCICES.filter(function (e) { return e.tp === p.id; });
        var faits = exos.filter(function (e) { return parcours.estFait(e.id); }).length;
        var fini = id && faits === exos.length;
        return '<li><a href="' + p.page + '">' + p.libelle + '</a><span class="' + (fini ? 'fini' : '') + '">' +
          (id ? (fini ? '✔ ' : '') + faits + ' / ' + exos.length : exos.length + ' exercices') + '</span></li>';
      }).join('');
    }
  }

  var parcours = Parcours({
    prefixe: 'r112-appli:',
    titre: 'R1.12 - Appli JS',
    fichier: 'r112_appli_js',
    exercices: EXERCICES,
    cleGroupe: 'tp',
    groupes: TP,
    motsGroupe: ['TP', 'TP', 'validés'],
    memoriserOnglet: true,
    demanderAuChargement: false,
    onChangement: function () {
      ateliers.forEach(function (a) { a.synchroniser(); });
      mettreAJour();
    }
  });

  document.querySelectorAll('[data-exo]').forEach(function (el) {
    var exo = exercice(Number(el.getAttribute('data-exo')));
    if (exo) ateliers.push(Atelier.monter(el, exo, parcours, mettreAJour));
  });
  mettreAJour();
})();
