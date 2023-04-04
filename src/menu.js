export default [
  {
    title: 'Übersicht',
    color: 'default',
    visible: true,
    items: [
      {
        title: 'Jahresüberblick',
        icon: 'mdi-poll',
        link: 'Overview',
      },
      {
        title: 'Pensenblatt',
        icon: 'mdi-account-box',
        link: 'Workload',
      },
      {
        title: 'Export',
        icon: 'mdi-export-variant',
        link: 'Export',
      },
    ],
  },
  {
    title: 'Planung',
    color: 'default',
    visible: true,
    items: [
      {
        title: 'Anstellungen',
        icon: 'mdi-account-check',
        link: 'Employment',
      },
      {
        title: 'nach Klassen',
        icon: 'mdi-card-account-details',
        link: 'Course',
      },
      {
        title: 'gesamtschulisch',
        icon: 'mdi-card-account-details-star-outline',
        link: 'SpecialCourse',
      },
      {
        title: 'Pool',
        icon: 'mdi-format-list-bulleted-type',
        link: 'Pool',
      },
      {
        title: 'Abschlussarbeiten',
        icon: 'mdi-school',
        link: 'Thesis',
      },
      {
        title: 'IPB-Buchungen',
        icon: 'mdi-plus-minus-variant',
        link: 'Posting',
      },
    ],
  },
  {
    title: 'Spezielles',
    color: 'default',
    visible: true,
    items: [
      {
        title: 'Schuljahr eröffnen',
        icon: 'mdi-calendar-plus',
        link: 'NewSchoolYear',
      },
      {
        title: 'Wartung',
        icon: 'mdi-cogs',
        link: 'Maintenance',
      },
      {
        title: 'Planung Wankdorf',
        icon: 'mdi-home-group',
        link: 'Wankdorf',
        feature: 'wankdorf',
      },
      {
        title: 'Import Arbeiten',
        icon: 'mdi-import',
        link: 'ThesisImport',
      },
    ],
  },
  {
    title: 'Stammdaten',
    color: 'default',
    visible: false,
    items: [
      {
        title: 'Fächer',
        icon: 'mdi-book-open-variant',
        link: 'Subject',
      },
      {
        title: 'Klassen',
        icon: 'mdi-account-group',
        link: 'SchoolClass',
      },
      {
        title: 'Lehrgänge',
        icon: 'mdi-school',
        link: 'Curriculum',
      },
      {
        title: 'Lektionentafel',
        icon: 'mdi-table-large',
        link: 'DefaultLessons',
      },
      {
        title: 'Lehrpersonen',
        icon: 'mdi-account',
        link: 'Teacher',
      },
      {
        title: 'Organisationseinheiten',
        icon: 'mdi-shape',
        link: 'Division',
      },
      {
        title: 'Schuljahre',
        icon: 'mdi-calendar-month',
        link: 'SchoolYear',
      },
    ],
  },
];
