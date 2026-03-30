import io
import json
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OCR_JSON = ROOT / "output" / "layout_parsing_result.json"
OUT_DIR = ROOT / "output" / "ocr_page_previews"
PDF_PATH = ROOT / "PDF" / "PDF_筋膜手法辅助姿势调整.(1).pdf"

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
    if not PDF_PATH.exists():
        print(f"Error: PDF not found at {PDF_PATH}")
        return

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OCR_JSON, "r", encoding="utf-8") as f:
        pages_data = json.load(f)["result"]["layoutParsingResults"]
    
    doc = fitz.open(PDF_PATH)
    
    for page_index, page_meta in enumerate(pages_data, start=1):
        if page_index > len(doc):
            break
            
        # PDF 索引从 0 开始
        page = doc[page_index - 1]
        
        # 目标宽度和高度（来自 OCR JSON，通常对应 144 DPI 的 A4）
        target_w = page_meta["prunedResult"]["width"]
        target_h = page_meta["prunedResult"]["height"]
        
        # 计算缩放比例
        # fitz 的 page.rect 是 points (72 DPI)
        # 如果 target_w 是 1684 (144 DPI), 则 scale 应为 2.0
        zoom_x = target_w / page.rect.width
        zoom_y = target_h / page.rect.height
        mat = fitz.Matrix(zoom_x, zoom_y)
        
        pix = page.get_pixmap(matrix=mat, colorspace=fitz.csRGB)
        image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        blocks = select_image_blocks(page_meta)
        crop_box = build_crop_box(blocks, image.size)
        cropped = image.crop(crop_box)
        
        file_name = f"page_{page_index:03d}.jpg"
        out_path = OUT_DIR / file_name
        cropped.save(out_path, quality=92, optimize=True)
        print(f"Updated {file_name}")

    doc.close()
    print("Done re-extracting previews from PDF.")

if __name__ == "__main__":
    main()
