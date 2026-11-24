import activeCurriculumData from './activeCurriculumData.json';
import {
  ActiveCurriculumUnit,
  ExerciseWithMeta,
} from '../types/bac';

export const activeUnits: ActiveCurriculumUnit[] = activeCurriculumData.activeUnits as ActiveCurriculumUnit[];
export const activeExercises: ExerciseWithMeta[] = activeCurriculumData.exercises as ExerciseWithMeta[];

export function getActiveUnitById(id: string): ActiveCurriculumUnit | undefined {
  return activeUnits.find((u) => u.id === id);
}

export const availableYears = Array.from(
  new Set(activeExercises.map((e) => e.paperYear))
).sort((a, b) => b - a);

export type SubjectGroup = {
  paperId: string;
  paperOption: 1 | 2;
  paperYear: number;
  exercises: ExerciseWithMeta[];
};

export type YearGroup = {
  year: number;
  subjects: SubjectGroup[];
};

export function getGroupedExercisesForUnit(
  unitId: string,
  subUnitId?: string | null
): YearGroup[] {
  const filtered = activeExercises.filter((e) => {
    if (e.activeUnitId !== unitId) return false;
    if (subUnitId && subUnitId !== 'all') {
      return e.subUnits && e.subUnits.includes(subUnitId);
    }
    return true;
  });

  const years = Array.from(new Set(filtered.map((e) => e.paperYear))).sort((a, b) => b - a);

  return years.map((year) => {
    const yearExercises = filtered.filter((e) => e.paperYear === year);
    // Group into Sujet 1 and Sujet 2
    const subjectsMap = new Map<string, SubjectGroup>();

    yearExercises.forEach((ex) => {
      const key = `${ex.paperId}`;
      if (!subjectsMap.has(key)) {
        subjectsMap.set(key, {
          paperId: ex.paperId,
          paperOption: ex.paperOption,
          paperYear: ex.paperYear,
          exercises: [],
        });
      }
      subjectsMap.get(key)!.exercises.push(ex);
    });

    const subjects = Array.from(subjectsMap.values()).sort(
      (a, b) => a.paperOption - b.paperOption
    );

    return {
      year,
      subjects,
    };
  });
}

/**
 * Resolves static asset paths (like /pdfs/...) so they work correctly
 * whether hosted at the domain root or under a GitHub Pages repository subpath.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || './';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (base.endsWith('/')) {
    return `${base}${cleanPath}`;
  }
  return `${base}/${cleanPath}`;
}
