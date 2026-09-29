// Exécution pas à pas du rebond (js/trace.js) : les dernières images avant
// que le cercle ne reparte en grossissant.

Trace.monter('#trace-rebond', {
  titre: 'Exécution pas à pas : le rebond à la limite basse',
  intro: 'On part d\'un rayon de 26 qui rétrécit (sens = -1). Cliquez sur « Suivant » pour jouer les images une par une.',
  code: [
    'let rayon = 26;',
    'let sens = -1;',
    'function animer() {',
    '  rayon += sens * 2;',
    '  if (rayon <= 20 || rayon >= 180) {',
    '    sens = -sens;',
    '  }',
    '  dessinerCercle(rayon);',
    '  requestAnimationFrame(animer);',
    '}'
  ],
  variables: ['rayon', 'sens', 'image'],
  executer: function* (v, ecrire) {
    v.rayon = 26;
    yield [1, 'Le rayon vaut 26.'];
    v.sens = -1;
    yield [2, 'Le cercle rétrécit : sens = -1.'];
    for (var k = 1; k <= 6; k++) {
      v.image = k;
      yield [3, 'Image n°' + k + ' : le navigateur appelle animer().'];
      var avant = v.rayon;
      v.rayon += v.sens * 2;
      yield [4, 'rayon = ' + avant + ' + (' + v.sens + ') × 2 = ' + v.rayon + '.'];
      var limite = v.rayon <= 20 || v.rayon >= 180;
      yield [5, 'Limite atteinte ? ' + v.rayon + ' <= 20 ou ' + v.rayon + ' >= 180 → ' + (limite ? 'vrai.' : 'faux, on garde le même sens.')];
      if (limite) {
        v.sens = -v.sens;
        yield [6, 'On inverse le sens : sens vaut maintenant ' + v.sens + ', le cercle va grossir.'];
      }
      ecrire('image ' + k + ' : cercle de rayon ' + v.rayon);
      yield [8, 'Le cercle est dessiné avec un rayon de ' + v.rayon + '.'];
      yield [9, 'On demande l\'image suivante.'];
    }
  },
  fin: 'On s\'arrête là : le rayon est descendu à 20, puis remonte, 22, 24… L\'animation, elle, continue sans fin.'
});
