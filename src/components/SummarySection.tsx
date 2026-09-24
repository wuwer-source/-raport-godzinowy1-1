import React from 'react';
import { TotalsResult } from '../types';

interface SummarySectionProps {
  totals: TotalsResult;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ totals }) => {
  const cards = [
    { label: 'Delegacja', val: totals.del, desc: 'Godziny w delegacji' },
    { label: 'Biuro', val: totals.biuro, desc: 'Godziny w biurze' },
    { label: 'Weekend / Święto', val: totals.weekendHoliday, desc: 'Łączne godziny w soboty, niedziele oraz święta' },
    { label: 'Razem', val: totals.total, desc: 'Łączny czas rozliczeniowy', highlight: true },
  ];

  return (
    <section className="avoid-break mb-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 print:grid-cols-4 print:gap-1.5">
        {cards.map((c) => {
          const hasVal = c.val > 0;
          return (
            <div
              key={c.label}
              className={`border rounded-lg p-2 text-center flex flex-col justify-between min-h-[50px] transition-colors ${
                c.highlight
                  ? 'bg-blue-50/80 border-blue-300 print:bg-slate-100 print:border-slate-400'
                  : 'bg-slate-50/80 border-slate-300 print:bg-white print:border-slate-300'
              }`}
              title={c.desc}
            >
              <div className="text-[7.8pt] font-bold text-slate-700 uppercase tracking-tight">
                {c.label}
              </div>
              <div
                className={`text-[12pt] font-extrabold tracking-tight leading-tight mt-1 ${
                  c.highlight ? 'text-[#165d9c]' : 'text-[#0f2742]'
                }`}
              >
                {/* On screen */}
                <span className="print:hidden">
                  {c.val.toFixed(2)}{' '}
                  <span className="text-[8pt] font-normal text-slate-500">h</span>
                </span>
                {/* In print: if 0, print COMPLETELY EMPTY so it can be filled by pen! */}
                <span className="hidden print:inline">
                  {hasVal ? `${c.val.toFixed(2)} h` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
