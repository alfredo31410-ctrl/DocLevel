from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs" / "DOCLEVEL_DOCUMENTACION.md"
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT = OUTPUT_DIR / "Documentacion_DocLevel.pdf"


def register_fonts() -> tuple[str, str]:
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


def esc(value: str) -> str:
    value = html.escape(value)
    value = re.sub(r"`([^`]+)`", rf"<font name='{FONT_BOLD}'>\1</font>", value)
    return value


def make_styles():
    styles = getSampleStyleSheet()
    base = ParagraphStyle(
        "DocBase",
        parent=styles["BodyText"],
        fontName=FONT,
        fontSize=9.4,
        leading=13,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=6,
    )
    return {
        "title": ParagraphStyle(
            "DocTitle",
            parent=base,
            fontName=FONT_BOLD,
            fontSize=24,
            leading=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=18,
        ),
        "subtitle": ParagraphStyle(
            "DocSubtitle",
            parent=base,
            fontSize=10.5,
            leading=15,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#475569"),
            spaceAfter=10,
        ),
        "h1": ParagraphStyle(
            "DocH1",
            parent=base,
            fontName=FONT_BOLD,
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#075985"),
            spaceBefore=12,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "DocH2",
            parent=base,
            fontName=FONT_BOLD,
            fontSize=13,
            leading=17,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=9,
            spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "DocH3",
            parent=base,
            fontName=FONT_BOLD,
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#1e3a8a"),
            spaceBefore=7,
            spaceAfter=5,
        ),
        "body": base,
        "bullet": ParagraphStyle(
            "DocBullet",
            parent=base,
            leftIndent=14,
            firstLineIndent=-8,
            spaceAfter=3,
        ),
        "number": ParagraphStyle(
            "DocNumber",
            parent=base,
            leftIndent=18,
            firstLineIndent=-12,
            spaceAfter=3,
        ),
        "code": ParagraphStyle(
            "DocCode",
            parent=base,
            fontName="Courier",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#111827"),
        ),
        "small": ParagraphStyle(
            "DocSmall",
            parent=base,
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#64748b"),
        ),
    }


STYLES = make_styles()


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont(FONT, 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(0.72 * inch, 0.45 * inch, "DocLevel - Documentación operativa")
    canvas.drawRightString(7.78 * inch, 0.45 * inch, f"Página {doc.page}")
    canvas.restoreState()


def parse_table(lines: list[str], start: int):
    table_lines = []
    i = start
    while i < len(lines) and lines[i].strip().startswith("|"):
        table_lines.append(lines[i].strip())
        i += 1

    rows = []
    for idx, row in enumerate(table_lines):
        cells = [cell.strip() for cell in row.strip("|").split("|")]
        if idx == 1 and all(set(cell) <= {"-", ":"} for cell in cells):
            continue
        rows.append(cells)
    return rows, i


def table_to_flowable(rows: list[list[str]]):
    if not rows:
        return []
    max_cols = max(len(row) for row in rows)
    normalized = [row + [""] * (max_cols - len(row)) for row in rows]
    data = [[Paragraph(esc(cell), STYLES["body"]) for cell in row] for row in normalized]
    widths = [6.8 * inch / max_cols] * max_cols
    table = Table(data, colWidths=widths, hAlign="LEFT", repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e0f2fe")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("FONTNAME", (0, 0), (-1, 0), FONT_BOLD),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return [table, Spacer(1, 8)]


def build_story(markdown: str):
    story = []
    lines = markdown.splitlines()
    i = 0
    paragraph_buffer: list[str] = []
    in_code = False
    code_buffer: list[str] = []

    def flush_paragraph():
        nonlocal paragraph_buffer
        if paragraph_buffer:
            text = " ".join(line.strip() for line in paragraph_buffer).strip()
            if text:
                story.append(Paragraph(esc(text), STYLES["body"]))
            paragraph_buffer = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            flush_paragraph()
            if not in_code:
                in_code = True
                code_buffer = []
            else:
                in_code = False
                story.append(
                    Preformatted(
                        "\n".join(code_buffer),
                        STYLES["code"],
                        maxLineLength=95,
                    )
                )
                story.append(Spacer(1, 8))
            i += 1
            continue

        if in_code:
            code_buffer.append(line)
            i += 1
            continue

        if not stripped:
            flush_paragraph()
            i += 1
            continue

        if stripped == "---":
            flush_paragraph()
            story.append(Spacer(1, 8))
            i += 1
            continue

        if stripped.startswith("|"):
            flush_paragraph()
            rows, next_i = parse_table(lines, i)
            story.extend(table_to_flowable(rows))
            i = next_i
            continue

        if stripped.startswith("# "):
            flush_paragraph()
            if story:
                story.append(PageBreak())
            story.append(Paragraph(esc(stripped[2:]), STYLES["title"]))
            i += 1
            continue

        if stripped.startswith("## "):
            flush_paragraph()
            story.append(Paragraph(esc(stripped[3:]), STYLES["h1"]))
            i += 1
            continue

        if stripped.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(esc(stripped[4:]), STYLES["h2"]))
            i += 1
            continue

        if stripped.startswith("#### "):
            flush_paragraph()
            story.append(Paragraph(esc(stripped[5:]), STYLES["h3"]))
            i += 1
            continue

        if stripped.startswith("- [ ]"):
            flush_paragraph()
            story.append(Paragraph("☐ " + esc(stripped[5:].strip()), STYLES["bullet"]))
            i += 1
            continue

        if stripped.startswith("- "):
            flush_paragraph()
            story.append(Paragraph("• " + esc(stripped[2:].strip()), STYLES["bullet"]))
            i += 1
            continue

        if re.match(r"^\d+\.\s+", stripped):
            flush_paragraph()
            story.append(Paragraph(esc(stripped), STYLES["number"]))
            i += 1
            continue

        paragraph_buffer.append(line)
        i += 1

    flush_paragraph()
    return story


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    markdown = SOURCE.read_text(encoding="utf-8")
    story = build_story(markdown)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.72 * inch,
        leftMargin=0.72 * inch,
        topMargin=0.72 * inch,
        bottomMargin=0.72 * inch,
        title="Documentación operativa de DocLevel",
        author="DocLevel",
    )
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(OUTPUT)


if __name__ == "__main__":
    main()
