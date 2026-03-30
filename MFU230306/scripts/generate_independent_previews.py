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

def main():
    if not PDF_PATH.exists():
        print(f"Error: PDF not found at {PDF_PATH}")
        return

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 加载穴位元数据
    with open(ACU_JSON, "r", encoding="utf-8") as f:
        acupoints = json.load(f)
    
    # 按页码分组，统计每页有多少个穴位以便切割
    pages_map = defaultdict(list)
    for acu in acupoints:
        if "page" in acu:
            pages_map[acu["page"]].append(acu)
    
    doc = fitz.open(PDF_PATH)
    
    for page_num, page_acus in pages_map.items():
        if page_num > len(doc):
            continue
            
        page = doc[page_num - 1]
        
        # 使用高分辨率进行截取 (144 DPI 对应约 1684x1191)
        # 如果 PDF 本身是 landscape 且包含并排两页，我们根据穴位的 order 分割
        target_dpi = 144
        mat = fitz.Matrix(target_dpi / 72, target_dpi / 72)
        pix = page.get_pixmap(matrix=mat, colorspace=fitz.csRGB)
        full_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # 排序，确保 order 顺序正确
        page_acus.sort(key=lambda x: x.get("order", 1))
        num_acus = len(page_acus)
        
        for i, acu in enumerate(page_acus):
            acu_id = acu["id"]
            order = acu.get("order", 1)
            
            # 简单的宽度切割：均分宽度
            # 大多数情况下 num_acus 为 1 或 2
            w, h = full_img.size
            if num_acus > 1:
                # 按比例切割
                segment_w = w / num_acus
                left = i * segment_w
                right = (i + 1) * segment_w
                cropped = full_img.crop((int(left), 0, int(right), h))
            else:
                cropped = full_img
            
            file_name = f"{acu_id}.jpg"
            out_path = OUT_DIR / file_name
            cropped.save(out_path, quality=92, optimize=True)
            print(f"Generated {file_name} from page {page_num} (order {order})")

    doc.close()
    print("Independent images generated successfully.")

if __name__ == "__main__":
    main()
