// Ateliers : exercices DOM et Canvas exécutés dans une vraie petite page.
//
// Chaque exercice a une « scène » (le HTML du TP : le bouton du changeur de
// thème, ou le <canvas id="monCanvas">). Le code de l'étudiant·e s'exécute
// dans une iframe qui contient cette scène : document.getElementById()
// trouve donc réellement le bouton ou le canvas, et l'aperçu montre le
// résultat (thème qui bascule, cercles dessinés, animation…).
//
// Pour la vérification, on relance le code dans une iframe instrumentée :
//   - console.log est capturé ;
//   - les appels de dessin du canvas (arc, stroke, fill, clearRect…) sont
//     enregistrés avec l'état du pinceau (couleur, épaisseur, opacité) ;
//   - requestAnimationFrame est remplacé : les images de l'animation sont
//     avancées une par une par le test (t.avancer(n)) ;
//   - t.cliquer('#id') simule un clic.
// Chaque exercice fournit une fonction verifier(t) qui renvoie une liste de
// { ok, texte }. Les exercices sont décrits dans js/exercices-data.js.

var Atelier = (function () {
  var SCENES = {
    theme: {
      hauteur: 190,
      html:
        '<style>' +
        'body{margin:0;padding:18px 20px;font-family:system-ui,sans-serif;background:#f7f8fb;color:#1c2333;transition:background .3s,color .3s}' +
        'body.dark-theme{background:#12141c;color:#e7e9f2}' +
        'h3{margin:0 0 6px}p{margin:0 0 14px}' +
        'button{font:inherit;font-weight:700;padding:8px 16px;border-radius:8px;border:1px solid #2f5fd9;background:#2f5fd9;color:#fff;cursor:pointer}' +
        'body.dark-theme button{background:#e7e9f2;color:#12141c;border-color:#e7e9f2}' +
        '</style>' +
        '<h3>Mon site MMI</h3><p>Un paragraphe pour voir le thème changer.</p>' +
        '<button id="toggle-theme-btn">Activer le Mode Sombre</button>'
    },
    canvas: {
      hauteur: 420,
      html:
        '<style>body{margin:0;padding:10px;background:#eef0f6;display:flex;justify-content:center}' +
        'canvas{background:#fff;border:1px solid #d5d9e3;border-radius:6px;max-width:100%;height:auto}</style>' +
        '<canvas id="monCanvas" width="400" height="400"></canvas>'
    }
  };

  var METHODES = ['beginPath', 'closePath', 'arc', 'stroke', 'fill', 'clearRect', 'fillRect', 'strokeRect', 'moveTo', 'lineTo'];

  function echapper(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formater(v) {
    if (typeof v === 'string') return v;
    if (v === null || v === undefined || typeof v !== 'object') return String(v);
    if (v.nodeType === 1) return '<' + v.tagName.toLowerCase() + (v.id ? ' id="' + v.id + '"' : '') + '>';
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }

  // Réécrit « const nbCercles = 8; » avec la valeur d'un cas de test.
  function remplacerValeurs(code, valeurs) {
    var noms = Object.keys(valeurs || {});
    for (var k = 0; k < noms.length; k++) {
      var motif = new RegExp('^(\\s*(?:let|const|var)\\s+' + noms[k] + '\\s*=\\s*)[^;\\n]*', 'm');
      if (!motif.test(code)) return { manquante: noms[k] };
      code = code.replace(motif, function (tout, debut) { return debut + JSON.stringify(valeurs[noms[k]]); });
    }
    return { code: code };
  }

  // Crée l'iframe de la scène, puis exécute le code dedans.
  // mode 'apercu' : vrai requestAnimationFrame ; mode 'test' : instrumenté.
  function lancer(zone, scene, code, mode, expose) {
    return new Promise(function (resoudre) {
      var iframe = document.createElement('iframe');
      iframe.className = 'atelier-iframe';
      iframe.title = 'Aperçu du résultat';
      iframe.style.height = SCENES[scene].hauteur + 'px';
      iframe.srcdoc = '<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body>' + SCENES[scene].html + '</body></html>';
      iframe.addEventListener('load', function () {
        var win = iframe.contentWindow;
        var etat = { console: [], erreurs: [], journal: [], frame: 0, file: [], expose: {} };

        function log() {
          etat.console.push(Array.prototype.map.call(arguments, formater).join(' '));
          if (etat.onLog) etat.onLog();
        }
        var faux = { log: log, info: log, warn: log, error: log };
        win.addEventListener('error', function (e) {
          etat.erreurs.push(e.message);
          if (etat.onLog) etat.onLog();
        });

        // Enregistrement des appels de dessin.
        var getContext = win.HTMLCanvasElement.prototype.getContext;
        win.HTMLCanvasElement.prototype.getContext = function () {
          var ctx = getContext.apply(this, arguments);
          if (ctx && !ctx.__enregistre) {
            ctx.__enregistre = true;
            METHODES.forEach(function (m) {
              var orig = ctx[m];
              if (typeof orig !== 'function') return;
              ctx[m] = function () {
                etat.journal.push({
                  m: m,
                  args: Array.prototype.slice.call(arguments),
                  alpha: ctx.globalAlpha,
                  strokeStyle: ctx.strokeStyle,
                  fillStyle: ctx.fillStyle,
                  lineWidth: ctx.lineWidth,
                  frame: etat.frame
                });
                return orig.apply(ctx, arguments);
              };
            });
            etat.ctx = ctx;
          }
          return ctx;
        };

        if (mode === 'test') {
          win.requestAnimationFrame = function (cb) {
            etat.file.push(cb);
            return etat.file.length;
          };
          win.cancelAnimationFrame = function () {};
        }

        try {
          var retour = (expose && expose.length)
            ? '\n;return {' + expose.map(function (n) {
                return JSON.stringify(n) + ': (typeof ' + n + ' !== "undefined" ? ' + n + ' : undefined)';
              }).join(', ') + '};'
            : '';
          etat.expose = new win.Function('console', code + retour)(faux) || {};
        } catch (e) {
          etat.erreurs.push((e.name ? e.name + ' : ' : '') + e.message);
        }
        resoudre({ iframe: iframe, win: win, etat: etat });
      });
      zone.innerHTML = '';
      zone.appendChild(iframe);
    });
  }

  // Outils mis à disposition des fonctions verifier(t).
  function outils(run, cas) {
    var win = run.win, etat = run.etat;
    var t = {
      win: win,
      doc: win.document,
      console: etat.console,
      erreurs: etat.erreurs,
      journal: etat.journal,
      expose: etat.expose,
      valeurs: (cas && cas.valeurs) || {},
      ctx: function () { return etat.ctx; },
      cliquer: function (sel) {
        var el = win.document.querySelector(sel);
        if (el) el.click();
        return el;
      },
      // Exécute n images de l'animation (les rappels demandés par
      // requestAnimationFrame). Renvoie le nombre d'images réellement jouées.
      avancer: function (n) {
        var jouees = 0;
        for (var k = 0; k < n; k++) {
          if (!etat.file.length) break;
          etat.frame++;
          var rappels = etat.file;
          etat.file = [];
          rappels.forEach(function (cb) {
            try { cb(etat.frame * 16.7); } catch (e) { etat.erreurs.push(e.message); }
          });
          jouees++;
        }
        return jouees;
      },
      enAttente: function () { return etat.file.length; },
      appels: function (m, frame) {
        return etat.journal.filter(function (a) { return a.m === m && (frame === undefined || a.frame === frame); });
      },
      // Cercles effectivement tracés : un arc suivi d'un stroke (ou fill).
      cercles: function (frame, action) {
        var res = [], dernierArc = null;
        etat.journal.forEach(function (a) {
          if (frame !== undefined && a.frame !== frame) return;
          if (a.m === 'beginPath') dernierArc = null;
          if (a.m === 'arc') dernierArc = a;
          if ((a.m === 'stroke' || a.m === 'fill') && dernierArc && (!action || a.m === action)) {
            res.push({ x: dernierArc.args[0], y: dernierArc.args[1], r: dernierArc.args[2],
              debut: dernierArc.args[3], fin: dernierArc.args[4], action: a.m,
              alpha: a.alpha, strokeStyle: a.strokeStyle, fillStyle: a.fillStyle, lineWidth: a.lineWidth });
          }
        });
        return res;
      },
      proche: function (a, b, eps) { return Math.abs(a - b) <= (eps || 1e-6); }
    };
    return t;
  }

  // Lance toutes les vérifications d'un exercice (une iframe par cas).
  function verifier(exo, code, zoneTest) {
    var cas = exo.cas || [{}];
    var resultats = [];
    return cas.reduce(function (chaine, c) {
      return chaine.then(function () {
        var prep = remplacerValeurs(code, c.valeurs);
        if (prep.manquante) {
          resultats.push({ ok: false, texte: 'La ligne <code>const ' + echapper(prep.manquante) + ' = …;</code> a disparu : gardez-la, la vérification la modifie.' });
          return;
        }
        return lancer(zoneTest, exo.scene, prep.code, 'test', exo.expose).then(function (run) {
          var t = outils(run, c);
          var liste;
          try {
            liste = exo.verifier(t) || [];
          } catch (e) {
            liste = [{ ok: false, texte: 'Erreur pendant le test : ' + echapper(e.message) }];
          }
          if (run.etat.erreurs.length) {
            liste.unshift({ ok: false, texte: 'Erreur dans votre code : « ' + echapper(run.etat.erreurs[0]) + ' »' });
          }
          var prefixe = Object.keys(c.valeurs || {}).length
            ? 'Avec ' + Object.keys(c.valeurs).map(function (n) { return n + ' = ' + c.valeurs[n]; }).join(', ') + ' : '
            : '';
          liste.forEach(function (r) { resultats.push({ ok: r.ok, texte: prefixe + r.texte }); });
        });
      });
    }, Promise.resolve()).then(function () {
      zoneTest.innerHTML = '';
      var reussis = resultats.filter(function (r) { return r.ok; }).length;
      return { resultats: resultats, reussis: reussis, total: resultats.length, tout: reussis === resultats.length && resultats.length > 0 };
    });
  }

  // ---------- Rendu d'un atelier dans la page ----------

  var NIVEAUX = { 1: 'facile', 2: 'moyen', 3: 'défi' };

  function monter(conteneur, exo, parcours, surProgression) {
    conteneur.classList.add('atelier');
    conteneur.id = 'exo-' + exo.id;
    conteneur.innerHTML =
      '<div class="atelier-tete">' +
        '<input type="checkbox" class="exo-check" disabled tabindex="-1" aria-label="Exercice ' + exo.id + ' réussi" title="Se coche automatiquement quand la vérification réussit">' +
        '<div class="exo-num">' + exo.id + '</div>' +
        '<h3>' + echapper(exo.titre) + ' <span class="niveau niveau-' + exo.niveau + '">' + NIVEAUX[exo.niveau] + '</span></h3>' +
      '</div>' +
      '<div class="atelier-corps">' +
        exo.consigne +
        '<div class="atelier-grille">' +
          '<div class="essai">' +
            '<div class="essai-barre"><strong>Votre code</strong>' +
              '<button type="button" class="btn petit" data-action="executer" title="Raccourci : Ctrl + Entrée">▶ Exécuter</button>' +
              '<button type="button" class="btn petit btn-verifier" data-action="verifier">✔ Vérifier</button>' +
              '<button type="button" class="btn secondary petit" data-action="reinitialiser">Réinitialiser</button>' +
            '</div>' +
            '<textarea spellcheck="false" autocapitalize="off" aria-label="Code JavaScript"></textarea>' +
            '<pre class="essai-sortie" aria-live="polite"><span class="discret">La console s\'affichera ici.</span></pre>' +
          '</div>' +
          '<div class="atelier-apercu">' +
            '<p class="atelier-legende">Aperçu</p>' +
            '<div class="atelier-scene"></div>' +
          '</div>' +
        '</div>' +
        '<div class="essai-verdict" hidden></div>' +
        '<div class="atelier-test" aria-hidden="true"></div>' +
        '<div class="exo-actions">' +
          '<button type="button" class="btn secondary petit" data-affiche="indice-' + exo.id + '">💡 Un indice</button>' +
          '<button type="button" class="btn secondary petit voir-solution" data-affiche="solution-' + exo.id + '">Voir une solution</button>' +
        '</div>' +
        '<div class="indice" id="indice-' + exo.id + '" hidden><strong>Indice —</strong> ' + exo.indice + '</div>' +
        '<div class="solution" id="solution-' + exo.id + '" hidden><strong>Une solution possible</strong> (il en existe d\'autres !)' +
          '<pre><code>' + echapper(exo.solution) + '</code></pre></div>' +
      '</div>';

    var zone = conteneur.querySelector('textarea');
    var sortie = conteneur.querySelector('.essai-sortie');
    var scene = conteneur.querySelector('.atelier-scene');
    var verdict = conteneur.querySelector('.essai-verdict');
    var zoneTest = conteneur.querySelector('.atelier-test');
    zone.value = exo.code;
    zone.rows = Math.max(8, exo.code.split('\n').length + 1);

    function afficherConsole(etat) {
      sortie.innerHTML = '';
      etat.console.forEach(function (l) { sortie.appendChild(document.createTextNode(l + '\n')); });
      etat.erreurs.forEach(function (m) {
        var s = document.createElement('span');
        s.className = 'erreur';
        s.textContent = '✘ ' + m + '\n';
        sortie.appendChild(s);
      });
      if (!etat.console.length && !etat.erreurs.length) {
        sortie.innerHTML = '<span class="discret">(rien dans la console : regardez l\'aperçu)</span>';
      }
    }

    function executer() {
      verdict.hidden = true;
      lancer(scene, exo.scene, zone.value, 'apercu').then(function (run) {
        // Les messages écrits plus tard (au clic, pendant l'animation)
        // s'ajoutent à la console affichée.
        run.etat.onLog = function () { afficherConsole(run.etat); };
        afficherConsole(run.etat);
      });
    }

    function marquer() {
      conteneur.classList.add('done');
      conteneur.querySelector('.exo-check').checked = true;
    }

    function lancerVerification() {
      verdict.hidden = false;
      verdict.className = 'essai-verdict';
      verdict.textContent = 'Vérification en cours…';
      verifier(exo, zone.value, zoneTest).then(function (v) {
        verdict.className = 'essai-verdict ' + (v.tout ? 'ok' : 'ko');
        verdict.innerHTML =
          (v.tout ? '✔ Bravo, tout est validé !' : '✘ ' + v.reussis + ' point(s) validé(s) sur ' + v.total + '.') +
          '<ul style="margin:0.4rem 0 0;font-weight:400">' +
          v.resultats.map(function (r) { return '<li>' + (r.ok ? '✔ ' : '✘ ') + r.texte + '</li>'; }).join('') +
          '</ul>';
        parcours.noterTentative(exo, v.tout, v.reussis, v.total);
        if (v.tout) marquer();
        if (surProgression) surProgression();
      });
    }

    conteneur.addEventListener('click', function (evt) {
      var b = evt.target.closest('[data-action]');
      if (!b) return;
      var action = b.getAttribute('data-action');
      if (action === 'executer') executer();
      if (action === 'verifier') parcours.exigerEtudiant(lancerVerification);
      if (action === 'reinitialiser') {
        zone.value = exo.code;
        parcours.sauverCode(exo.id, zone.value);
        executer();
      }
    });
    zone.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
        evt.preventDefault();
        executer();
      } else if (evt.key === 'Tab' && !evt.shiftKey) {
        evt.preventDefault();
        var d = zone.selectionStart;
        zone.value = zone.value.slice(0, d) + '  ' + zone.value.slice(zone.selectionEnd);
        zone.selectionStart = zone.selectionEnd = d + 2;
      }
    });
    zone.addEventListener('input', function () { parcours.sauverCode(exo.id, zone.value); });
    conteneur.querySelector('.voir-solution').addEventListener('click', function () {
      parcours.noterSolution(exo.id);
    });

    // Après identification : on reprend le code enregistré (sinon on garde
    // ce qui a été tapé avant de s'identifier) et on coche si déjà réussi.
    function synchroniser() {
      conteneur.classList.remove('done');
      conteneur.querySelector('.exo-check').checked = false;
      if (!parcours.etudiant()) return;
      var enregistre = parcours.code(exo.id);
      if (enregistre !== undefined) zone.value = enregistre;
      else if (zone.value !== exo.code) parcours.sauverCode(exo.id, zone.value);
      if (parcours.estFait(exo.id)) marquer();
    }

    synchroniser();
    executer();
    return { synchroniser: synchroniser };
  }

  return { monter: monter, verifier: verifier };
})();
