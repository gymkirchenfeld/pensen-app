export function filterArchived(item, showArchived) {
  return showArchived || !item.archived;
}

export function filterText(text, search) {
  return (
    !search || (text && text.toUpperCase().indexOf(search.toUpperCase()) !== -1)
  );
}

export function filterPerson(person, search) {
  return (
    filterText(person.code, search) ||
    filterText(person.firstName, search) ||
    filterText(person.lastName, search)
  );
}

export function filterType(item, type) {
  return !type || type.id === -1 || type.id === item.type.id;
}

const collator = new Intl.Collator('de', { sensitivity: 'base' });

export function compareString(a, b) {
  return collator.compare(a, b);
}
