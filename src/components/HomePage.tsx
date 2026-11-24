import React from 'react';
import { activeUnits, activeExercises } from '../data/bacData';
import { Language, ActiveCurriculumUnit } from '../types/bac';
import { ArrowRight, ArrowLeft, Sparkle } from '@phosphor-icons/react';

interface HomePageProps {
  language: Language;
  onSelectUnit: (unitId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  onSelectUnit,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const getExerciseCountForUnit = (unitId: string) => {
    return activeExercises.filter((e) => e.activeUnitId === unitId).length;
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-10 md:py-16 px-4 sm:px-6">
      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        {/* Subtle Zen Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{isAr ? 'منهاج 3 ثانوي رياضيات • بكالوريا 2008–2026' : 'Programme 3ème Mathélème • Bac 2008–2026'}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3 leading-tight">
          {isAr ? 'اختر الوحدة للبدء' : 'Sélectionnez une unité'}
        </h1>

        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mb-10 leading-relaxed">
          {isAr
            ? 'مساحة دراسية هادئة وخالية من التشتيت. تمارين البكالوريا مفروزة بدقة حسب المواضيع والمحاور النشطة.'
            : 'Un espace de travail calme et sans distraction. Les exercices du Bac classés par sujets et sous-unités actives.'}
        </p>

        {/* The 3 Centered Unit Buttons (As requested in sketch) */}
        <div className="w-full flex flex-col gap-4 sm:gap-5 max-w-2xl">
          {activeUnits.map((unit: ActiveCurriculumUnit) => {
            const count = getExerciseCountForUnit(unit.id);
            const hasSubUnits = unit.subUnits && unit.subUnits.length > 0;

            return (
              <button
                key={unit.id}
                onClick={() => onSelectUnit(unit.id)}
                className="group relative w-full text-start p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                data-cursor-interactive="true"
              >
                {/* Left side: Badge & Name */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Formula Badge */}
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono font-bold text-xl sm:text-2xl text-zinc-900 dark:text-zinc-100 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-colors">
                    {unit.badge}
                  </div>

                  {/* Texts */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-900 dark:group-hover:text-white">
                        {isAr ? unit.nameAr : unit.nameFr}
                      </h2>
                    </div>

                    {/* Sub-units preview chips */}
                    {hasSubUnits && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {unit.subUnits.map((sub) => (
                          <span
                            key={sub.id}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                          >
                            {isAr ? sub.nameAr : sub.nameFr}
                          </span>
                        ))}
                      </div>
                    )}

                    {!hasSubUnits && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                        {isAr ? unit.descriptionAr : unit.descriptionFr}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Count and Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 w-full sm:w-auto">
                  <div className="text-right">
                    <span className="font-mono text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {count}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 ms-1">
                      {isAr ? 'تمريناً' : 'exercices'}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-colors">
                    <ArrowIcon size={16} weight="bold" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Peaceful Progress Note */}
        <div className="mt-12 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <Sparkle size={14} weight="bold" className="text-amber-500" />
          <span>
            {isAr
              ? 'الوحدات المتبقية (الأعداد المركبة، الحساب، الاحتمالات، الهندسة الفضائية) ستُفعل تدريجياً خلال السنة.'
              : 'Les unités restantes (Nombres complexes, Arithmétique, Probabilités, Espace) seront déployées progressivement.'}
          </span>
        </div>
      </div>
    </div>
  );
};
