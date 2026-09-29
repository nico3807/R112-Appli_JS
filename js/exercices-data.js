// Exercices des trois TP, vérifiés automatiquement (voir js/atelier.js).
// Chaque exercice :
//   id, titre, tp ('theme' | 'canvas' | 'animation'), niveau (1 à 3),
//   scene ('theme' : page avec le bouton #toggle-theme-btn ;
//          'canvas' : <canvas id="monCanvas" width="400" height="400">),
//   consigne (HTML), code (code de départ), indice (HTML), solution,
//   expose : noms de variables / fonctions du code que le test peut lire,
//   cas : relances avec d'autres valeurs de départ (facultatif),
//   verifier(t) : renvoie [{ ok, texte }] — t est décrit dans atelier.js.

var TP = [
  { id: 'theme', libelle: 'Changeur de thème', page: 'theme.html' },
  { id: 'canvas', libelle: 'Canvas : dessin', page: 'canvas.html' },
  { id: 'animation', libelle: 'Canvas : animation', page: 'animation.html' }
];

// Petits utilitaires pour écrire les tests.
function point(ok, texte) { return { ok: !!ok, texte: texte }; }
function arrondi(x) { return Math.round(x * 1000) / 1000; }
var DEUX_PI = 2 * Math.PI;

var EXERCICES = [
  // ================================================== TP 1 : changeur de thème
  {
    id: 1,
    tp: 'theme',
    titre: 'Sélectionner le bouton et le body',
    niveau: 1,
    scene: 'theme',
    consigne:
      '<p>Remplacez les deux <code>null</code> pour que <code>themeButton</code> contienne le bouton d\'id <code>toggle-theme-btn</code> (avec <code>getElementById</code>) et <code>bodyElement</code> l\'élément <code>body</code> (avec <code>querySelector</code>).</p>',
    code:
      'const themeButton = null; // Q1 : le bouton d\'id "toggle-theme-btn"\n' +
      'const bodyElement = null; // Q2 : l\'élément body\n\n' +
      'console.log("Bouton :", themeButton);\n' +
      'console.log("Texte du bouton :", themeButton && themeButton.textContent);\n',
    indice: '<p><code>document.getElementById("toggle-theme-btn")</code> : l\'id s\'écrit <strong>sans</strong> dièse. <code>document.querySelector("body")</code> : on donne un sélecteur CSS, comme dans une feuille de style.</p>',
    solution:
      'const themeButton = document.getElementById("toggle-theme-btn");\n' +
      'const bodyElement = document.querySelector("body");\n\n' +
      'console.log("Bouton :", themeButton);\n' +
      'console.log("Texte du bouton :", themeButton && themeButton.textContent);',
    expose: ['themeButton', 'bodyElement'],
    verifier: function (t) {
      var bouton = t.doc.getElementById('toggle-theme-btn');
      return [
        point(t.expose.themeButton === bouton, '<code>themeButton</code> contient bien le bouton <code>#toggle-theme-btn</code>'),
        point(t.expose.bodyElement === t.doc.body, '<code>bodyElement</code> contient bien l\'élément <code>body</code>')
      ];
    }
  },
  {
    id: 2,
    tp: 'theme',
    titre: 'Réagir au clic',
    niveau: 1,
    scene: 'theme',
    consigne:
      '<p>Ajoutez un écouteur d\'événement <code>"click"</code> sur <code>themeButton</code> qui affiche <code>Clic !</code> dans la console. Exécutez, puis cliquez sur le bouton de l\'aperçu : un message par clic.</p>',
    code:
      'const themeButton = document.getElementById("toggle-theme-btn");\n\n' +
      '// Q3 : au clic sur themeButton, afficher "Clic !" dans la console\n\n',
    indice: '<p><code>themeButton.addEventListener("click", function () { … });</code> : le <code>console.log</code> se place <strong>dans</strong> la fonction, sinon il s\'exécute tout de suite au lieu d\'attendre le clic.</p>',
    solution:
      'const themeButton = document.getElementById("toggle-theme-btn");\n\n' +
      'themeButton.addEventListener("click", function () {\n' +
      '  console.log("Clic !");\n' +
      '});',
    verifier: function (t) {
      var avant = t.console.filter(function (l) { return l === 'Clic !'; }).length;
      t.cliquer('#toggle-theme-btn');
      var apres1 = t.console.filter(function (l) { return l === 'Clic !'; }).length;
      t.cliquer('#toggle-theme-btn');
      var apres2 = t.console.filter(function (l) { return l === 'Clic !'; }).length;
      return [
        point(avant === 0, 'Rien n\'est affiché avant le clic (le message attend bien l\'événement)'),
        point(apres1 - avant === 1, 'Un clic affiche « Clic ! » une fois'),
        point(apres2 - apres1 === 1, 'Un deuxième clic l\'affiche une deuxième fois')
      ];
    }
  },
  {
    id: 3,
    tp: 'theme',
    titre: 'Basculer la classe dark-theme',
    niveau: 1,
    scene: 'theme',
    consigne:
      '<p>Au clic sur le bouton, basculez la classe <code>dark-theme</code> sur le <code>body</code> : un clic l\'ajoute, le suivant la retire. La feuille de style de l\'aperçu contient déjà la règle <code>body.dark-theme</code>.</p>',
    code:
      'const themeButton = document.getElementById("toggle-theme-btn");\n' +
      'const bodyElement = document.querySelector("body");\n\n' +
      'themeButton.addEventListener("click", function () {\n' +
      '  // Q4 : basculer la classe "dark-theme" sur bodyElement\n\n' +
      '});\n',
    indice: '<p><code>bodyElement.classList.toggle("dark-theme");</code> — sans le point devant le nom de classe : ce n\'est pas un sélecteur CSS.</p>',
    solution:
      'const themeButton = document.getElementById("toggle-theme-btn");\n' +
      'const bodyElement = document.querySelector("body");\n\n' +
      'themeButton.addEventListener("click", function () {\n' +
      '  bodyElement.classList.toggle("dark-theme");\n' +
      '});',
    verifier: function (t) {
      var b = t.doc.body;
      var d0 = b.classList.contains('dark-theme');
      t.cliquer('#toggle-theme-btn');
      var d1 = b.classList.contains('dark-theme');
      t.cliquer('#toggle-theme-btn');
      var d2 = b.classList.contains('dark-theme');
      return [
        point(!d0, 'Au chargement, la page est en mode clair'),
        point(d1, 'Après un clic, le body a la classe dark-theme'),
        point(!d2, 'Après un deuxième clic, la classe est retirée')
      ];
    }
  },
  {
    id: 4,
    tp: 'theme',
    titre: 'Mettre à jour le texte du bouton',
    niveau: 2,
    scene: 'theme',
    consigne:
      '<p>Complétez le changeur de thème : après la bascule, si le <code>body</code> a la classe <code>dark-theme</code>, le bouton doit afficher <code>Activer le Mode Clair</code> ; sinon <code>Activer le Mode Sombre</code>.</p>',
    code:
      'const themeButton = document.getElementById("toggle-theme-btn");\n' +
      'const bodyElement = document.querySelector("body");\n\n' +
      'themeButton.addEventListener("click", function () {\n' +
      '  bodyElement.classList.toggle("dark-theme");\n\n' +
      '  // Q5 : changer le texte du bouton selon le thème actif\n\n' +
      '});\n',
    indice: '<p><code>bodyElement.classList.contains("dark-theme")</code> vaut <code>true</code> ou <code>false</code> : c\'est la condition d\'un <code>if / else</code>. Le texte se modifie avec <code>themeButton.textContent = "…";</code></p>',
    solution:
      'const themeButton = document.getElementById("toggle-theme-btn");\n' +
      'const bodyElement = document.querySelector("body");\n\n' +
      'themeButton.addEventListener("click", function () {\n' +
      '  bodyElement.classList.toggle("dark-theme");\n\n' +
      '  if (bodyElement.classList.contains("dark-theme")) {\n' +
      '    themeButton.textContent = "Activer le Mode Clair";\n' +
      '  } else {\n' +
      '    themeButton.textContent = "Activer le Mode Sombre";\n' +
      '  }\n' +
      '});',
    verifier: function (t) {
      var btn = t.doc.getElementById('toggle-theme-btn');
      var b = t.doc.body;
      var texte0 = btn.textContent.trim();
      t.cliquer('#toggle-theme-btn');
      var ok1 = b.classList.contains('dark-theme') && btn.textContent.trim() === 'Activer le Mode Clair';
      t.cliquer('#toggle-theme-btn');
      var ok2 = !b.classList.contains('dark-theme') && btn.textContent.trim() === 'Activer le Mode Sombre';
      t.cliquer('#toggle-theme-btn');
      var ok3 = b.classList.contains('dark-theme') && btn.textContent.trim() === 'Activer le Mode Clair';
      return [
        point(texte0 === 'Activer le Mode Sombre', 'Avant le premier clic, le texte d\'origine est conservé'),
        point(ok1, '1er clic : mode sombre et bouton « Activer le Mode Clair »'),
        point(ok2, '2e clic : mode clair et bouton « Activer le Mode Sombre »'),
        point(ok3, '3e clic : de nouveau mode sombre et « Activer le Mode Clair »')
      ];
    }
  },

  // ======================================================= TP 2 : Canvas, dessin
  {
    id: 5,
    tp: 'canvas',
    titre: 'Un cercle bleu',
    niveau: 1,
    scene: 'canvas',
    consigne:
      '<p>Tracez le <strong>contour</strong> d\'un cercle de centre (200, 200) et de rayon 100, de couleur <code>#2f5fd9</code> et de 4 pixels d\'épaisseur.</p>',
    code:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      '// Q1 : cercle de centre (200, 200), rayon 100,\n' +
      '// contour #2f5fd9 de 4 px (strokeStyle, lineWidth)\n\n',
    indice: '<p>Dans l\'ordre : <code>ctx.beginPath();</code> puis <code>ctx.arc(200, 200, 100, 0, 2 * Math.PI);</code>, les réglages <code>ctx.strokeStyle</code> et <code>ctx.lineWidth</code>, et enfin <code>ctx.stroke();</code> qui trace réellement.</p>',
    solution:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      'ctx.beginPath();\n' +
      'ctx.arc(200, 200, 100, 0, 2 * Math.PI);\n' +
      'ctx.strokeStyle = "#2f5fd9";\n' +
      'ctx.lineWidth = 4;\n' +
      'ctx.stroke();',
    verifier: function (t) {
      var c = t.cercles(undefined, 'stroke').filter(function (x) { return x.x === 200 && x.y === 200 && x.r === 100; })[0];
      return [
        point(c, 'Un cercle de centre (200, 200) et de rayon 100 est tracé avec <code>stroke()</code>'),
        point(c && t.proche(c.debut, 0) && t.proche(c.fin, DEUX_PI, 1e-3), 'C\'est un cercle complet (de 0 à 2 × Math.PI)'),
        point(c && c.strokeStyle === '#2f5fd9', 'Sa couleur est #2f5fd9'),
        point(c && c.lineWidth === 4, 'Son épaisseur est de 4 pixels')
      ];
    }
  },
  {
    id: 6,
    tp: 'canvas',
    titre: 'Un disque plein',
    niveau: 1,
    scene: 'canvas',
    consigne:
      '<p>Dessinez cette fois un disque <strong>rempli</strong> (pas seulement le contour) : centre (200, 200), rayon 50, couleur <code>#b5560f</code>.</p>',
    code:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      '// Q2 : disque plein de centre (200, 200), rayon 50, couleur #b5560f\n\n',
    indice: '<p>Pour remplir, on règle <code>ctx.fillStyle</code> (et non <code>strokeStyle</code>) et on termine par <code>ctx.fill();</code> au lieu de <code>stroke()</code>.</p>',
    solution:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      'ctx.beginPath();\n' +
      'ctx.arc(200, 200, 50, 0, 2 * Math.PI);\n' +
      'ctx.fillStyle = "#b5560f";\n' +
      'ctx.fill();',
    verifier: function (t) {
      var c = t.cercles(undefined, 'fill').filter(function (x) { return x.x === 200 && x.y === 200 && x.r === 50; })[0];
      return [
        point(c, 'Un disque de centre (200, 200) et de rayon 50 est rempli avec <code>fill()</code>'),
        point(c && t.proche(c.fin - c.debut, DEUX_PI, 1e-3), 'C\'est un disque complet'),
        point(c && c.fillStyle === '#b5560f', 'Sa couleur de remplissage est #b5560f')
      ];
    }
  },
  {
    id: 7,
    tp: 'canvas',
    titre: 'Cercles concentriques à opacité progressive',
    niveau: 2,
    scene: 'canvas',
    consigne:
      '<p>Avec une boucle, tracez <code>nbCercles</code> cercles de centre (200, 200). Le premier a un rayon de <code>maxRayon</code> et une opacité de <code>1 / nbCercles</code> ; à chaque tour, le rayon <strong>diminue</strong> de <code>ecart</code> et l\'opacité <strong>augmente</strong>, jusqu\'au dernier cercle, le plus petit, <strong>opaque</strong> (opacité 1). Remettez <code>ctx.globalAlpha</code> à 1 après la boucle.</p>' +
      '<p>Votre code sera aussi testé avec un autre nombre de cercles : ne l\'écrivez pas « en dur ».</p>',
    code:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      'const nbCercles = 8;\n' +
      'const maxRayon = 180;\n' +
      'const ecart = maxRayon / nbCercles;\n\n' +
      'ctx.strokeStyle = "#2f5fd9";\n' +
      'ctx.lineWidth = 4;\n\n' +
      'for (let i = 0; i < nbCercles; i++) {\n' +
      '  // Q3 : rayon du cercle numéro i\n' +
      '  // Q4 : opacité (ctx.globalAlpha) du cercle numéro i\n' +
      '  // Q5 : tracer le cercle\n' +
      '}\n\n' +
      '// Q6 : remettre l\'opacité à 1\n',
    indice: '<p>Remplissez le tableau de la section « Raisonner avant de coder » : pour <code>i = 0</code>, rayon = <code>maxRayon</code> ; pour <code>i = 1</code>, <code>maxRayon - ecart</code>… donc <code>maxRayon - i * ecart</code>. L\'opacité vaut <code>(i + 1) / nbCercles</code> : 1/8 pour <code>i = 0</code>, 8/8 = 1 pour <code>i = 7</code>.</p>',
    solution:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      'const nbCercles = 8;\n' +
      'const maxRayon = 180;\n' +
      'const ecart = maxRayon / nbCercles;\n\n' +
      'ctx.strokeStyle = "#2f5fd9";\n' +
      'ctx.lineWidth = 4;\n\n' +
      'for (let i = 0; i < nbCercles; i++) {\n' +
      '  const rayon = maxRayon - i * ecart;\n' +
      '  ctx.globalAlpha = (i + 1) / nbCercles;\n' +
      '  ctx.beginPath();\n' +
      '  ctx.arc(200, 200, rayon, 0, 2 * Math.PI);\n' +
      '  ctx.stroke();\n' +
      '}\n\n' +
      'ctx.globalAlpha = 1;',
    cas: [{ valeurs: { nbCercles: 8 } }, { valeurs: { nbCercles: 5 } }],
    verifier: function (t) {
      var n = t.valeurs.nbCercles;
      var ecart = 180 / n;
      var cs = t.cercles(undefined, 'stroke').filter(function (c) { return c.x === 200 && c.y === 200; });
      var rayonsOk = cs.length === n && cs.every(function (c, i) { return t.proche(c.r, 180 - i * ecart, 1e-6); });
      var alphasOk = cs.length === n && cs.every(function (c, i) { return t.proche(c.alpha, (i + 1) / n, 1e-3); });
      var ctx = t.ctx();
      return [
        point(cs.length === n, n + ' cercles tracés (vous en tracez ' + cs.length + ')'),
        point(rayonsOk, 'Rayons de ' + arrondi(180) + ' à ' + arrondi(180 - (n - 1) * ecart) + ', en diminuant de ' + arrondi(ecart) + ' à chaque cercle' +
          (cs.length ? ' (obtenus : ' + cs.map(function (c) { return arrondi(c.r); }).join(', ') + ')' : '')),
        point(alphasOk, 'Opacités de ' + arrondi(1 / n) + ' à 1, le dernier cercle étant opaque' +
          (cs.length ? ' (obtenues : ' + cs.map(function (c) { return arrondi(c.alpha); }).join(', ') + ')' : '')),
        point(ctx && ctx.globalAlpha === 1, '<code>ctx.globalAlpha</code> est remis à 1 après la boucle')
      ];
    }
  },

  // ==================================================== TP 3 : Canvas, animation
  {
    id: 8,
    tp: 'animation',
    titre: 'Effacer avant de redessiner',
    niveau: 1,
    scene: 'canvas',
    consigne:
      '<p>Complétez la fonction <code>dessiner(rayon)</code> : elle doit d\'abord <strong>effacer tout le canvas</strong> (400 × 400), puis tracer le cercle de centre (200, 200) et de rayon <code>rayon</code>. Les trois appels du bas doivent alors laisser <strong>un seul</strong> cercle à l\'écran.</p>',
    code:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n' +
      'ctx.strokeStyle = "#b5560f";\n' +
      'ctx.lineWidth = 4;\n\n' +
      'function dessiner(rayon) {\n' +
      '  // Q1 : effacer tout le canvas\n\n' +
      '  // Q2 : tracer le cercle de centre (200, 200) et de rayon « rayon »\n\n' +
      '}\n\n' +
      'dessiner(60);\n' +
      'dessiner(120);\n' +
      'dessiner(170);\n',
    indice: '<p><code>ctx.clearRect(0, 0, 400, 400);</code> efface un rectangle : ici, tout le canvas (on peut aussi écrire <code>canvas.width, canvas.height</code>). Puis <code>beginPath</code>, <code>arc</code> et <code>stroke</code> avec le paramètre <code>rayon</code>.</p>',
    solution:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n' +
      'ctx.strokeStyle = "#b5560f";\n' +
      'ctx.lineWidth = 4;\n\n' +
      'function dessiner(rayon) {\n' +
      '  ctx.clearRect(0, 0, 400, 400);\n' +
      '  ctx.beginPath();\n' +
      '  ctx.arc(200, 200, rayon, 0, 2 * Math.PI);\n' +
      '  ctx.stroke();\n' +
      '}\n\n' +
      'dessiner(60);\n' +
      'dessiner(120);\n' +
      'dessiner(170);',
    expose: ['dessiner'],
    verifier: function (t) {
      if (typeof t.expose.dessiner !== 'function') return [point(false, 'La fonction <code>dessiner</code> existe')];
      t.journal.length = 0;
      t.expose.dessiner(75);
      var j = t.journal;
      var iEfface = -1, iArc = -1;
      j.forEach(function (a, i) {
        if (a.m === 'clearRect' && iEfface < 0 && a.args[0] === 0 && a.args[1] === 0 && a.args[2] >= 400 && a.args[3] >= 400) iEfface = i;
        if (a.m === 'arc' && iArc < 0) iArc = i;
      });
      var c = t.cercles(undefined, 'stroke')[0];
      return [
        point(iEfface >= 0, '<code>dessiner()</code> efface tout le canvas (clearRect de 0, 0 à 400, 400)'),
        point(iEfface >= 0 && iArc > iEfface, 'L\'effacement a lieu <strong>avant</strong> le tracé'),
        point(c && c.x === 200 && c.y === 200 && c.r === 75, '<code>dessiner(75)</code> trace un cercle de centre (200, 200) et de rayon 75')
      ];
    }
  },
  {
    id: 9,
    tp: 'animation',
    titre: 'Le rayon qui pulse',
    niveau: 2,
    scene: 'canvas',
    consigne:
      '<p>Complétez <code>animer()</code> pour que le cercle rétrécisse de 2 pixels par image jusqu\'à un rayon de 20, puis grossisse jusqu\'à 180, et ainsi de suite. À chaque image : effacer, mettre à jour le rayon (et changer de <code>sens</code> aux limites), redessiner.</p>',
    code:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      'let rayon = 180;\n' +
      'let sens = -1; // -1 : rétrécit, +1 : grossit\n\n' +
      'function dessinerCercle(r) {\n' +
      '  ctx.beginPath();\n' +
      '  ctx.arc(200, 200, r, 0, 2 * Math.PI);\n' +
      '  ctx.strokeStyle = "#b5560f";\n' +
      '  ctx.lineWidth = 4;\n' +
      '  ctx.stroke();\n' +
      '}\n\n' +
      'function animer() {\n' +
      '  // Q3 : effacer le canvas\n\n' +
      '  // Q4 : rayon += sens * 2, puis changer de sens\n' +
      '  //      si rayon <= 20 ou si rayon >= 180\n\n' +
      '  // Q5 : dessiner le cercle\n\n' +
      '  requestAnimationFrame(animer);\n' +
      '}\n\n' +
      'animer();\n',
    indice: '<p>Changer de sens, c\'est changer le signe : <code>sens = -sens;</code> (ou <code>sens *= -1</code>). La condition : <code>if (rayon &lt;= 20 || rayon &gt;= 180)</code>. Ordre des étapes : <code>clearRect</code>, calcul, <code>dessinerCercle(rayon)</code>.</p>',
    solution:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      'let rayon = 180;\n' +
      'let sens = -1; // -1 : rétrécit, +1 : grossit\n\n' +
      'function dessinerCercle(r) {\n' +
      '  ctx.beginPath();\n' +
      '  ctx.arc(200, 200, r, 0, 2 * Math.PI);\n' +
      '  ctx.strokeStyle = "#b5560f";\n' +
      '  ctx.lineWidth = 4;\n' +
      '  ctx.stroke();\n' +
      '}\n\n' +
      'function animer() {\n' +
      '  ctx.clearRect(0, 0, 400, 400);\n' +
      '  rayon += sens * 2;\n' +
      '  if (rayon <= 20 || rayon >= 180) {\n' +
      '    sens = -sens;\n' +
      '  }\n' +
      '  dessinerCercle(rayon);\n' +
      '  requestAnimationFrame(animer);\n' +
      '}\n\n' +
      'animer();',
    verifier: function (t) {
      var jouees = t.avancer(200);
      if (jouees === 0) return [point(false, 'L\'animation ne tourne pas : <code>animer()</code> doit être appelée une première fois, puis redemander l\'image suivante avec <code>requestAnimationFrame(animer)</code>')];
      var rayons = [];
      var effaceChaque = true;
      for (var f = 1; f <= jouees; f++) {
        var c = t.cercles(f, 'stroke');
        if (c.length) rayons.push(c[c.length - 1].r);
        if (!t.appels('clearRect', f).length) effaceChaque = false;
      }
      var min = Math.min.apply(null, rayons), max = Math.max.apply(null, rayons);
      var iMin = rayons.indexOf(min);
      var remonte = iMin >= 0 && rayons.slice(iMin).some(function (r) { return r > min + 20; });
      var pas = rayons.length > 1 && rayons.slice(1).every(function (r, i) { return Math.abs(r - rayons[i]) === 2; });
      return [
        point(jouees === 200, 'L\'animation tourne en continu (' + jouees + ' images jouées sur 200)'),
        point(jouees && effaceChaque, 'Le canvas est effacé à chaque image'),
        point(rayons.length === jouees && jouees > 0, 'Un cercle est redessiné à chaque image'),
        point(pas, 'Le rayon change de 2 pixels à chaque image'),
        point(rayons.length && min >= 18 && min <= 22 && max <= 182, 'Le rayon reste entre 20 et 180 (obtenu : de ' + (rayons.length ? min : '?') + ' à ' + (rayons.length ? max : '?') + ')'),
        point(remonte, 'Arrivé au minimum, le cercle grossit de nouveau')
      ];
    }
  },
  {
    id: 10,
    tp: 'animation',
    titre: 'L\'effet d\'écho',
    niveau: 3,
    scene: 'canvas',
    consigne:
      '<p>À chaque image, tracez <code>nbCercles</code> cercles dont le rayon suit une onde : <code>60 + 60 * Math.sin(temps - i * 0.5)</code>, et dont l\'opacité <strong>diminue</strong> avec <code>i</code> : <code>1 - i / nbCercles</code>. N\'oubliez ni d\'effacer, ni de <strong>lancer</strong> l\'animation.</p>',
    code:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      'const nbCercles = 6;\n' +
      'let temps = 0;\n\n' +
      'function dessinerCercle(r, alpha) {\n' +
      '  ctx.globalAlpha = alpha;\n' +
      '  ctx.beginPath();\n' +
      '  ctx.arc(200, 200, Math.max(r, 1), 0, 2 * Math.PI);\n' +
      '  ctx.strokeStyle = "#2f5fd9";\n' +
      '  ctx.lineWidth = 4;\n' +
      '  ctx.stroke();\n' +
      '  ctx.globalAlpha = 1;\n' +
      '}\n\n' +
      'function lancerAnimation() {\n' +
      '  // Q6 : effacer le canvas\n' +
      '  temps += 0.03;\n' +
      '  for (let i = 0; i < nbCercles; i++) {\n' +
      '    // Q7 : calculer le rayon et l\'opacité du cercle i,\n' +
      '    //      puis appeler dessinerCercle(rayon, alpha)\n' +
      '  }\n' +
      '  requestAnimationFrame(lancerAnimation);\n' +
      '}\n\n' +
      '// Q8 : démarrer l\'animation\n',
    indice: '<p>Dans la boucle : <code>const rayon = 60 + 60 * Math.sin(temps - i * 0.5);</code> et <code>const alpha = 1 - i / nbCercles;</code>. Et surtout, un premier appel <code>lancerAnimation();</code> en bas du code : sans lui, la fonction n\'est jamais exécutée.</p>',
    solution:
      'const canvas = document.getElementById("monCanvas");\n' +
      'const ctx = canvas.getContext("2d");\n\n' +
      'const nbCercles = 6;\n' +
      'let temps = 0;\n\n' +
      'function dessinerCercle(r, alpha) {\n' +
      '  ctx.globalAlpha = alpha;\n' +
      '  ctx.beginPath();\n' +
      '  ctx.arc(200, 200, Math.max(r, 1), 0, 2 * Math.PI);\n' +
      '  ctx.strokeStyle = "#2f5fd9";\n' +
      '  ctx.lineWidth = 4;\n' +
      '  ctx.stroke();\n' +
      '  ctx.globalAlpha = 1;\n' +
      '}\n\n' +
      'function lancerAnimation() {\n' +
      '  ctx.clearRect(0, 0, 400, 400);\n' +
      '  temps += 0.03;\n' +
      '  for (let i = 0; i < nbCercles; i++) {\n' +
      '    const rayon = 60 + 60 * Math.sin(temps - i * 0.5);\n' +
      '    const alpha = 1 - i / nbCercles;\n' +
      '    dessinerCercle(rayon, alpha);\n' +
      '  }\n' +
      '  requestAnimationFrame(lancerAnimation);\n' +
      '}\n\n' +
      'lancerAnimation();',
    cas: [{ valeurs: { nbCercles: 6 } }, { valeurs: { nbCercles: 4 } }],
    verifier: function (t) {
      var n = t.valeurs.nbCercles;
      var demarre = t.enAttente() > 0;
      if (!demarre) return [point(false, 'L\'animation ne démarre pas : ajoutez un premier appel <code>lancerAnimation();</code> en bas du code')];
      var jouees = t.avancer(30);
      var f1 = t.cercles(1, 'stroke'), f30 = t.cercles(30, 'stroke');
      // L'image 1 correspond à temps = 0.06 (un appel au démarrage, puis un par image).
      var attendu = function (temps) {
        var res = [];
        for (var i = 0; i < n; i++) res.push(Math.max(60 + 60 * Math.sin(temps - i * 0.5), 1));
        return res;
      };
      var rayonsOk = f1.length === n && [0.06, 0.03, 0.09].some(function (tp) {
        var a = attendu(tp);
        return f1.every(function (c, i) { return t.proche(c.r, a[i], 1e-6); });
      });
      var alphasOk = f1.length === n && f1.every(function (c, i) { return t.proche(c.alpha, 1 - i / n, 1e-3); });
      var bouge = f1.length && f30.length && !t.proche(f1[0].r, f30[0].r, 0.5);
      var efface = jouees && t.appels('clearRect', 1).length && t.appels('clearRect', jouees).length;
      return [
        point(demarre, 'L\'animation démarre toute seule (un premier appel à <code>lancerAnimation()</code>)'),
        point(jouees === 30, 'L\'animation tourne en continu'),
        point(efface, 'Le canvas est effacé à chaque image'),
        point(f1.length === n, n + ' cercles par image (obtenu : ' + f1.length + ')'),
        point(rayonsOk, 'Les rayons suivent l\'onde 60 + 60 × sin(temps − i × 0,5)'),
        point(alphasOk, 'Les opacités diminuent : 1, puis 1 − 1/' + n + '… jusqu\'à 1/' + n),
        point(bouge, 'Les cercles bougent d\'une image à l\'autre')
      ];
    }
  }
];
