import doclevelCourses from '@/lib/doclevelCourses.json';
import { allowedCourseCategories } from '@/lib/courseCategories';

export const fallbackCourses = doclevelCourses.map((course, index) => ({
  ...course,
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
