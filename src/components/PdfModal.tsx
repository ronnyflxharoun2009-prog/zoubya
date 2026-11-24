import React, { useEffect, useState } from 'react';
import {
  X,
  ArrowSquareOut,
  DownloadSimple,
  CaretLeft,
  CaretRight,
  BookOpen,
  CheckCircle,
} from '@phosphor-icons/react';
import { Language } from '../types/bac';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  initialPage: number;
  subjectPage?: number;
  solutionPage?: number;
  title: string;
  language: Language;
}

export const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  initialPage,
  subjectPage,
  solutionPage,
  title,
  language,
}) => {
  const isAr = language === 'ar';
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Sync state whenever modal opens or initialPage changes
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentPage((p) => p + 1);
      } else if (e.key === 'ArrowLeft') {
        setCurrentPage((p) => Math.max(1, p - 1));
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pdfWithPage = `${pdfUrl}#page=${currentPage}&zoom=110`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-5xl h-[94vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 gap-2">
          {/* Title & Page Indicators */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-mono tracking-tight truncate max-w-xs sm:max-w-md">
              {title}
            </h2>
          </div>

          {/* Quick Page Jump Shortcuts */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {subjectPage && (
              <button
                onClick={() => setCurrentPage(subjectPage)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                  currentPage === subjectPage
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-bold'
                    : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <BookOpen size={12} weight="bold" />
                <span>{isAr ? 'نص الموضوع' : 'Sujet'}</span>
                <span className="opacity-75">p.{subjectPage}</span>
              </button>
            )}

            {solutionPage && (
              <button
                onClick={() => setCurrentPage(solutionPage)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                  currentPage === solutionPage
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-bold'
                    : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <CheckCircle size={12} weight="bold" className="text-emerald-500" />
                <span>{isAr ? 'الحل وسلم التنقيط' : 'Corrigé'}</span>
                <span className="opacity-75">p.{solutionPage}</span>
              </button>
            )}

            {/* Stepper controls */}
            <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-1 py-0.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 text-zinc-500"
                title={isAr ? 'الصفحة السابقة (←)' : 'Page précédente (←)'}
              >
                <CaretLeft size={13} weight="bold" />
              </button>
              <span className="px-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                {isAr ? `ص ${currentPage}` : `p. ${currentPage}`}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 text-zinc-500"
                title={isAr ? 'الصفحة التالية (→)' : 'Page suivante (→)'}
              >
                <CaretRight size={13} weight="bold" />
              </button>
            </div>
          </div>

          {/* Window action buttons */}
          <div className="flex items-center gap-1.5">
            <a
              href={pdfUrl}
              download
              className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title={isAr ? 'تحميل ملف PDF كاملاً' : 'Télécharger le PDF complet'}
            >
              <DownloadSimple size={16} weight="bold" />
            </a>

            <a
              href={pdfWithPage}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title={isAr ? 'فتح في تبويب مستقل' : 'Ouvrir dans un nouvel onglet'}
            >
              <ArrowSquareOut size={16} weight="bold" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title={isAr ? 'إغلاق (Esc)' : 'Fermer (Esc)'}
            >
              <X size={17} weight="bold" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewport */}
        <div className="flex-1 bg-zinc-950 relative">
          <iframe
            key={pdfWithPage}
            src={pdfWithPage}
            title={title}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
