import { ReportRow } from '../types';

export interface PageBreakdown {
  pageNumber: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  rows: ReportRow[];
  startRowIndex: number;
}

// Calibrated A4 row limits taking into account that rows are 33% more compact (~23.5px height):
// Page 1 holds Header, MetaGrid, Table, Summary (directly under table), and Signatures/Footer.
export const SINGLE_PAGE_MAX_ROWS = 16; // Single page fits up to 16 rows comfortably
export const MULTI_PAGE_1_MAX_ROWS = 16; // Page 1 of multi-page holds up to 16 rows
export const LAST_PAGE_MAX_ROWS = 22; // Last page has continuation header, rows, Summary, and Signatures/Footer
export const MIDDLE_PAGE_MAX_ROWS = 26; // Middle pages have continuation header, rows, and Signatures/Footer

export function computePages(rows: ReportRow[]): PageBreakdown[] {
  // If 16 or fewer rows, keep everything on exactly 1 single page!
  if (rows.length <= SINGLE_PAGE_MAX_ROWS) {
    return [
      {
        pageNumber: 1,
        totalPages: 1,
        isFirst: true,
        isLast: true,
        rows,
        startRowIndex: 0,
      },
    ];
  }

  const chunks: { rows: ReportRow[]; startRowIndex: number }[] = [];

  // Determine Page 1 rows count:
  // If total rows is e.g. 17-20 rows, split gracefully so page 2 isn't empty
  let p1Count = MULTI_PAGE_1_MAX_ROWS;
  if (rows.length <= MULTI_PAGE_1_MAX_ROWS + 4) {
    p1Count = Math.max(8, Math.ceil(rows.length / 2));
  }

  chunks.push({
    rows: rows.slice(0, p1Count),
    startRowIndex: 0,
  });

  let remaining = rows.slice(p1Count);
  let currentIndex = p1Count;

  while (remaining.length > 0) {
    if (remaining.length <= LAST_PAGE_MAX_ROWS) {
      chunks.push({
        rows: remaining,
        startRowIndex: currentIndex,
      });
      break;
    } else {
      // Middle page
      chunks.push({
        rows: remaining.slice(0, MIDDLE_PAGE_MAX_ROWS),
        startRowIndex: currentIndex,
      });
      remaining = remaining.slice(MIDDLE_PAGE_MAX_ROWS);
      currentIndex += MIDDLE_PAGE_MAX_ROWS;
    }
  }

  const totalPages = chunks.length;
  return chunks.map((c, idx) => ({
    pageNumber: idx + 1,
    totalPages,
    isFirst: idx === 0,
    isLast: idx === totalPages - 1,
    rows: c.rows,
    startRowIndex: c.startRowIndex,
  }));
}
