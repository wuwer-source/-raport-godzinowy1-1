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
    <footer className="mt-auto pt-1 flex flex-col justify-end avoid-break">
      {/* Signatures block - anchored with constant fixed height from the footer line */}
      <div className="grid grid-cols-3 gap-3 pt-2 mb-2 min-h-[64px] items-end avoid-break">
        {/* Date block: węższa linia, wyśrodkowana większa czcionka, z możliwością usunięcia daty */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[155px] min-h-[40px] print:min-h-[34px] flex items-end justify-center border-b border-slate-900 pb-0.5 relative group">
            {isPreview ? (
              <span className="text-[10pt] print:text-[9.5pt] font-semibold text-slate-900 text-center min-h-[20px]">
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
                    className="w-full text-center text-[10pt] font-semibold text-slate-900 bg-transparent border-0 outline-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="hidden print:block text-[9.5pt] font-semibold text-slate-950 text-center min-h-[18px]">
                  {reportDate ? formatDatePL(reportDate) : ''}
                </div>
              </>
            )}
          </div>
          <div className="mt-1 text-[8.2pt] font-extrabold text-[#0f2742] leading-tight">
            Data
          </div>
          <div className="text-[7pt] text-slate-500 italic leading-tight">
            Date
          </div>
        </div>

        {/* Contractor signature - present on EVERY page */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[180px] min-h-[40px] print:min-h-[34px] border-b border-slate-900">
            {/* Signature line space */}
          </div>
          <div className="mt-1 text-[8.2pt] font-extrabold text-[#0f2742] leading-tight">
            Podpis wykonawcy
          </div>
          <div className="text-[7pt] text-slate-500 italic leading-tight">
            Contractor signature
          </div>
        </div>

        {/* Employer stamp & signature - present ONLY on the last page with fixed height from footer */}
        <div className={`flex flex-col items-center text-center ${isLastPage ? '' : 'invisible'}`}>
          <div className="w-[190px] min-h-[40px] print:min-h-[34px] border-b border-slate-900">
            {/* Stamp and signature line space */}
          </div>
          <div className="mt-1 text-[8.2pt] font-extrabold text-[#0f2742] leading-tight">
            Pieczątka i podpis zlecającego
          </div>
          <div className="text-[7pt] text-slate-500 italic leading-tight">
            Stamp and signature of Employer
          </div>
        </div>
      </div>

      {/* Document Footer: Visible both on screen and print, always shows real page numbering on EVERY page */}
      <div className="mt-1.5 pt-1 border-t border-slate-300 text-slate-600 text-[7.5pt] flex justify-between items-center px-1 font-mono">
        <div>
          <span>Nr raportu: </span>
          <strong className="text-slate-800 font-bold tracking-wider">
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
