import React from 'react';
import { formatDatePL } from '../utils/dateUtils';
import { CalendarX } from 'lucide-react';

interface FooterSignaturesProps {
  reportDate: string;
  onReportDateChange: (val: string) => void;
  reportNumber: string;
  isPreview?: boolean;
  disabled?: boolean;
  totalPages?: number;
  currentPage?: number;
  isLastPage?: boolean;
}

export const FooterSignatures: React.FC<FooterSignaturesProps> = ({
  reportDate,
  onReportDateChange,
  reportNumber,
  isPreview = false,
  disabled = false,
  totalPages = 1,
  currentPage = 1,
  isLastPage = true,
}) => {
  return (
    <footer className="w-full flex flex-col justify-end avoid-break">
      {/* Signatures block - ONLY present on the LAST page */}
      {isLastPage && (
        <div className="flex justify-between items-end mb-2 min-h-[52px] px-2 avoid-break">
          {/* Date block: left side of last page */}
          <div className="flex flex-col items-center text-center">
            <div className="w-[170px] min-h-[32px] flex items-end justify-center border-b border-slate-900 pb-0.5 relative group">
              {isPreview ? (
                <span className="text-[9.5pt] font-semibold text-slate-900 text-center min-h-[18px]">
                  {reportDate ? formatDatePL(reportDate) : ''}
                </span>
              ) : (
                <>
                  <div className="no-print w-full flex items-center justify-center gap-1">
                    <input
                      type="date"
                      value={reportDate || ''}
                      disabled={disabled}
                      onChange={(e) => onReportDateChange(e.target.value)}
                      className="w-full text-center text-[9.5pt] font-semibold text-slate-900 bg-transparent border-0 outline-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {reportDate && !disabled && (
                      <button
                        type="button"
                        onClick={() => onReportDateChange('')}
                        title="Wyczyść datę (pozostaw puste do wpisania długopisem)"
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      >
                        <CalendarX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Print only: Clean date text or completely empty for handwriting */}
                  <div className="hidden print:block text-[9pt] font-semibold text-slate-950 text-center min-h-[16px]">
                    {reportDate ? formatDatePL(reportDate) : ''}
                  </div>
                </>
              )}
            </div>
            <div className="mt-1 text-[8pt] font-extrabold text-[#0f2742] leading-tight">
              Data
            </div>
            <div className="text-[6.8pt] text-slate-500 italic leading-tight">
              Date
            </div>
          </div>

          {/* Employer stamp & signature: right side of last page */}
          <div className="flex flex-col items-center text-center">
            <div className="w-[220px] min-h-[32px] border-b border-slate-900">
              {/* Stamp and signature line space */}
            </div>
            <div className="mt-1 text-[8pt] font-extrabold text-[#0f2742] leading-tight">
              Pieczątka i podpis zlecającego
            </div>
            <div className="text-[6.8pt] text-slate-500 italic leading-tight">
              Stamp and signature of Employer
            </div>
          </div>
        </div>
      )}

      {/* Document Footer: Visible both on screen and print, always shows real page numbering on EVERY page */}
      <div className="pt-1 border-t border-slate-400 text-slate-600 text-[7.5pt] flex justify-between items-center px-1 font-mono">
        <div>
          <span>Nr raportu: </span>
          <strong className="text-slate-900 font-bold tracking-wider">
            {reportNumber || '—'}
          </strong>
        </div>
        <div className="text-right">
          <span className="font-semibold text-slate-700">
            {totalPages > 1 ? `Strona ${currentPage}/${totalPages}` : 'Strona 1/1'}
          </span>
        </div>
      </div>
    </footer>
  );
};
