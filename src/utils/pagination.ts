import { ReportRow } from '../types';

export interface PageBreakdown {
  pageNumber: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  rows: ReportRow[];
  startRowIndex: number;
}

// Geometry constants for A4 sheet at 96 DPI:
// Printable page height inside padding (296mm - 14mm padding) = ~1065px
export const PAGE_CONTENT_HEIGHT = 1065;

// Static top block heights:
// Page 1: CompanyHeader (~88px) + MetaGrid (~138px) + Title (~22px) + TableHeader (~24px) = 272px
export const PAGE_1_TOP_HEIGHT = 272;

// Continuation Page: Header banner (~28px) + TableHeader (~24px) = 52px
export const CONTINUATION_TOP_HEIGHT = 52;

// Bottom fixed elements:
// FooterSignatures (Signatures grid ~62px + footer line ~20px) = ~82px
export const FOOTER_HEIGHT = 82;

// SummarySection (DELEGACJA, BIURO, WEEKEND / ŚWIĘTO, RAZEM cards) = ~46px
export const SUMMARY_HEIGHT = 46;

// Minimum safe distance 'X' between the last row / SummarySection and FooterSignatures
// As requested by user:
// "Jeśli zawęzi się do wartości x czyli jest blisko ustal ta wartość sam tak żeby był miejsce na podpis i pieczatke.
// Jeśli ta wartość zostanie przekroczona to tabela jest generowana na nowej stronie"
export const MIN_DISTANCE_X = 40;

export function getEstimatedRowHeight(
  row: ReportRow,
  measuredHeights?: Record<string, number>
): number {
  if (measuredHeights && measuredHeights[row.id] && measuredHeights[row.id] >= 22) {
    return measuredHeights[row.id];
  }
  if (row.rowHeight && row.rowHeight >= 22) {
    return row.rowHeight;
  }
  // Calculate based on line breaks and text length
  const text = row.description || '';
  if (!text) return 22;

  const lines = text.split('\n');
  let visualLines = 0;
  for (const line of lines) {
    visualLines += Math.max(1, Math.ceil(line.length / 40));
  }
  return Math.max(22, 22 + (visualLines - 1) * 14);
}

export function computePages(
  rows: ReportRow[],
  measuredHeights?: Record<string, number>
): PageBreakdown[] {
  if (rows.length === 0) {
    return [
      {
        pageNumber: 1,
        totalPages: 1,
        isFirst: true,
        isLast: true,
        rows: [],
        startRowIndex: 0,
      },
    ];
  }

  // Calculate each row's height
  const rowHeights = rows.map((r) => getEstimatedRowHeight(r, measuredHeights));
  const totalRowsHeight = rowHeights.reduce((sum, h) => sum + h, 0);

  // Check if ALL rows fit on Page 1 (with SummarySection + MIN_DISTANCE_X + FooterSignatures):
  // Distance from Summary to Footer = PAGE_CONTENT_HEIGHT - PAGE_1_TOP_HEIGHT - totalRowsHeight - SUMMARY_HEIGHT - FOOTER_HEIGHT
  const distanceOnSinglePage =
    PAGE_CONTENT_HEIGHT - PAGE_1_TOP_HEIGHT - totalRowsHeight - SUMMARY_HEIGHT - FOOTER_HEIGHT;

  if (distanceOnSinglePage >= MIN_DISTANCE_X) {
    // Fits comfortably on exactly 1 single page!
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

  // Otherwise, distance shrank below X! We need multiple pages.
  const chunks: { rows: ReportRow[]; startRowIndex: number }[] = [];
  let remainingRows = [...rows];
  let remainingHeights = [...rowHeights];
  let currentIndex = 0;
  let isFirstPage = true;

  while (remainingRows.length > 0) {
    const topHeight = isFirstPage ? PAGE_1_TOP_HEIGHT : CONTINUATION_TOP_HEIGHT;

    // Check if ALL remaining rows could fit on this page as the LAST page:
    const remainingTotalHeight = remainingHeights.reduce((sum, h) => sum + h, 0);
    const distanceIfLast =
      PAGE_CONTENT_HEIGHT - topHeight - remainingTotalHeight - SUMMARY_HEIGHT - FOOTER_HEIGHT;

    if (distanceIfLast >= MIN_DISTANCE_X) {
      // All remaining rows fit on this final page!
      chunks.push({
        rows: remainingRows,
        startRowIndex: currentIndex,
      });
      break;
    }

    // Otherwise, this page cannot be the last page. Fill it with as many rows as possible without SummarySection,
    // ensuring at least MIN_DISTANCE_X from the last row on this page to FooterSignatures.
    const maxAllowedRowsHeight =
      PAGE_CONTENT_HEIGHT - topHeight - FOOTER_HEIGHT - MIN_DISTANCE_X;

    let accumulatedHeight = 0;
    let countForThisPage = 0;

    for (let i = 0; i < remainingRows.length; i++) {
      if (accumulatedHeight + remainingHeights[i] <= maxAllowedRowsHeight) {
        accumulatedHeight += remainingHeights[i];
        countForThisPage++;
      } else {
        break;
      }
    }

    // Safety: ensure at least 1 row moves forward to avoid infinite loop
    if (countForThisPage === 0) {
      countForThisPage = 1;
    }

    chunks.push({
      rows: remainingRows.slice(0, countForThisPage),
      startRowIndex: currentIndex,
    });

    remainingRows = remainingRows.slice(countForThisPage);
    remainingHeights = remainingHeights.slice(countForThisPage);
    currentIndex += countForThisPage;
    isFirstPage = false;
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
