# R112-Appli_JS — Changeur de thème et Canvas

TP de R1.12 Développement Web (BUT MMI 1, IUT de Béziers) : un **changeur de
thème** (manipulation du DOM, événements) puis un **dessin animé sur canvas**
(cercles concentriques, animation, effet d'écho). Même esprit et même charte
que le dépôt *bases_de_js* (parties Algorithmique et TD) : explications
pas à pas, pièges signalés, quiz, exécution pas à pas, exercices vérifiés
automatiquement et certificat PDF.

Aucun serveur n'est nécessaire : un double-clic sur `index.html` suffit
(Live Server ou GitHub Pages fonctionnent aussi).

## Structure

```
r112-appli_js/
├── index.html        Accueil : les 3 TP, objectifs, progression et certificat
├── theme.html        TP 1 · Changeur de thème (sélectionner, écouter, modifier)
├── canvas.html       TP 2 · Canvas : dessin (repère, arc, stroke/fill, boucle)
├── animation.html    TP 3 · Canvas : animation (requestAnimationFrame, rebond, écho)
├── memo.html         Aide-mémoire DOM, événements, Canvas, erreurs fréquentes
├── css/style.css     Charte de bases_de_js + styles des ateliers
├── img/              Logos IUT de Béziers et MMI de l'en-tête
└── js/
    ├── main.js            Menu actif, quiz, bouton indice
    ├── trace.js           Exécution pas à pas (boucle des cercles, rebond)
    ├── atelier.js         Ateliers DOM / Canvas : aperçu et vérification
    ├── exercices-data.js  Les 10 exercices, avec leurs tests
    ├── exercices.js       Branche les ateliers sur la session et le certificat
    ├── parcours.js        Identification, mesure de la saisie, certificat (copie de bases_de_js)
    ├── seance.js          Validation en séance : questions chronométrées (copie de bases_de_js)
    ├── certificat.js      PDF du certificat (jsPDF, même mise en page que CCJS)
    ├── certificat-logos.js Logos UM et MMI en base64
    ├── pages/             Déroulés des exécutions pas à pas
    └── vendor/            jsPDF (licence MIT)
```

## Comment fonctionnent les exercices

Chaque exercice a une **scène** : une vraie petite page (le bouton
`#toggle-theme-btn` du TP 1, ou le `<canvas id="monCanvas">` des TP 2 et 3).

- **▶ Exécuter** lance le code de l'étudiant·e dans cette scène (iframe) :
  on voit le résultat et on peut cliquer dedans.
- **✔ Vérifier** relance le code dans une scène instrumentée : clics simulés,
  appels de dessin du canvas enregistrés (`arc`, `stroke`, `fill`,
  `clearRect` avec couleur, épaisseur, opacité), images de l'animation jouées
  une par une. Chaque exercice décrit ses tests dans `js/exercices-data.js`
  (fonction `verifier(t)`). Certains exercices sont relancés avec d'autres
  valeurs de départ pour éviter les réponses « en dur ».

Pour modifier ou ajouter un exercice, il suffit d'éditer
`js/exercices-data.js` (le format est décrit en tête du fichier).

## Validation par certificat PDF

Comme dans *bases_de_js* et le dépôt CCJS : l'étudiant·e s'identifie (prénom
et nom) à la première vérification ; sa progression, son code et
l'historique de ses vérifications sont enregistrés à son nom sur le poste
(`localStorage`, clés `r112-appli:…`), et restent actifs d'une page à l'autre
tant que l'onglet est ouvert. Le bouton « 📜 Certificat PDF » produit une
attestation « NON TERMINÉ » ou, une fois les 10 exercices réussis, un
certificat de réussite.

Les solutions ne sont pas affichées aux étudiant·es : seul un indice est
proposé pour chaque exercice. Les solutions de référence (champ `solution`
de `js/exercices-data.js`) servent aux tests ; il n'y a plus de dossier de
corrigés séparé.

## Indices de démarche et validation en séance

Pour repérer un usage systématique de l'IA, le certificat contient des
**indices** (pas une preuve) : pour chaque exercice, la part du code tapée au
clavier ou collée depuis l'extérieur de la page (un copier-coller interne à la
page ne compte pas), le temps, le nombre d'essais et les sorties de la page.
Un exercice est « écrit au clavier » si moins de 20 % du code ajouté a été
collé ; le seuil attendu est de 80 % des exercices écrits au clavier.

En fin de parcours, la **validation en séance** pose, en présentiel, une
question chronométrée (60 s) par exercice réussi (questions rédigées dans
`js/exercices-data.js`, champ `seance`). L'enseignant·e choisit et affiche un
code de séance ; la page ne le vérifie pas (il serait lisible dans le site
public) mais l'inscrit dans le certificat avec la date et l'heure. Une seule
tentative ; quitter la page fait échouer la question en cours.
