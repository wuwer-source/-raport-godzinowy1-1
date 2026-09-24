import React from 'react';
import { Dictionaries, ReportHeader, ReportRow, TotalsResult } from '../types';
import { computePages, PageBreakdown } from '../utils/pagination';
import { CompanyHeader } from './CompanyHeader';
import { MetaGrid } from './MetaGrid';
import { SummarySection } from './SummarySection';
import { FooterSignatures } from './FooterSignatures';
import { calculateHours } from '../utils/calculations';
import { formatDatePL, getDayInfo } from '../utils/dateUtils';

interface DocumentPagesViewProps {
  header: ReportHeader;
  rows: ReportRow[];
  totals: TotalsResult;
  dictionaries: Dictionaries;
  isDocumentGenerated: boolean;
  onGenerateDocNumber: () => void;
  onChangeHeader?: (field: keyof ReportHeader, value: string) => void;
  showScreenPageBadges?: boolean;
}

export const DocumentPagesView: React.FC<DocumentPagesViewProps> = ({
  header,
  rows,
  totals,
  dictionaries,
  isDocumentGenerated,
  onGenerateDocNumber,
  onChangeHeader,
  showScreenPageBadges = true,
}) => {
  const pages: PageBreakdown[] = computePages(rows);

  const renderTableRows = (pageRows: ReportRow[], startIdx: number) => {
    return (
      <div className="w-full overflow-x-auto print:overflow-visible p-px">
        <table className="doc-table w-full border-collapse border border-slate-500 text-slate-800 text-[8.5pt] rounded-none">
          <thead>
            <tr className="bg-[#dfe8f2] text-[#0f2742]">
              <th className="w-[12%] py-1.5 px-1 text-center font-bold border border-slate-400 rounded-none">
                Tryb pracy
                <span className="block text-[6.8pt] font-medium text-slate-600 italic">Work mode</span>
              </th>
              <th className="w-[13%] py-1.5 px-1 text-center font-bold border border-slate-400 rounded-none">
                Data
                <span className="block text-[6.8pt] font-medium text-slate-600 italic">Date</span>
              </th>
              <th className="w-[6%] py-1.5 px-0.5 text-center font-bold border border-slate-400 rounded-none">
                Wkd
                <span className="block text-[6.8pt] font-medium text-slate-600 italic">Hol.</span>
              </th>
              <th className="w-[10%] py-1.5 px-0.5 text-center font-bold border border-slate-400 rounded-none">
                Od
                <span className="block text-[6.8pt] font-medium text-slate-600 italic">From</span>
              </th>
              <th className="w-[10%] py-1.5 px-0.5 text-center font-bold border border-slate-400 rounded-none">
                Do
                <span className="block text-[6.8pt] font-medium text-slate-600 italic">To</span>
              </th>
              <th className="w-[8%] py-1.5 px-0.5 text-center font-bold border border-slate-400 rounded-none">
                Suma
                <span className="block text-[6.8pt] font-medium text-slate-600 italic">Hours</span>
              </th>
              <th className="w-[41%] py-1.5 px-2 text-left font-bold border border-slate-400 rounded-none">
                Opis wykonanych prac
                <span className="block text-[6.8pt] font-medium text-slate-600 italic">Description of work</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, idx) => {
              const h = calculateHours(row);
              const dayInfo = getDayInfo(row.date);
              const hasHours = h > 0;

              return (
                <tr
                  key={row.id}
                  className={`border-b border-slate-300 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 print:bg-white'
                  }`}
                >
                  <td className="py-1 px-1 text-center border border-slate-300 align-middle font-medium">
                    {row.category === 'del' ? 'Delegacja' : row.category === 'biuro' ? 'Biuro' : ''}
                  </td>
                  <td className="py-1 px-1 text-center border border-slate-300 align-middle font-medium">
                    {row.date ? formatDatePL(row.date) : ''}
                  </td>
                  <td
                    className={`py-1 px-1 text-center border border-slate-300 align-middle font-bold ${
                      dayInfo.holiday
                        ? 'text-amber-800'
                        : dayInfo.weekend
                        ? 'text-blue-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {row.date && dayInfo.holiday ? 'ŚW' : row.date && dayInfo.weekend ? '✓' : ''}
                  </td>
                  <td className="py-1 px-1 text-center border border-slate-300 align-middle font-mono text-[8.5pt]">
                    {row.from || ''}
                  </td>
                  <td className="py-1 px-1 text-center border border-slate-300 align-middle font-mono text-[8.5pt]">
                    {row.to || ''}
                  </td>
                  <td className="py-1 px-1 text-center border border-slate-300 align-middle font-bold font-mono text-[8.5pt]">
                    {hasHours ? h.toFixed(2) : ''}
                  </td>
                  <td className="py-1 px-2 border border-slate-300 align-middle text-left font-normal text-[8pt]">
                    {row.description || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full">
      {pages.map((page, pIdx) => (
        <React.Fragment key={`page-${page.pageNumber}`}>
          {/* Individual A4 Page Sheet */}
          <div
            className="a4-print-page w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl rounded-sm p-5 sm:p-7 md:p-8 mx-auto flex flex-col justify-between mb-8 print:mb-0 print:shadow-none print:rounded-none print:p-0 print:border-none print:w-full print:h-[276mm] print:max-h-[276mm]"
          >
            {/* Visual Screen Badge showing page info in preview mode */}
            {showScreenPageBadges && (
              <div className="no-print flex justify-between items-center pb-2 mb-3 border-b border-dashed border-slate-300 text-[8pt] font-mono text-slate-500">
                <span className="font-semibold text-slate-600">Arkusz A4 — Podgląd wydruku / PDF</span>
                <span className="font-extrabold text-[#165d9c] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  STRONA {page.pageNumber} z {page.totalPages}
                </span>
              </div>
            )}

            {/* PAGE CONTENT */}
            <div className="flex flex-col flex-1">
              {page.isFirst ? (
                <>
                  {/* First page header */}
                  <CompanyHeader
                    reportNumber={header.report_number}
                    isGenerated={isDocumentGenerated}
                    onGenerate={onGenerateDocNumber}
                  />

                  {/* Project metadata */}
                  <MetaGrid
                    header={header}
                    onChange={onChangeHeader || (() => {})}
                    dictionaries={dictionaries}
                    isPreview={true}
                    disabled={!isDocumentGenerated}
                  />

                  {/* Table title */}
                  <section className="mb-1">
                    <div className="flex justify-between items-center mb-1.5 avoid-break">
                      <div>
                        <span className="text-[10pt] font-extrabold text-[#0f2742]">
                          Rejestr godzin pracy / podróży
                        </span>
                        <span className="ml-1.5 text-[8pt] text-slate-500 italic font-normal">
                          Work / Travel Hours Log
                        </span>
                      </div>
                    </div>

                    {renderTableRows(page.rows, page.startRowIndex)}
                  </section>
                </>
              ) : (
                <>
                  {/* Subsequent page continuation header */}
                  <div className="avoid-break mb-3 pb-2 border-b-2 border-[#165d9c] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[11pt] font-extrabold text-[#0f2742] tracking-tight">
                        WUWER Sp. z o.o.
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-[9pt] font-bold text-slate-700">
                        Rejestr godzin pracy / podróży (kontynuacja)
                      </span>
                    </div>
                    <div className="text-[8.5pt] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Nr raportu: <strong className="text-slate-900 font-bold">{header.report_number || '—'}</strong>
                    </div>
                  </div>

                  {/* Continued Table */}
                  <section className="mb-1">
                    {renderTableRows(page.rows, page.startRowIndex)}
                  </section>
                </>
              )}

              {/* Summary of hours: ALWAYS directly under the last row of the table on the final page */}
              {page.isLast && (
                <div className="avoid-break mt-1 mb-2">
                  <SummarySection totals={totals} />
                </div>
              )}

              {/* Flexible spacer pushing bottom signatures/footer to the end of A4 sheet */}
              <div className="flex-1 min-h-[10px]" />

              {/* Document Signatures and Footer: rendered at the end of EVERY page as requested */}
              <div className="avoid-break mt-auto">
                <FooterSignatures
                  reportDate={header.data_stopka}
                  onReportDateChange={(val) => onChangeHeader && onChangeHeader('data_stopka', val)}
                  reportNumber={header.report_number}
                  isPreview={true}
                  disabled={!isDocumentGenerated}
                  totalPages={page.totalPages}
                  currentPage={page.pageNumber}
                  isLastPage={page.isLast}
                />
              </div>
            </div>
          </div>

          {/* Visual Divider between A4 Sheets (Screen Only) */}
          {pIdx < pages.length - 1 && (
            <div className="no-print my-8 flex items-center justify-center gap-3">
              <div className="h-px bg-slate-400 dark:bg-slate-700 flex-1 max-w-[120px]" />
              <div className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-dashed border-[#165d9c] rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 shadow-md flex items-center gap-2">
                <span className="text-sm">✂️</span>
                <span>Koniec Strony {page.pageNumber}</span>
                <span className="text-slate-400 font-normal">➔</span>
                <span className="text-[#165d9c] dark:text-blue-400 font-extrabold">
                  Początek Strony {page.pageNumber + 1}
                </span>
              </div>
              <div className="h-px bg-slate-400 dark:bg-slate-700 flex-1 max-w-[120px]" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
