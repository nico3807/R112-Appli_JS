// Exécution pas à pas de la boucle des cercles concentriques (js/trace.js).

Trace.monter('#trace-cercles', {
  titre: 'Exécution pas à pas : les cercles concentriques',
  code: [
    'const nbCercles = 4;',
    'const maxRayon = 180;',
    'const ecart = maxRayon / nbCercles;',
    'for (let i = 0; i < nbCercles; i++) {',
    '  const rayon = maxRayon - i * ecart;',
    '  ctx.globalAlpha = (i + 1) / nbCercles;',
    '  // … beginPath, arc(200, 200, rayon, …), stroke',
    '}'
  ],
  variables: ['nbCercles', 'maxRayon', 'ecart', 'i', 'rayon', 'alpha'],
  executer: function* (v, ecrire) {
    v.nbCercles = 4;
    yield [1, 'On veut 4 cercles.'];
    v.maxRayon = 180;
    yield [2, 'Le plus grand cercle a un rayon de 180.'];
    v.ecart = v.maxRayon / v.nbCercles;
    yield [3, 'Écart entre deux cercles : 180 / 4 = 45.'];
    v.i = 0;
    yield [4, 'Le compteur i démarre à 0.'];
    while (true) {
      var ok = v.i < v.nbCercles;
      yield [4, 'Condition : i < nbCercles ? ' + v.i + ' < 4 → ' + (ok ? 'vrai, on dessine un cercle.' : 'faux, fin de la boucle.')];
      if (!ok) break;
      v.rayon = v.maxRayon - v.i * v.ecart;
      yield [5, 'rayon = 180 - ' + v.i + ' × 45 = ' + v.rayon + '.'];
      v.alpha = (v.i + 1) / v.nbCercles;
      yield [6, 'Opacité = (' + v.i + ' + 1) / 4 = ' + v.alpha + (v.alpha === 1 ? ' : le dernier cercle est opaque.' : '.')];
      ecrire('cercle de rayon ' + v.rayon + ', opacité ' + v.alpha);
      yield [7, 'Le cercle est tracé (voir la « console » : un cercle par tour).'];
      delete v.rayon;
      v.i++;
      yield [4, 'Fin du tour : i++ → i vaut ' + v.i + '. (rayon, déclarée dans la boucle, disparaît.)'];
    }
    delete v.i;
    yield [8, 'Sortie de la boucle : 4 cercles, rayons 180, 135, 90, 45, opacités 0.25 → 1.'];
  }
});
