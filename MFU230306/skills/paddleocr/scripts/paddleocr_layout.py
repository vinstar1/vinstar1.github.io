#!/usr/bin/env python3
"""
Send a local PDF or image to the PaddleOCR layout parsing API and persist outputs.
"""

import argparse
import base64
import json
import mimetypes
import os
from pathlib import Path
from typing import Dict, Iterable, Tuple

try:
    import requests
except ImportError as exc:  # pragma: no cover - import guard
    raise SystemExit("The 'requests' package is required. Install it with: pip install requests") from exc


DEFAULT_API_URL = "https://yfo2h8e2j5ddmct0.aistudio-app.com/layout-parsing"
DEFAULT_TIMEOUT = 300
PDF_FILE_TYPE = 0
IMAGE_FILE_TYPE = 1
IMAGE_EXTENSIONS = {
    ".bmp",
    ".gif",
    ".heic",
    ".jpeg",
    ".jpg",
    ".png",
    ".tif",
    ".tiff",
    ".webp",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Parse a local PDF or image through the PaddleOCR layout API.",
    )
    parser.add_argument("input_file", help="Local PDF or image path")
    parser.add_argument(
        "--output-dir",
        default="output",
        help="Directory for markdown, images, and optional JSON output",
    )
    parser.add_argument(
        "--api-url",
        default=DEFAULT_API_URL,
        help="Layout parsing endpoint URL",
    )
    parser.add_argument(
        "--token",
        default=os.environ.get("PADDLEOCR_TOKEN"),
        help="API token. Defaults to the PADDLEOCR_TOKEN environment variable",
    )
    parser.add_argument(
        "--file-type",
        choices=("auto", "pdf", "image"),
        default="auto",
        help="Override file type detection",
    )
    parser.add_argument(
        "--orientation",
        action="store_true",
        help="Enable document orientation classification",
    )
    parser.add_argument(
        "--doc-unwarp",
        action="store_true",
        help="Enable document unwarping",
    )
    parser.add_argument(
        "--chart-recognition",
        action="store_true",
        help="Enable chart recognition",
    )
    parser.add_argument(
        "--skip-markdown-images",
        action="store_true",
        help="Skip downloads from markdown.images",
    )
    parser.add_argument(
        "--skip-output-images",
        action="store_true",
        help="Skip downloads from outputImages",
    )
    parser.add_argument(
        "--save-json",
        action="store_true",
        help="Write the raw API response to result.json",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Build the request payload and output structure without sending the API call",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=DEFAULT_TIMEOUT,
        help="HTTP timeout in seconds",
    )
    return parser.parse_args()


def resolve_file_type(path: Path, requested: str) -> int:
    if requested == "pdf":
        return PDF_FILE_TYPE
    if requested == "image":
        return IMAGE_FILE_TYPE

    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return PDF_FILE_TYPE
    if suffix in IMAGE_EXTENSIONS:
        return IMAGE_FILE_TYPE

    mime_type, _ = mimetypes.guess_type(path.name)
    if mime_type == "application/pdf":
        return PDF_FILE_TYPE
    if mime_type and mime_type.startswith("image/"):
        return IMAGE_FILE_TYPE

    raise ValueError(
        f"Could not auto-detect file type for '{path}'. Use --file-type pdf or --file-type image."
    )


def encode_file(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("ascii")


def build_payload(file_b64: str, file_type: int, args: argparse.Namespace) -> Dict[str, object]:
    return {
        "file": file_b64,
        "fileType": file_type,
        "useDocOrientationClassify": args.orientation,
        "useDocUnwarping": args.doc_unwarp,
        "useChartRecognition": args.chart_recognition,
    }


def output_path(base_dir: Path, relative_name: str) -> Path:
    candidate = (base_dir / relative_name).resolve()
    base_resolved = base_dir.resolve()
    if candidate != base_resolved and base_resolved not in candidate.parents:
        raise ValueError(f"Refusing to write outside output directory: {relative_name}")
    return candidate


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def write_bytes(path: Path, content: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)


def download_file(url: str, destination: Path, timeout: int) -> None:
    response = requests.get(url, timeout=timeout)
    response.raise_for_status()
    write_bytes(destination, response.content)


def iter_layout_results(result: Dict[str, object]) -> Iterable[Tuple[int, Dict[str, object]]]:
    results = result.get("layoutParsingResults", [])
    if not isinstance(results, list):
        raise ValueError("Expected result.layoutParsingResults to be a list")
    for index, item in enumerate(results):
        if not isinstance(item, dict):
            raise ValueError(f"Expected layoutParsingResults[{index}] to be an object")
        yield index, item


def persist_results(result: Dict[str, object], output_dir: Path, args: argparse.Namespace) -> None:
    if args.save_json:
        write_text(output_path(output_dir, "result.json"), json.dumps(result, ensure_ascii=False, indent=2))

    for index, item in iter_layout_results(result):
        markdown = item.get("markdown") or {}
        if not isinstance(markdown, dict):
            raise ValueError(f"Expected markdown object for layoutParsingResults[{index}]")

        markdown_text = markdown.get("text", "")
        if not isinstance(markdown_text, str):
            raise ValueError(f"Expected markdown.text to be a string for layoutParsingResults[{index}]")

        write_text(output_path(output_dir, f"doc_{index}.md"), markdown_text)
        print(f"Markdown document saved at {output_path(output_dir, f'doc_{index}.md')}")

        markdown_images = markdown.get("images") or {}
        if not isinstance(markdown_images, dict):
            raise ValueError(f"Expected markdown.images to be an object for layoutParsingResults[{index}]")

        if not args.skip_markdown_images:
            for relative_name, url in markdown_images.items():
                if not isinstance(relative_name, str) or not isinstance(url, str):
                    raise ValueError(f"Invalid markdown image entry in layoutParsingResults[{index}]")
                destination = output_path(output_dir, relative_name)
                download_file(url, destination, args.timeout)
                print(f"Image saved to: {destination}")

        output_images = item.get("outputImages") or {}
        if not isinstance(output_images, dict):
            raise ValueError(f"Expected outputImages to be an object for layoutParsingResults[{index}]")

        if not args.skip_output_images:
            for image_name, url in output_images.items():
                if not isinstance(image_name, str) or not isinstance(url, str):
                    raise ValueError(f"Invalid outputImages entry in layoutParsingResults[{index}]")
                destination = output_path(output_dir, f"{image_name}_{index}.jpg")
                download_file(url, destination, args.timeout)
                print(f"Image saved to: {destination}")


def main() -> int:
    args = parse_args()
    input_path = Path(args.input_file).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()

    if not input_path.is_file():
        raise SystemExit(f"Input file not found: {input_path}")

    file_type = resolve_file_type(input_path, args.file_type)
    payload = build_payload(encode_file(input_path), file_type, args)

    output_dir.mkdir(parents=True, exist_ok=True)

    if args.dry_run:
        preview = {
            "input_file": str(input_path),
            "output_dir": str(output_dir),
            "api_url": args.api_url,
            "fileType": file_type,
            "payload_keys": sorted(payload.keys()),
            "file_base64_length": len(payload["file"]),
        }
        if args.save_json:
            write_text(output_path(output_dir, "result.json"), json.dumps(preview, indent=2))
        print(json.dumps(preview, indent=2))
        return 0

    if not args.token:
        raise SystemExit("Missing API token. Pass --token or set PADDLEOCR_TOKEN.")

    headers = {
        "Authorization": f"token {args.token}",
        "Content-Type": "application/json",
    }

    response = requests.post(args.api_url, json=payload, headers=headers, timeout=args.timeout)
    response.raise_for_status()
    response_json = response.json()

    result = response_json.get("result")
    if not isinstance(result, dict):
        raise SystemExit("API response does not contain an object at response['result'].")

    persist_results(result, output_dir, args)
    print("Parsing complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
