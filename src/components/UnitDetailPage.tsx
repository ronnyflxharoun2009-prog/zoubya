import React, { useState, useMemo } from 'react';
import {
  ActiveCurriculumUnit,
  Language,
  ExerciseStatus,
} from '../types/bac';
import { getGroupedExercisesForUnit, activeExercises } from '../data/bacData';
import { ExerciseCard } from './ExerciseCard';
import {
  ArrowLeft,
  ArrowRight,
  MagnifyingGlass,
  FileText,
  Calendar,
} from '@phosphor-icons/react';

interface UnitDetailPageProps {
  unit: ActiveCurriculumUnit;
  language: Language;
  onBack: () => void;
  onOpenPdf: (
    pdfUrl: string,
    initialPage: number,
    title: string,
    subjectPage?: number,
    solutionPage?: number
  ) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  exerciseStatuses: Record<string, ExerciseStatus>;
  onChangeStatus: (id: string, status: ExerciseStatus) => void;
}

export const UnitDetailPage: React.FC<UnitDetailPageProps> = ({
  unit,
  language,
  onBack,
  onOpenPdf,
  bookmarkedIds,
  onToggleBookmark,
  exerciseStatuses,
  onChangeStatus,
}) => {
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  // Sub-unit filter state
  const [selectedSubUnit, setSelectedSubUnit] = useState<string>('all');
  // Optional search query inside this unit
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Optional year filter
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const hasSubUnits = unit.subUnits && unit.subUnits.length > 0;

  // Get grouped exercises for this unit and subUnit
  const yearGroups = useMemo(() => {
    const rawGroups = getGroupedExercisesForUnit(unit.id, selectedSubUnit);

    return rawGroups
      .map((yg) => {
        if (selectedYear !== null && yg.year !== selectedYear) return null;

        const filteredSubjects = yg.subjects
          .map((sub) => {
            const filteredExs = sub.exercises.filter((ex) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return (
                ex.id.toLowerCase().includes(q) ||
                ex.titleAr.toLowerCase().includes(q) ||
                ex.titleFr.toLowerCase().includes(q) ||
                ex.descriptionAr.toLowerCase().includes(q) ||
                ex.descriptionFr.toLowerCase().includes(q) ||
                ex.keywords.some((k) => k.toLowerCase().includes(q))
              );
            });
            return {
              ...sub,
              exercises: filteredExs,
            };
          })
          .filter((sub) => sub.exercises.length > 0);

        if (filteredSubjects.length === 0) return null;

        return {
          ...yg,
          subjects: filteredSubjects,
        };
      })
      .filter((yg): yg is NonNullable<typeof yg> => yg !== null);
  }, [unit.id, selectedSubUnit, selectedYear, searchQuery]);

  // Total exercises matching in this view
  const totalMatching = useMemo(() => {
    return yearGroups.reduce(
      (acc, yg) =>
        acc + yg.subjects.reduce((sAcc, s) => sAcc + s.exercises.length, 0),
      0
    );
  }, [yearGroups]);

  // Available years in this unit
  const availableYears = useMemo(() => {
    const unitExercises = activeExercises.filter((e) => e.activeUnitId === unit.id);
    return Array.from(new Set(unitExercises.map((e) => e.paperYear))).sort((a, b) => b - a);
  }, [unit.id]);

  // Current active sub-unit metadata
  const currentSubUnitMeta = useMemo(() => {
    if (!hasSubUnits || selectedSubUnit === 'all') return null;
    return unit.subUnits.find((s) => s.id === selectedSubUnit);
  }, [hasSubUnits, selectedSubUnit, unit.subUnits]);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8 animate-in fade-in duration-150">
      {/* Top Header Bar: Back Button, Unit Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-95"
            data-cursor-interactive="true"
          >
            <BackIcon size={16} weight="bold" />
            <span>{isAr ? 'العودة للرئيسية' : 'Retour aux unités'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
              {unit.badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {isAr ? unit.nameAr : unit.nameFr}
            </h1>
          </div>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 self-start sm:self-auto">
          <FileText size={15} weight="bold" />
          <span>
            {totalMatching} {isAr ? 'تمريناً متوفراً' : 'exercices'}
          </span>
        </div>
      </div>

      {/* Sub-Units Navigation Tabs (For Exponential & Logarithmic) */}
      {hasSubUnits && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
              {isAr ? 'الفرز حسب المحور (Sous-Unités):' : 'Filtrer par sous-unité :'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* All button */}
            <button
              onClick={() => setSelectedSubUnit('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubUnit === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm font-semibold'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              data-cursor-interactive="true"
            >
              {isAr ? 'جميع المحاور' : 'Toutes les sous-unités'}
            </button>

            {/* Sub-unit buttons */}
            {unit.subUnits.map((sub) => {
              const isSelected = selectedSubUnit === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubUnit(sub.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm font-semibold'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  data-cursor-interactive="true"
                >
                  {isAr ? sub.nameAr : sub.nameFr}
                </button>
              );
            })}
          </div>

          {/* Sub-unit educational briefing card */}
          {currentSubUnitMeta && (
            <div className="mt-3.5 p-3 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 me-1">
                {isAr ? currentSubUnitMeta.nameAr : currentSubUnitMeta.nameFr} :
              </span>
              <span>{isAr ? currentSubUnitMeta.descriptionAr : currentSubUnitMeta.descriptionFr}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Search & Year Jump Filter */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlass
            size={15}
            weight="bold"
            className="absolute top-1/2 -translate-y-1/2 start-3 text-zinc-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr
                ? 'بحث بكلمة مفتاحية (نهاية، مماس، تزايد مقارن، تكامل...)'
                : 'Rechercher par mot-clé (limite, tangente, TVI, aire...)'
            }
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>

        {/* Year Dropdown Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <Calendar size={14} weight="bold" className="text-zinc-400" />
          <select
            value={selectedYear ?? ''}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
            className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="">{isAr ? 'جميع السنوات (2008–2026)' : 'Toutes les années (2008–2026)'}</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                BAC {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercises Separated by Year and Subject */}
      <div className="mt-8 space-y-10">
        {yearGroups.length === 0 ? (
          <div className="text-center py-16 px-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isAr
                ? 'لا توجد تمارين مطابقة لمعايير البحث الحالية.'
                : 'Aucun exercice ne correspond aux critères de recherche actuels.'}
            </p>
          </div>
        ) : (
          yearGroups.map((yearGroup) => (
            <div
              key={yearGroup.year}
              className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40 p-4 sm:p-6"
            >
              {/* Year Header Badge (As requested in sketch: BAC 2026, BAC 2025...) */}
              <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                  <h2 className="font-mono font-extrabold text-lg sm:text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">
                    BAC {yearGroup.year}
                  </h2>
                </div>

                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {yearGroup.subjects.reduce((sum, s) => sum + s.exercises.length, 0)}{' '}
                  {isAr ? 'تمارين' : 'exercices'}
                </span>
              </div>

              {/* Subject Separation: Distinct sections for Sujet 1 and Sujet 2 */}
              <div className="space-y-6">
                {yearGroup.subjects.map((subject) => (
                  <div
                    key={subject.paperId}
                    className="bg-white dark:bg-zinc-900/90 rounded-xl p-4 sm:p-5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm"
                  >
                    {/* Subject Banner */}
                    <div className="flex items-center justify-between gap-2 mb-4 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                          {subject.paperId}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                          {isAr
                            ? subject.paperOption === 1
                              ? 'الموضوع الأول'
                              : 'الموضوع الثاني'
                            : `Sujet ${subject.paperOption}`}
                        </h3>
                      </div>

                      <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                        {subject.exercises.length} {isAr ? 'تمرين' : 'ex.'}
                      </span>
                    </div>

                    {/* Exercises Grid for this Subject */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {subject.exercises.map((exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          language={language}
                          onOpenPdf={onOpenPdf}
                          isBookmarked={bookmarkedIds.includes(exercise.id)}
                          onToggleBookmark={onToggleBookmark}
                          status={exerciseStatuses[exercise.id] || 'unsolved'}
                          onChangeStatus={onChangeStatus}
                          hideUnitBadge={true}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
