import io
from pathlib import Path

import openpyxl

from backend.db import ROOT_DIR
from backend.invoices import _latex_escape, _run  # reuse escaping + subprocess helpers

TEMPLATE_PATH = Path(__file__).resolve().parent / "payroll_template.tex"
WORK_DIR = ROOT_DIR / "uploads" / "payslips"

NAME_ALIASES = {"name", "nom", "employee", "employe", "employee name", "nom employe", "nom de l'employe"}
HOURS_ALIASES = {"hours", "heures", "hours worked", "heures travaillees", "total heures", "total hours"}


def parse_pointage(raw: bytes) -> list[dict]:
    """Parse an uploaded Excel timesheet (name + hours columns, in any order)
    and return [{employee_name, hours}, ...]."""
    wb = openpyxl.load_workbook(io.BytesIO(raw), data_only=True)
    sheet = wb.active

    rows = list(sheet.iter_rows(values_only=True))
    if not rows:
        return []

    header = [str(c).strip().lower() if c is not None else "" for c in rows[0]]
    name_col = next((i for i, h in enumerate(header) if h in NAME_ALIASES), 0)
    hours_col = next((i for i, h in enumerate(header) if h in HOURS_ALIASES), 1)

    results = []
    for row in rows[1:]:
        if not row or name_col >= len(row) or hours_col >= len(row):
            continue
        name = row[name_col]
        hours = row[hours_col]
        if not name or hours is None:
            continue
        try:
            hours = float(hours)
        except (TypeError, ValueError):
            continue
        results.append({"employee_name": str(name).strip(), "hours": hours})

    return results


def generate_payslip_pdf(payslip) -> Path:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    number = f"PAY-{payslip.id:05d}"
    replacements = {
        "%%EMPLOYEE_NAME%%": _latex_escape(payslip.employee_name),
        "%%PERIOD_LABEL%%": _latex_escape(payslip.period_label),
        "%%HOURS%%": f"{payslip.hours:.2f}",
        "%%HOURLY_RATE%%": f"{payslip.hourly_rate:.3f}",
        "%%GROSS_TOTAL%%": f"{payslip.gross_total:.3f}",
        "%%CURRENCY%%": _latex_escape(payslip.currency),
        "%%PAYSLIP_NO%%": number,
        "%%ISSUE_DATE%%": payslip.created_at.date().isoformat(),
    }
    for token, value in replacements.items():
        template = template.replace(token, value)

    work_dir = WORK_DIR / number
    work_dir.mkdir(parents=True, exist_ok=True)
    (work_dir / "payslip.tex").write_text(template, encoding="utf-8")

    _run(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", "payslip.tex"], cwd=work_dir)

    pdf_path = work_dir / "payslip.pdf"
    if not pdf_path.is_file():
        raise RuntimeError("PDF was not produced")
    return pdf_path
