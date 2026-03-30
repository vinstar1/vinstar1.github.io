import io
import json
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
OCR_JSON = ROOT / "output" / "layout_parsing_result.json"
ACU_JSON = ROOT / "output" / "acupoints_extracted.json"
OUT_DIR = ROOT / "output" / "ocr_page_previews"
PDF_PATH = ROOT / "PDF" / "PDF_筋膜手法辅助姿势调整.(1).pdf"

def select_image_blocks(page_meta):
    blocks = page_meta.get("prunedResult", {}).get("parsing_res_list", [])
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
    pad_bottom = int(crop_height * 0.01) + 6  # 稍微减少底部 padding 避免带入水印

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
    
    # 载入 OCR 解析结果（用于精准获取解剖图部位包围盒）
    with open(OCR_JSON, "r", encoding="utf-8") as f:
        pages_data = json.load(f)["result"]["layoutParsingResults"]
        
    # 加载穴位元数据
    with open(ACU_JSON, "r", encoding="utf-8") as f:
        acupoints = json.load(f)
    
    # 按页码分组
    pages_map = defaultdict(list)
    for acu in acupoints:
        if "page" in acu:
            pages_map[acu["page"]].append(acu)
    
    doc = fitz.open(PDF_PATH)
    
    for page_num, page_acus in pages_map.items():
        if page_num > len(doc):
            continue
            
        page = doc[page_num - 1]
        
        # 获取这页的 OCR meta (注意 page_num 从 1 开始，数组索引从 0 开始)
        # 如果 OCR 结果不够长就跳过裁剪逻辑 fallback 到全尺寸
        page_meta = None
        if page_num - 1 < len(pages_data):
            page_meta = pages_data[page_num - 1]
            
        target_w = page_meta["prunedResult"]["width"] if page_meta else 1684
        target_h = page_meta["prunedResult"]["height"] if page_meta else 1191
            
        zoom_x = target_w / page.rect.width
        zoom_y = target_h / page.rect.height
        mat = fitz.Matrix(zoom_x, zoom_y)
        
        pix = page.get_pixmap(matrix=mat, colorspace=fitz.csRGB)
        full_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # 第一步：根据 PaddleOCR 抠出核心配图（完全舍弃四周与底部水印区）
        if page_meta:
            blocks = select_image_blocks(page_meta)
            crop_box = build_crop_box(blocks, full_img.size)
            core_img = full_img.crop(crop_box)
        else:
            core_img = full_img
        
        # 第二步：如果一页有多个穴位，按宽度均分扣好的解剖图
        page_acus.sort(key=lambda x: x.get("order", 1))
        num_acus = len(page_acus)
        
        for i, acu in enumerate(page_acus):
            acu_id = acu["id"]
            order = acu.get("order", 1)
            
            w, h = core_img.size
            if num_acus > 1:
                segment_w = w / num_acus
                left = i * segment_w
                right = (i + 1) * segment_w
                cropped = core_img.crop((int(left), 0, int(right), h))
            else:
                cropped = core_img
            
            file_name = f"{acu_id}.jpg"
            out_path = OUT_DIR / file_name
            cropped.save(out_path, quality=92, optimize=True)
            print(f"Generated {file_name} from page {page_num} (order {order})")

    doc.close()
    print("Independent logic processed with PaddleOCR box logic.")

if __name__ == "__main__":
    main()
