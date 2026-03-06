# PaddleOCR Layout API Reference

## Endpoint

- Default URL: `https://yfo2h8e2j5ddmct0.aistudio-app.com/layout-parsing`
- Method: `POST`
- Headers:
  - `Authorization: token <TOKEN>`
  - `Content-Type: application/json`

## Request Payload

Required fields:

- `file`: Base64-encoded bytes of the local file
- `fileType`: `0` for PDF, `1` for image

Optional fields:

- `useDocOrientationClassify`: Boolean
- `useDocUnwarping`: Boolean
- `useChartRecognition`: Boolean

## Script Outputs

The bundled script writes into the selected output directory:

- `doc_<index>.md`: Markdown extracted from each `layoutParsingResults` entry
- Markdown image files: Downloaded from `result.layoutParsingResults[*].markdown.images`
- `<image_name>_<index>.jpg`: Downloaded from `result.layoutParsingResults[*].outputImages`
- `result.json`: Full API response when `--save-json` is enabled

## Typical Commands

PDF:

```bash
PADDLEOCR_TOKEN=your-token python3 scripts/paddleocr_layout.py ./input.pdf --output-dir ./output
```

Image:

```bash
python3 scripts/paddleocr_layout.py ./scan.jpg --file-type image --token your-token
```

Local smoke test without network:

```bash
python3 scripts/paddleocr_layout.py ./input.pdf --dry-run --save-json --output-dir ./tmp-output
```

## Troubleshooting

- `requests` missing:
  Install it with `pip install requests`.
- `Missing API token`:
  Pass `--token` or set `PADDLEOCR_TOKEN`.
- `Unsupported file extension` during auto mode:
  Re-run with `--file-type pdf` or `--file-type image`.
- HTTP errors:
  Check the token, endpoint URL, and whether the remote deployment is reachable from the environment.
- Unexpected download paths:
  The script rejects paths that would escape the output directory.
