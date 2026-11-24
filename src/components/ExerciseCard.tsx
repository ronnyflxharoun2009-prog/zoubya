import React, { useState } from 'react';
import {
  Copy,
  Check,
  ArrowSquareOut,
  FilePdf,
  BookmarkSimple,
  BookOpen,
  CheckCircle,
} from '@phosphor-icons/react';
import { ExerciseWithMeta, Language, ExerciseStatus } from '../types/bac';
import { getActiveUnitById, getAssetUrl } from '../data/bacData';

interface ExerciseCardProps {
  exercise: ExerciseWithMeta;
  language: Language;
  onOpenPdf: (
    pdfUrl: string,
    initialPage: number,
    title: string,
    subjectPage?: number,
    solutionPage?: number
  ) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  status?: ExerciseStatus;
  onChangeStatus?: (id: string, status: ExerciseStatus) => void;
  hideUnitBadge?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  language,
  onOpenPdf,
  isBookmarked = false,
  onToggleBookmark,
  status = 'unsolved',
  onChangeStatus,
  hideUnitBadge = false,
}) => {
  const [copied, setCopied] = useState(false);
  const isAr = language === 'ar';
  const activeUnit = exercise.activeUnitId ? getActiveUnitById(exercise.activeUnitId) : undefined;
  const resolvedPdfUrl = getAssetUrl(exercise.pdfUrl);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(exercise.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const cycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onChangeStatus) return;
    const nextStatus: Record<ExerciseStatus, ExerciseStatus> = {
      unsolved: 'in_progress',
      in_progress: 'mastered',
      mastered: 'unsolved',
    };
    onChangeStatus(exercise.id, nextStatus[status]);
  };

  const getSubUnitLabel = (subId: string) => {
    if (subId === 'limites') return isAr ? 'نهايات' : 'Limites';
    if (subId === 'derivabilite_continuite') return isAr ? 'اشتقاقية واستمرارية' : 'Dérivabilité & Continuité';
    if (subId === 'croissance_comparee_etude') return isAr ? 'تزايد مقارن ودراسة دوال' : 'Croissance comparée';
    return subId;
  };

  return (
    <div
      className={`group bg-white dark:bg-zinc-900 border rounded-xl p-4 sm:p-5 transition-all shadow-sm flex flex-col justify-between ${
        status === 'mastered'
          ? 'border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-500/[0.02]'
          : status === 'in_progress'
          ? 'border-amber-500/50 dark:border-amber-500/40'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
      }`}
      data-cursor-interactive="true"
    >
      <div>
        {/* Header strip: ID, Bookmark, Status toggle, Unit Code, Points */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Paper and Exercise ID */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 tracking-tight">
              {exercise.id}
            </span>
            <button
              onClick={handleCopyId}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              title={isAr ? 'نسخ معرف التمرين' : 'Copier l\'identifiant'}
            >
              {copied ? (
                <Check size={14} weight="bold" className="text-emerald-500" />
              ) : (
                <Copy size={14} weight="bold" />
              )}
            </button>
          </div>

          {/* Quick status & Bookmark buttons & Points */}
          <div className="flex items-center gap-1.5">
            {/* Status cycle button */}
            {onChangeStatus && (
              <button
                onClick={cycleStatus}
                className={`p-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1 ${
                  status === 'mastered'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : status === 'in_progress'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
                title={
                  status === 'mastered'
                    ? isAr
                      ? 'تم الحل بنجاح (انقر لتغيير الحالة)'
                      : 'Résolu (cliquez pour modifier)'
                    : status === 'in_progress'
                    ? isAr
                      ? 'قيد المراجعة والحل'
                      : 'En cours de résolution'
                    : isAr
                    ? 'لم يُحل بعد'
                    : 'Non résolu'
                }
              >
                <CheckCircle
                  size={15}
                  weight={status === 'mastered' ? 'fill' : 'bold'}
                />
              </button>
            )}

            {/* Bookmark */}
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(exercise.id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-amber-500 dark:text-amber-400 bg-amber-500/10'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
                title={isAr ? 'إضافة إلى قائمة المراجعة المفضلة' : 'Ajouter aux favoris'}
              >
                <BookmarkSimple
                  size={16}
                  weight={isBookmarked ? 'fill' : 'bold'}
                />
              </button>
            )}

            {/* Points badge */}
            <span className="font-mono text-xs px-2 py-0.5 rounded-md font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              {exercise.scorePoints.toString().padStart(2, '0')} {isAr ? 'نقاط' : 'pts'}
            </span>
          </div>
        </div>

        {/* Paper title info */}
        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {isAr ? `بكالوريا ${exercise.paperYear}` : `Bac ${exercise.paperYear}`}
          </span>
          <span>•</span>
          <span>
            {isAr
              ? exercise.paperOption === 1
                ? 'الموضوع الأول'
                : 'الموضوع الثاني'
              : `Sujet ${exercise.paperOption}`}
          </span>
          <span>•</span>
          <span>
            {isAr ? `التمرين ${exercise.exerciseNumber}` : `Exercice ${exercise.exerciseNumber}`}
          </span>
          {exercise.paperSession !== 'normale' && (
            <>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {isAr ? 'دورة استثنائية' : 'Rattrapage'}
              </span>
            </>
          )}
        </div>

        {/* Exercise Title */}
        <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 leading-snug mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          {isAr ? exercise.titleAr : exercise.titleFr}
        </h3>

        {/* Sub-unit / active unit badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {!hideUnitBadge && activeUnit && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeUnit.badge}</span>
              <span>{isAr ? activeUnit.nameAr : activeUnit.nameFr}</span>
            </span>
          )}

          {exercise.subUnits && exercise.subUnits.map((subId) => (
            <span
              key={subId}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
            >
              {getSubUnitLabel(subId)}
            </span>
          ))}
        </div>

        {/* Description / Content detail */}
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
          {isAr ? exercise.descriptionAr : exercise.descriptionFr}
        </p>

        {/* Keywords */}
        {exercise.keywords && exercise.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {exercise.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800/60"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons: View Subject Page & View Solution Page */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Open subject page in modal */}
          <button
            onClick={() =>
              onOpenPdf(
                resolvedPdfUrl,
                exercise.pageStart,
                `${exercise.paperId} - ${isAr ? `نص التمرين ${exercise.exerciseNumber}` : `Sujet Exercice ${exercise.exerciseNumber}`}`,
                exercise.pageStart,
                exercise.solutionPageStart
              )
            }
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
          >
            <BookOpen size={14} weight="bold" />
            <span>{isAr ? 'نص التمرين' : 'Voir le sujet'}</span>
            <span className="font-mono text-[10px] opacity-75">
              (p.{exercise.pageStart})
            </span>
          </button>

          {/* Open solution page in modal */}
          <button
            onClick={() =>
              onOpenPdf(
                resolvedPdfUrl,
                exercise.solutionPageStart,
                `${exercise.paperId} - ${isAr ? `الحل النموذجي للتمرين ${exercise.exerciseNumber}` : `Corrigé Exercice ${exercise.exerciseNumber}`}`,
                exercise.pageStart,
                exercise.solutionPageStart
              )
            }
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            <ArrowSquareOut size={14} weight="bold" />
            <span>{isAr ? 'الحل النموذجي' : 'Voir le corrigé'}</span>
            <span className="font-mono text-[10px] opacity-75">
              (p.{exercise.solutionPageStart})
            </span>
          </button>
        </div>

        {/* Direct download PDF */}
        <a
          href={resolvedPdfUrl}
          download={exercise.pdfFileName}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={isAr ? 'تحميل ملف PDF الأصلي' : 'Télécharger le PDF original'}
        >
          <FilePdf size={18} weight="bold" />
        </a>
      </div>
    </div>
  );
};
