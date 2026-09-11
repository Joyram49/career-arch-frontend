/**
 * Strips HTML tags and collapses whitespace/entities down to plain text.
 * Used to validate TipTap output ("<p>&nbsp;</p>" is visually empty even
 * though the raw HTML string has non-zero length) — never trust
 * `html.length` or `html.trim().length` alone for a rich-text field.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
