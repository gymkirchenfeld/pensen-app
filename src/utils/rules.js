// https://stackoverflow.com/questions/175739, adapted
function isNumeric(str) {
  return (
    (typeof str === 'string' && str === '') ||
    (!isNaN(str) && !isNaN(parseFloat(str)))
  );
}

export default {
  nonNegativeNumber: [
    (v) => isNumeric(v) || 'Das Feld muss eine Zahl enthalten',
    (v) =>
      0 <= parseFloat(v) || 'Das Feld muss eine nicht-negative Zahl enthalten.',
  ],
  week: [
    (v) => isNumeric(v) || 'Das Feld muss eine Zahl enthalten',
    (v) =>
      (0 < v && v < 54) || 'Das Feld muss die Anzahl Schulwochen enthalten.',
  ],
  year: [
    (v) => isNumeric(v) || 'Das Feld muss eine Zahl enthalten',
    (v) =>
      (1999 < v && v < 3001) ||
      'Das Feld muss eine vierstellige Jahrzahl enthalten.',
  ],
  requiredText: [
    (v) => (v && v.length > 0) || 'Das Feld darf nicht leer sein.',
  ],
};
