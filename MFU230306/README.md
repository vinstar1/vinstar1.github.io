# MFU 人体筋膜与穴位交互式检索平台

## 项目概述
MFU 是一个基于 Web 的人体解剖与穴位双向联动检索工具。旨在通过直观的 **3D 肌肉系统模型** 与 **结构化穴位知识库** 的实时同步，为专业人士提供精准的定位参考。

## 当前版本亮点
- **三维可视化交互**：集成 Three.js + GLTFLoader 渲染的高精度肌肉模型，支持 360° 旋转、缩放与平移。
- **双向联动系统**：
  - **点击定位**：在左侧 3D 模型点击具体肌肉，右侧信息面板自动展开该部位的详细解剖数据及关联穴位。
  - **搜索聚焦**：在右侧搜索框检索肌肉或穴位，3D 摄像机会自动漫游并聚焦至目标区域且施加高亮。
- **高精度模型策略**：采用 `anatomy-high.glb` 模型，支持本地优先加载策略以保证极致的离线体验。
- **自动化数据提取**：内置 Python 脚本，已从 PDF 文献中精准提取 100+ 条穴位与肌肉附着记录。

## 运行方式 (本地环境)
```bash
cd /Users/macbook/Documents/code/vinstar1.github.io-hexo/source/MFU230306/
python3 -m http.server 8090
```
访问 [http://localhost:8090](http://localhost:8090)

## 文件结构 (Project Tree)
```text
MFU230306/
├── index.html            # Web 页面主结构（自适应双栏布局）
├── style.css             # UI/UX 样式（医疗科技感极简风格）
├── main.js               # 核心逻辑（3D 渲染、模型拾取、搜索联动）
├── data.js               # 结构化解剖数据中心（含 modelKeywords 映射）
├── assets/
│   ├── models/           # 肌肉系统 3D 模型库 (anatomy-high.glb)
│   └── draco/            # 模型解压加速模块
├── vendor/               # 第三方依赖库（Three.js 核心及常用组件）
├── scripts/              # 自动化工具（PDF 解析、OCR 与穴位数据提取脚本）
├── output/               # 脚本运行结果（包含导出的 Excel 数据）
├── skills/               # 特化原子能力库
└── PRD.md                # 完整产品需求规格说明书
```

## 模型说明
- **模型格式**：`GLB` (带多层解剖元数据)
- **核心组件**：基于本地 `vendor/three/build/three.module.js`
- **加载策略**：优先尝试本地路径 `assets/models/anatomy-high.glb`；在资源缺失或网络不可达时，自动回退到 GitHub Raw 原始分发地址。

## 后续演进方向
- **模型分块化**：将高频使用的区域（如颈项部、腰骶部）进行分块导出，提升首屏渲染速度。
- **交互强化**：引入多视角预置位按钮（前、后、侧视图）一键快速对焦。
- **离线增强**：部署 Service Worker 实现模型资源的 PWA 级缓存，提升二次加载体验。

## 数据来源与致谢
- 模型来源：`thisisharshith/anatomy-viewer` 提供的公开人体模型分层数据。
- 文献来源：根据《PDF_筋膜手法辅助姿势调整.(1).pdf》整理的临床穴位应用数据。
