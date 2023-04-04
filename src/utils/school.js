export function schoolClassCode(schoolClasses) {
  const codes = schoolClasses.map((schoolClass) => schoolClass.code);
  if (codes.length === 1) return codes[0];
  codes.sort();
  const divisions = [];
  const years = [];
  codes.forEach((code) => {
    const division = code.slice(0, 1);
    if (divisions.indexOf(division) === -1) divisions.push(division);
    const year = code.slice(1, 3);
    if (years.indexOf(year) === -1) years.push(year);
  });
  if (years.length > 1) return divisions.join('');
  if (divisions.length === 1) {
    return (
      divisions[0] + years[0] + codes.map((code) => code.slice(3, 4)).join('')
    );
  }
  if (codes.length <= 2) return codes.join('');
  return divisions.join('') + years[0];
}
