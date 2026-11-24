export type CurriculumUnit = {
  id: string;
  nameAr: string;
  nameFr: string;
  code: string;
  descriptionAr: string;
  descriptionFr: string;
};

export type ActiveSubUnit = {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  descriptionFr: string;
};

export type ActiveCurriculumUnit = {
  id: string;
  nameAr: string;
  nameFr: string;
  code: string;
  badge: string;
  descriptionAr: string;
  descriptionFr: string;
  subUnits: ActiveSubUnit[];
};

export type Exercise = {
  id: string;             // e.g. "M2026-1-EX1"
  exerciseNumber: number; // 1, 2, 3, 4
  unitId: string;         // e.g. "complex_numbers"
  relatedUnitIds?: string[];
  activeUnitId?: string;  // "fonctions_exponentielles" | "fonctions_logarithmiques" | "suites_numeriques"
  subUnits?: string[];    // e.g. ["limites", "derivabilite_continuite", "croissance_comparee_etude"]
  titleAr: string;
  titleFr: string;
  scorePoints: number;    // e.g. 4, 5, 7
  descriptionAr: string;
  descriptionFr: string;
  keywords: string[];
};

export type BacPaper = {
  id: string;             // e.g. "M2026-1"
  year: number;           // 2026
  session: "normale" | "exceptionnelle";
  sessionLabelAr: string;
  sessionLabelFr: string;
  subject: "Math" | "Physics" | "Science";
  subjectNameAr: string;
  subjectNameFr: string;
  branch: "3M";           // 3ème Mathélème
  branchNameAr: string;
  branchNameFr: string;
  optionIndex: 1 | 2;     // 1 or 2
  titleAr: string;
  titleFr: string;
  pdfUrl: string;
  solutionUrl?: string;
  pdfFileName: string;
  pageStart: number;
  pageEnd: number;
  solutionPageStart: number;
  solutionPageEnd: number;
  exercises: Exercise[];
};

export type ExerciseWithMeta = Exercise & {
  paperYear: number;
  paperSession: string;
  paperOption: 1 | 2;
  paperId: string;
  pdfUrl: string;
  pdfFileName: string;
  pageStart: number;
  pageEnd?: number;
  solutionPageStart: number;
  solutionPageEnd?: number;
  activeUnitId?: string;
  subUnits?: string[];
};

export type ExerciseStatus = 'unsolved' | 'in_progress' | 'mastered';

export type Language = 'ar' | 'fr';
export type Theme = 'dark' | 'light';
