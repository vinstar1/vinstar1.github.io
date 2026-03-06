---
name: paddleocr
description: Run PaddleOCR layout parsing against local PDFs and images through the provided HTTP API, save markdown output, and download referenced images. Use when Codex needs to convert a document or image into markdown/layout assets, automate the supplied PaddleOCR endpoint, or troubleshoot/request parameter changes for this OCR workflow.
---

# PaddleOCR

Use the bundled script for API calls instead of rewriting request logic in-line. It handles file encoding, file type detection, response parsing, markdown export, image downloads, and raw JSON capture.

## Quick Start

Run the helper script:

```bash
python3 scripts/paddleocr_layout.py /path/to/file.pdf --output-dir output
```

Pass credentials without hardcoding them into the file:

```bash
PADDLEOCR_TOKEN=your-token python3 scripts/paddleocr_layout.py /path/to/file.pdf
```

Override the endpoint if the deployment changes:

```bash
python3 scripts/paddleocr_layout.py /path/to/image.png --api-url https://example.com/layout-parsing --token your-token
```

## Workflow

1. Choose the input file.
   Supported auto-detection covers PDFs and common image extensions. Use `--file-type pdf` or `--file-type image` only when detection is ambiguous.
2. Run the script with an output directory.
   The script writes markdown files, downloaded markdown images, downloaded `outputImages`, and optional raw JSON into that directory.
3. Inspect the generated markdown.
   Each `layoutParsingResults` item becomes `doc_<index>.md`.
4. Load [references/api.md](references/api.md) only when you need payload details, output layout, or troubleshooting guidance.

## Common Options

- `--token`: API token. Prefer this or `PADDLEOCR_TOKEN`.
- `--api-url`: Layout parsing endpoint. Defaults to the provided deployment URL.
- `--file-type auto|pdf|image`: Force request file type when needed.
- `--orientation`: Set `useDocOrientationClassify=true`.
- `--doc-unwarp`: Set `useDocUnwarping=true`.
- `--chart-recognition`: Set `useChartRecognition=true`.
- `--skip-markdown-images`: Do not download images referenced from markdown.
- `--skip-output-images`: Do not download `outputImages`.
- `--save-json`: Persist the full API response to `result.json`.
- `--dry-run`: Build and validate the payload locally without making the HTTP request.

## Execution Notes

- Install `requests` before use.
- Prefer `--dry-run` first when checking file type detection or output layout in restricted environments.
- Do not hardcode secrets into the skill unless the user explicitly asks for that.
