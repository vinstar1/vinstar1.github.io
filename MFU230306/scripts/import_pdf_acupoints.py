import csv
import json
import os
import re
import sys
from html import unescape
from pathlib import Path

from openpyxl import Workbook


ROOT = Path(__file__).resolve().parents[1]
OCR_JSON = ROOT / "output" / "layout_parsing_result.json"
DATA_JS = ROOT / "data.js"
OUTPUT_JSON = ROOT / "output" / "acupoints_extracted.json"
OUTPUT_CSV = ROOT / "output" / "acupoints_extracted.csv"
OUTPUT_XLSX = ROOT / "output" / "acupoints_extracted.xlsx"


def strip_html(value: str) -> str:
    value = unescape(value or "")
    value = re.sub(r"<[^>]+>", " ", value)
    value = value.replace("&nbsp;", " ")
    value = re.sub(r"\$\s*\\underline\{\\text\{", "", value)
    value = value.replace("\\underline{\\text{", "")
    value = value.replace("\\text{", "")
    value = value.replace("}}", "")
    value = value.replace("{", "")
    value = value.replace("}", "")
    value = value.replace("\\", "")
    value = value.replace("$", "")
    value = value.replace("✓", "")
    value = re.sub(r"\s+", " ", value)
    return value.strip(" :\n\t")


def normalize_mfu(value: str) -> str:
    value = strip_html(value)
    value = re.split(r"\s+[\u4e00-\u9fff]", value, maxsplit=1)[0]
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"\s*([ar])$", r" \1", value, flags=re.I)
    value = value.replace("PVr", "PV r")
    value = value.replace("CLr", "CL r")
    value = value.replace("THr", "TH r")
    value = value.replace("LUr", "LU r")
    if "-" in value:
        prefix, suffix = value.split("-", 1)
        tokens = suffix.split()
        if len(tokens) >= 2 and tokens[0].isupper() and len(tokens[1]) == 1 and tokens[1].isupper():
            tokens[0] = tokens[0] + tokens[1]
            del tokens[1]
            value = f"{prefix}-{' '.join(tokens)}"
    return value


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = re.sub(r"_+", "_", value).strip("_")
    return value or "acu"


def parse_table_rows(table_html: str):
    rows = []
    for row_html in re.findall(r"<tr>(.*?)</tr>", table_html, flags=re.S):
        cells = [strip_html(cell) for cell in re.findall(r"<td[^>]*>(.*?)</td>", row_html, flags=re.S)]
        cells = [cell for cell in cells if cell]
        if cells:
            rows.append(cells)
    return rows


def build_record_from_rows(rows, page_index, order_index):
    record = {
        "id": "",
        "mfu": "",
        "name": "",
        "meridian": "",
        "cc": "",
        "patient": "",
        "therapist": "",
        "notes": "",
        "page": page_index + 1,
        "order": order_index,
    }

    for cells in rows:
        key = cells[0]
        value = " ".join(cells[1:]).strip() if len(cells) > 1 else ""
        if key == "MFU":
            record["mfu"] = normalize_mfu(value)
        elif key == "CC":
            record["cc"] = value
        elif key == "患者":
            record["patient"] = value
        elif key == "治疗师":
            record["therapist"] = value
        elif key.startswith("NOTES"):
            record["notes"] = value

    record["name"] = record["mfu"]
    record["id"] = f"acu_{slugify(record['mfu'])}"
    return record


def merge_split_tables(table_rows_list):
    merged = []
    pending = None

    for rows in table_rows_list:
        keys = [row[0] for row in rows if row]
        has_mfu = "MFU" in keys
        has_treatment = "患者" in keys or "治疗师" in keys

        if has_mfu and not has_treatment:
            pending = list(rows)
            continue

        if pending and has_treatment and not has_mfu:
            merged.append(pending + rows)
            pending = None
            continue

        if pending:
            merged.append(pending)
            pending = None

        merged.append(rows)

    if pending:
        merged.append(pending)

    return merged


def extract_records():
    with OCR_JSON.open("r", encoding="utf-8") as f:
        result = json.load(f)["result"]["layoutParsingResults"]

    records = []

    for page_index, item in enumerate(result):
        text = item["markdown"]["text"]
        table_html_list = re.findall(r"(<table.*?</table>)", text, flags=re.S)
        if not table_html_list:
            continue

        table_rows_list = [parse_table_rows(table_html) for table_html in table_html_list]
        combined_tables = merge_split_tables(table_rows_list)

        page_records = []
        for order_index, rows in enumerate(combined_tables, start=1):
            record = build_record_from_rows(rows, page_index, order_index)
            if record["mfu"]:
                page_records.append(record)

        notes_matches = [strip_html(match) for match in re.findall(r"NOTES:\s*([^\n<]+)", text)]
        notes_matches = [note for note in notes_matches if note and note != "___"]

        if len(notes_matches) == 1 and len(page_records) == 1:
            page_records[0]["notes"] = notes_matches[0]
        elif len(notes_matches) == len(page_records):
            for record, note in zip(page_records, notes_matches):
                record["notes"] = note
        elif notes_matches and page_records:
            page_records[-1]["notes"] = notes_matches[-1]

        records.extend(page_records)

    deduped = []
    seen = set()
    for record in records:
        key = (record["mfu"], record["cc"], record["patient"], record["therapist"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(record)

    return deduped


def save_outputs(records):
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    with OUTPUT_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["id", "mfu", "name", "meridian", "cc", "patient", "therapist", "notes", "page", "order"],
        )
        writer.writeheader()
        writer.writerows(records)

    wb = Workbook()
    ws = wb.active
    ws.title = "Acupoints"
    headers = ["id", "mfu", "name", "meridian", "cc", "patient", "therapist", "notes", "page", "order"]
    ws.append(headers)
    for record in records:
        ws.append([record.get(header, "") for header in headers])
    wb.save(OUTPUT_XLSX)


def format_js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def render_acupoints_js(records):
    lines = []
    for record in records:
        lines.append(f"        {format_js_string(record['id'])}: {{")
        lines.append(f"            id: {format_js_string(record['id'])},")
        lines.append(f"            mfu: {format_js_string(record['mfu'])},")
        lines.append(f"            name: {format_js_string(record['name'])},")
        lines.append(f"            meridian: {format_js_string(record['meridian'])},")
        lines.append(f"            cc: {format_js_string(record['cc'])},")
        lines.append("            treatment: {")
        lines.append(f"                patient: {format_js_string(record['patient'])},")
        lines.append(f"                therapist: {format_js_string(record['therapist'])}")
        lines.append("            },")
        lines.append(f"            notes: {format_js_string(record['notes'])}")
        lines.append("        },")
    if lines:
        lines[-1] = lines[-1].rstrip(",")
    return "\n".join(lines)


def update_data_js(records):
    source = DATA_JS.read_text(encoding="utf-8")
    acupoints_block = render_acupoints_js(records)
    updated = re.sub(
        r"(\n\s*acupoints:\s*\{)(.*?)(\n\s*\}\n\};\s*$)",
        rf"\1\n{acupoints_block}\3",
        source,
        flags=re.S,
    )
    if updated == source:
        raise RuntimeError("Failed to update data.js acupoints block")
    DATA_JS.write_text(updated, encoding="utf-8")


def main():
    if not OCR_JSON.exists():
        raise FileNotFoundError(f"Missing OCR JSON: {OCR_JSON}")

    records = extract_records()
    if not records:
        raise RuntimeError("No acupoint records extracted from OCR output")

    save_outputs(records)
    update_data_js(records)
    print(f"records={len(records)}")
    print(f"xlsx={OUTPUT_XLSX}")
    print(f"json={OUTPUT_JSON}")
    print(f"csv={OUTPUT_CSV}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
