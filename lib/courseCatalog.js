import doclevelCourses from '@/lib/doclevelCourses.json';
import { allowedCourseCategories } from '@/lib/courseCategories';

const courseOverrides = {
  '048a3d70-3e78-4939-bc37-b61f1a8b3445': {
    description:
      'Curso en l\u00ednea para pap\u00e1s primerizos: qu\u00e9 es normal, qu\u00e9 debe preocuparte y c\u00f3mo cuidar a tu beb\u00e9 desde el nacimiento.',
    content:
      'Curso en l\u00ednea: Las Primeras Horas de tu Beb\u00e9.\n\nAprende qu\u00e9 es normal, qu\u00e9 debe preocuparte y c\u00f3mo cuidar a tu beb\u00e9 desde el nacimiento, con una gu\u00eda pr\u00e1ctica para el primer mes de vida.\n\nImpartido por el Dr. Ra\u00fal G. de Lira L\u00f3pez.\n\nEste curso ayuda a pap\u00e1s primerizos a distinguir entre se\u00f1ales normales de adaptaci\u00f3n y situaciones que s\u00ed requieren atenci\u00f3n m\u00e9dica, con informaci\u00f3n clara, segura y f\u00e1cil de aplicar en casa.',
    price: '$487 MXN',
  },
};

export function normalizeCourse(course) {
  if (!course) return course;
  return {
    ...course,
    ...(courseOverrides[course.id] || {}),
  };
}

export const fallbackCourses = doclevelCourses.map((course, index) => ({
  ...normalizeCourse(course),
  id: course.id || `doclevel-course-${index + 1}`,
  created_at: new Date(Date.UTC(2026, 5, 4, 19, 55, 31 - index)),
}));

export function filterFallbackCourses({ category, search } = {}) {
  const normalizedSearch = String(search || '').trim().toLocaleLowerCase('es');

  return fallbackCourses.filter((course) => {
    if (!allowedCourseCategories.includes(course.category)) return false;
    if (category && category !== 'all' && course.category !== category) return false;
    if (!normalizedSearch) return true;

    return [course.title, course.description, course.category]
      .some((value) => String(value || '').toLocaleLowerCase('es').includes(normalizedSearch));
  });
}
