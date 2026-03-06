import io
import json
from pathlib import Path

import requests
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OCR_JSON = ROOT / "output" / "layout_parsing_result.json"
OUT_DIR = ROOT / "output" / "ocr_page_previews"
MANIFEST_PATH = OUT_DIR / "manifest.json"


def select_image_blocks(page):
    blocks = page.get("prunedResult", {}).get("parsing_res_list", [])
    selected = []
    for block in blocks:
        if block.get("block_label") != "image":
            continue
        x1, y1, x2, y2 = block.get("block_bbox", [0, 0, 0, 0])
        width = max(0, x2 - x1)
        height = max(0, y2 - y1)
        area = width * height
        if area < 20000:
            continue
        selected.append((x1, y1, x2, y2))
    return selected


def build_crop_box(blocks, image_size):
    if not blocks:
        width, height = image_size
        return (0, 0, width, height)

    min_x = min(box[0] for box in blocks)
    min_y = min(box[1] for box in blocks)
    max_x = max(box[2] for box in blocks)
    max_y = max(box[3] for box in blocks)

    crop_width = max_x - min_x
    crop_height = max_y - min_y

    pad_x = int(crop_width * 0.07) + 18
    pad_top = int(crop_height * 0.12) + 24
    pad_bottom = int(crop_height * 0.05) + 12

    width, height = image_size
    left = max(0, min_x - pad_x)
    top = max(0, min_y - pad_top)
    right = min(width, max_x + pad_x)
    bottom = min(height, max_y + pad_bottom)
    return (left, top, right, bottom)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pages = json.loads(OCR_JSON.read_text(encoding="utf-8"))["result"]["layoutParsingResults"]
    manifest = []

    session = requests.Session()
    session.headers.update({"User-Agent": "MFU/1.0"})

    for page_index, page in enumerate(pages, start=1):
        image_url = page.get("inputImage")
        if not image_url:
            continue

        response = session.get(image_url, timeout=30)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        crop_box = build_crop_box(select_image_blocks(page), image.size)
        cropped = image.crop(crop_box)

        file_name = f"page_{page_index:03d}.jpg"
        out_path = OUT_DIR / file_name
        cropped.save(out_path, quality=92, optimize=True)

        manifest.append(
            {
                "page": page_index,
                "image": f"output/ocr_page_previews/{file_name}",
                "cropBox": {
                    "left": crop_box[0],
                    "top": crop_box[1],
                    "right": crop_box[2],
                    "bottom": crop_box[3],
                },
            }
        )

    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"generated {len(manifest)} preview images")


if __name__ == "__main__":
    main()
