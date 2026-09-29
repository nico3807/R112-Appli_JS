/**
 * R112-Appli_JS — Bac à sable : rend les blocs .essai exécutables.
 * Structure attendue :
 *   <div class="essai" data-essai data-titre="...">
 *     <textarea>code…</textarea>
 *   </div>
 */
(function () {
  "use strict";

  document.querySelectorAll("[data-essai]").forEach(function (bloc) {
    var textarea = bloc.querySelector("textarea");
    if (!textarea) return;

    var titre = bloc.getAttribute("data-titre") || "Exécutez ce code";
    var sortie = document.createElement("div");
    sortie.className = "essai-output";
    var demo = document.createElement("div");
    demo.className = "essai-demo";

    var actions = document.createElement("div");
    actions.className = "essai-actions";
    var btnRun = document.createElement("button");
    btnRun.type = "button";
    btnRun.textContent = "▶ Exécuter";
    var btnReset = document.createElement("button");
    btnReset.type = "button";
    btnReset.className = "secondary";
    btnReset.textContent = "↺ Réinitialiser";
    var codeInitial = textarea.value;
    actions.append(btnRun, btnReset);

    var entete = document.createElement("p");
    entete.className = "essai-titre";
    entete.textContent = titre;
    bloc.prepend(entete);
    bloc.append(textarea, actions, sortie, demo);

    function log(parent, args, cls) {
      var ligne = document.createElement("div");
      if (cls) ligne.className = cls;
      ligne.textContent = args
        .map(function (a) {
          try {
            if (typeof a === "string") return a;
            return JSON.stringify(a) !== undefined ? JSON.stringify(a) : String(a);
          } catch (e) {
            return String(a);
          }
        })
        .join(" ");
      parent.appendChild(ligne);
    }

    btnRun.addEventListener("click", function () {
      sortie.innerHTML = "";
      demo.innerHTML = "";
      var capturElems = {};
      // Fournit un faux document limité : getElementById / querySelector
      // retournent des éléments du bac à sable (démo) quand ils existent.
      var fakeDocument = {
        getElementById: function (id) {
          var el = demo.querySelector("#" + id);
          return el || null;
        },
        querySelector: function (sel) { return demo.querySelector(sel); },
        querySelectorAll: function (sel) { return demo.querySelectorAll(sel); },
        createElement: function (tag) { return document.createElement(tag); },
        body: demo,
      };
      var consoleLocal = {
        log: function () { log(sortie, Array.from(arguments)); },
        error: function () { log(sortie, Array.from(arguments), "err"); },
        warn: function () { log(sortie, Array.from(arguments)); },
      };
      try {
        var fn = new Function("console", "document", textarea.value);
        fn(consoleLocal, fakeDocument);
        if (!sortie.childNodes.length) {
          sortie.textContent = "(aucune sortie — utilisez console.log ou modifiez la démo ci-dessus)";
        }
      } catch (e) {
        sortie.innerHTML = "";
        log(sortie, ["Erreur : " + e.message], "err");
      }
    });

    btnReset.addEventListener("click", function () {
      textarea.value = codeInitial;
      sortie.innerHTML = "";
      demo.innerHTML = "";
    });
  });

  /* ---------- Quiz ---------- */
  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var explication = quiz.querySelector(".quiz-explication");
    quiz.querySelectorAll(".quiz-choix button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        quiz.querySelectorAll(".quiz-choix button").forEach(function (b) {
          b.classList.remove("correct", "wrong");
        });
        if (btn.hasAttribute("data-bon")) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
        }
        if (explication) explication.hidden = false;
      });
    });
  });
})();
