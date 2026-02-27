# MFU 人体筋膜与穴位交互式检索平台

## 当前版本亮点
- 左侧已升级为 **真实解剖 3D 模型**（Three.js + GLTFLoader）。
- 默认仅显示 **肌肉系统模型**（已隐藏其他解剖系统）。
- 支持模型交互：拖拽旋转、滚轮缩放、点击肌肉后右侧信息联动。
- 已接入高精度人体解剖 GLB（在线加载，约 72MB）。
- 已预置本地模型文件：`assets/models/anatomy-high.glb`（优先本地加载）。
- 右侧保持筋膜/穴位检索、穴位卡片展开与搜索联动能力。

## 运行方式
```bash
cd /Users/macbook/Documents/MFU
python3 -m http.server 8090
```

访问 [http://localhost:8090](http://localhost:8090)

## 文件结构
```text
MFU/
├── index.html          # 页面结构（左3D视图 + 右侧信息面板）
├── style.css           # UI 样式与3D容器样式
├── main.js             # 3D渲染、模型加载、点击联动、搜索交互
├── data.js             # 肌肉/穴位结构化数据（含 modelKeywords）
├── PRD.md              # 产品需求文档
├── IMG_4293.jpeg       # 参考图
├── IMG_4294.jpeg       # 参考图
└── muscle_anatomy.png  # 旧静态底图（当前版本不再作为主视图）
```

## 模型说明
- 模型格式：`GLB`
- 本地模型：`/assets/models/anatomy-high.glb`
- 本地 Three 核心模块：`/vendor/three/build/three.module.js`
- 加载策略：优先本地模型，失败后再回退到 CDN 与 raw 地址
- 来源：`thisisharshith/anatomy-viewer` 仓库公开模型  
  `https://raw.githubusercontent.com/thisisharshith/anatomy-viewer/main/public/models/model.glb`

## 交互说明
- 点击模型肌肉后：
  - 右侧自动显示对应肌肉与关联穴位
  - 左侧模型会高亮目标肌肉
  - 视角自动平滑聚焦目标区域
- 若点击到尚未配置的肌肉，右侧会显示“该条目数据暂未录入”的占位说明。
- 搜索肌肉/穴位后同样触发联动定位

## 后续建议
- 将高频肌肉部位导出为本地分层模型，减少首屏加载压力。
- 增加前/后/侧预设视角按钮与重置视角按钮。
- 引入模型离线缓存（Service Worker）提升弱网体验。
