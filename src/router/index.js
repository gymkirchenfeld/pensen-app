import Vue from 'vue';
import VueRouter from 'vue-router';
import Businesspark from '@/views/Businesspark';
import Course from '@/views/Course/Course';
import CourseEdit from '@/views/Course/CourseEdit';
import Curriculum from '@/views/Curriculum/Curriculum';
import CurriculumEdit from '@/views/Curriculum/CurriculumEdit';
import Division from '@/views/Division/Division';
import DivisionEdit from '@/views/Division/DivisionEdit';
import Employment from '@/views/Employment/Employment';
import EmploymentEdit from '@/views/Employment/EmploymentEdit';
import Export from '@/views/Export/Export';
import LessonTable from '@/views/LessonTable/LessonTable';
import LessonTableEdit from '@/views/LessonTable/LessonTableEdit';
import Maintenance from '@/views/Maintenance/Maintenance';
import NewSchoolYear from '@/views/NewSchoolYear/NewSchoolYear';
import Overview from '@/views/Overview/Overview';
import Pool from '@/views/Pool/Pool';
import PoolEdit from '@/views/Pool/PoolEdit';
import Posting from '@/views/Posting/Posting';
import PostingEdit from '@/views/Posting/PostingEdit';
import SchoolClass from '@/views/SchoolClass/SchoolClass';
import SchoolClassEdit from '@/views/SchoolClass/SchoolClassEdit';
import SchoolYear from '@/views/SchoolYear/SchoolYear';
import SchoolYearEdit from '@/views/SchoolYear/SchoolYearEdit';
import SpecialCourse from '@/views/SpecialCourse/SpecialCourse';
import SpecialCourseEdit from '@/views/SpecialCourse/SpecialCourseEdit';
import Subject from '@/views/Subject/Subject';
import SubjectEdit from '@/views/Subject/SubjectEdit';
import Teacher from '@/views/Teacher/Teacher';
import TeacherEdit from '@/views/Teacher/TeacherEdit';
import Thesis from '@/views/Thesis/Thesis';
import ThesisEdit from '@/views/Thesis/ThesisEdit';
import ThesisImport from '@/views/Thesis/ThesisImport';
import ThesisImportNeufeld from '@/views/Thesis/ThesisImportNeufeld';
import Workload from '@/views/Workload/Workload';

Vue.use(VueRouter);

function parseInt(s) {
  const result = Number.parseInt(s);
  return isNaN(result) ? -1 : result;
}

function idProp(path) {
  return { id: parseInt(path.params.id) };
}

const routes = [
  {
    path: '/course',
    name: 'Course',
    component: Course,
    children: [
      {
        path: ':id',
        name: 'CourseEdit',
        props: idProp,
        component: CourseEdit,
      },
    ],
  },
  {
    path: '/curriculum',
    name: 'Curriculum',
    component: Curriculum,
    children: [
      {
        path: ':id',
        name: 'CurriculumEdit',
        props: idProp,
        component: CurriculumEdit,
      },
    ],
  },
  {
    path: '/division',
    name: 'Division',
    component: Division,
    children: [
      {
        path: ':id',
        name: 'DivisionEdit',
        props: idProp,
        component: DivisionEdit,
      },
    ],
  },
  {
    path: '/employment',
    name: 'Employment',
    component: Employment,
    children: [
      {
        path: ':id',
        name: 'EmploymentEdit',
        props: idProp,
        component: EmploymentEdit,
      },
    ],
  },
  {
    path: '/export',
    name: 'Export',
    component: Export,
  },
  {
    path: '/lessontable',
    name: 'LessonTable',
    component: LessonTable,
    children: [
      {
        path: ':id',
        name: 'LessonTableEdit',
        props: true,
        component: LessonTableEdit,
      },
    ],
  },

  {
    path: '/maintenance',
    name: 'Maintenance',
    component: Maintenance,
  },
  {
    path: '/newschoolyear',
    name: 'NewSchoolYear',
    component: NewSchoolYear,
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview,
  },
  {
    path: '/pool',
    name: 'Pool',
    component: Pool,
    children: [
      {
        path: ':id',
        name: 'PoolEdit',
        props: idProp,
        component: PoolEdit,
      },
    ],
  },
  {
    path: '/posting',
    name: 'Posting',
    component: Posting,
    children: [
      {
        path: ':id',
        name: 'PostingEdit',
        props: idProp,
        component: PostingEdit,
      },
    ],
  },
  {
    path: '/schoolclass',
    name: 'SchoolClass',
    component: SchoolClass,
    children: [
      {
        path: ':id',
        name: 'SchoolClassEdit',
        props: idProp,
        component: SchoolClassEdit,
      },
    ],
  },
  {
    path: '/schoolyear',
    name: 'SchoolYear',
    component: SchoolYear,
    children: [
      {
        path: ':id',
        name: 'SchoolYearEdit',
        props: idProp,
        component: SchoolYearEdit,
      },
    ],
  },
  {
    path: '/specialcourse',
    name: 'SpecialCourse',
    component: SpecialCourse,
    children: [
      {
        path: ':id',
        name: 'SpecialCourseEdit',
        props: idProp,
        component: SpecialCourseEdit,
      },
    ],
  },
  {
    path: '/subject',
    name: 'Subject',
    component: Subject,
    children: [
      {
        path: ':id',
        name: 'SubjectEdit',
        props: idProp,
        component: SubjectEdit,
      },
    ],
  },
  {
    path: '/teacher',
    name: 'Teacher',
    component: Teacher,
    children: [
      {
        path: ':id',
        name: 'TeacherEdit',
        props: idProp,
        component: TeacherEdit,
      },
    ],
  },
  {
    path: '/thesis',
    name: 'Thesis',
    component: Thesis,
    children: [
      {
        path: ':id',
        name: 'ThesisEdit',
        props: true,
        component: ThesisEdit,
      },
    ],
  },
  {
    path: '/thesisimport',
    name: 'ThesisImport',
    component: ThesisImport,
  },
  {
    path: '/thesisimportneufeld',
    name: 'ThesisImportNeufeld',
    component: ThesisImportNeufeld,
  },
  {
    path: '/businesspark',
    name: 'Businesspark',
    component: Businesspark,
  },
  {
    path: '/workload',
    name: 'Workload',
    component: Workload,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
