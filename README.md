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
└── js/
    ├── main.js            Menu actif, quiz, boutons indice / solution
    ├── trace.js           Exécution pas à pas (boucle des cercles, rebond)
    ├── atelier.js         Ateliers DOM / Canvas : aperçu et vérification
    ├── exercices-data.js  Les 10 exercices, avec leurs tests
    ├── exercices.js       Branche les ateliers sur la session et le certificat
    ├── parcours.js        Identification prénom + nom, certificat (copie de bases_de_js)
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
certificat de réussite. Les solutions consultées y sont indiquées.

Les solutions sont dans les pages (bouton « Voir une solution », tracé dans
le certificat) : il n'y a plus de dossier de corrigés séparé. Le dépôt étant
public, un tel dossier restait de toute façon accessible aux étudiant·es.
