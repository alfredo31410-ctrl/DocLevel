import doclevelCourses from '@/lib/doclevelCourses.json';
import { allowedCourseCategories } from '@/lib/courseCategories';

const courseOverrides = {
  '048a3d70-3e78-4939-bc37-b61f1a8b3445': {
    title: 'Primer Mes de tu Bebé Paso a Paso',
    description:
      'Aprende a cuidar a tu bebé con seguridad desde sus primeros días: identifica qué es normal, reconoce señales de alerta y acompaña su primer mes con más tranquilidad.',
    content:
      "Entrenamiento en vivo: Primer Mes de tu Bebé Paso a Paso.\n\nAprende a comprender las necesidades de tu bebé durante su primer mes de vida, identificar los cambios normales, reconocer las señales de alerta y brindarle los cuidados que necesita para favorecer su bienestar desde el nacimiento.\n\nImpartido por el Dr. Raúl G. de Lira López.\n\nIncluye 3 días en vivo, 2 horas diarias de entrenamiento y acceso a las grabaciones durante 1 año.",
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
