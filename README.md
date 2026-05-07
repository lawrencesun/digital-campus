# 校园数字孪生系统

基于 Three.js 的校园三维数字孪生展示系统。通过程序化生成与外部模型导入相结合的方式构建校园场景，支持交互浏览、建筑信息查看、图层控制等功能。

## 功能特性

- **三维校园场景** — 地形、建筑（带窗户/楼层线/屋顶）、道路、树木、天空球
- **透视相机** — 支持轨道控制（拖拽旋转、缩放、平移）及多视角预设（鸟瞰、全景、街道）
- **建筑交互** — 鼠标悬停高亮、点击聚焦并弹出信息面板
- **程序化生成** — 通过 JSON 配置参数自动生成建筑几何体，无需建模软件
- **模型导入** — 支持 glTF/GLB 格式外部模型加载（含 Draco 压缩）
- **图层控制** — 建筑、道路、植被、地面图层独立显隐
- **小地图** — Canvas 2D 俯视图，实时显示相机位置
- **昼夜循环** — 可启用的日照模拟与氛围变化
- **加载界面** — 资源加载进度展示

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装与运行

```bash
npm install
npm run dev
```

浏览器自动打开 `http://localhost:3000`。

### 构建生产版本

```bash
npm run build
npm run preview
```

构建产物输出至 `dist/` 目录。

## 项目结构

```
campus-digital-twin/
├── index.html                          # 入口页面（含 UI 容器）
├── package.json
├── vite.config.js
├── public/
│   ├── models/                         # 外部 glTF/GLB 模型文件
│   ├── textures/                       # 贴图、HDR 环境贴图
│   └── data/
│       ├── buildings.json              # 建筑数据（位置、尺寸、描述）
│       └── campus-config.json          # 场景配置（地形、道路、植被、天空）
└── src/
    ├── main.js                         # 应用入口
    ├── style.css                       # 全局样式
    ├── core/                           # 核心引擎
    │   ├── Engine.js                   # 主引擎（渲染循环、子系统管理）
    │   ├── SceneManager.js             # 场景（灯光、雾效、图层）
    │   ├── CameraManager.js            # 透视相机（视角预设、聚焦）
    │   └── RenderManager.js            # WebGLRenderer 配置
    ├── controls/                       # 交互控制
    │   ├── OrbitControlsAdapter.js     # 轨道控制器封装
    │   ├── Picker.js                   # Raycaster 射线拾取
    │   └── KeyboardController.js       # 键盘事件
    ├── loaders/                        # 模型加载
    │   ├── GLTFLoaderAdapter.js        # glTF 加载器（含 Draco 解码）
    │   ├── ModelManager.js             # 加载队列与缓存管理
    │   └── EnvironmentLoader.js        # HDR 环境贴图加载
    ├── world/                          # 场景构建
    │   ├── CampusBuilder.js            # 校园总构建器
    │   ├── ProceduralBuilding.js       # 程序化建筑生成
    │   ├── ImportedModel.js            # 外部模型包装
    │   ├── Terrain.js                  # 地面
    │   ├── Road.js                     # 道路（CatmullRom 曲线挤出）
    │   ├── Vegetation.js               # 树木
    │   └── Skybox.js                   # 天空球
    ├── ui/                             # UI 面板（原生 DOM）
    │   ├── InfoPanel.js                # 建筑信息面板
    │   ├── Toolbar.js                  # 工具栏
    │   ├── LayerPanel.js               # 图层控制面板
    │   ├── Minimap.js                  # 小地图
    │   └── LoadingScreen.js            # 加载进度界面
    ├── effects/                        # 视觉效果
    │   ├── Lighting.js                 # 灯光配置
    │   └── DayNightCycle.js            # 昼夜循环
    └── utils/                          # 工具
        ├── constants.js                # 全局常量
        └── helpers.js                  # EventBus / 通用函数
```

## 配置说明

### 建筑数据 (`public/data/buildings.json`)

每栋建筑为一个 JSON 对象：

```json
{
  "id": "teaching-a",
  "name": "教学楼A",
  "type": "教学楼",
  "x": -20,
  "z": -15,
  "width": 18,
  "height": 18,
  "depth": 12,
  "floors": 6,
  "area": 3888,
  "year": 2010,
  "color": 14084857,
  "roofColor": 10053171,
  "status": "正常使用",
  "description": "主教学楼，设有30间标准教室和6间多媒体教室。"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识 |
| `name` | string | 显示名称 |
| `x` / `z` | number | 场景坐标位置 |
| `width` / `height` / `depth` | number | 建筑尺寸（米） |
| `floors` | number | 楼层数（影响窗户和楼层线分布） |
| `color` | number | 建筑主体颜色（十进制 Hex） |
| `roofColor` | number | 屋顶颜色 |
| `modelUrl` | string | 可选，外部模型路径（如 `/models/library.glb`） |

当配置了 `modelUrl` 时，系统加载外部模型文件；未配置时自动通过 `ProceduralBuilding` 程序化生成。

### 场景配置 (`public/data/campus-config.json`)

```json
{
  "terrain": { "size": 200, "color": 4884185, "segments": 40 },
  "roads": [
    {
      "points": [{"x": -60, "z": 0}, {"x": 60, "z": 0}],
      "width": 5,
      "color": 5592405
    }
  ],
  "vegetation": {
    "trees": [
      { "x": -10, "z": -8, "trunkHeight": 2.5, "crownRadius": 2 }
    ]
  },
  "skyTopColor": 4488cc,
  "skyBottomColor": c8dde6
}
```

## 操作指南

| 操作 | 说明 |
|------|------|
| 鼠标左键拖拽 | 旋转视角 |
| 鼠标右键拖拽 | 平移视角 |
| 滚轮 | 缩放 |
| 点击建筑 | 聚焦并弹出信息面板 |
| 悬停建筑 | 高亮显示 |
| 左侧工具栏 | 重置视角 / 鸟瞰 / 图层 / 小地图 |

## 技术栈

| 类别 | 技术 |
|------|------|
| 3D 引擎 | Three.js r170 |
| 构建 | Vite 6 |
| 模型格式 | glTF 2.0 / GLB（支持 Draco 压缩） |
| UI | 原生 DOM + CSS |
| 模块化 | ES Module |

## 添加自定义模型

1. 将 `.glb` 文件放入 `public/models/`
2. 在 `public/data/buildings.json` 中添加条目，设置 `modelUrl` 字段：

```json
{
  "id": "custom-building",
  "name": "自定义建筑",
  "modelUrl": "/models/custom-building.glb",
  "x": 50,
  "z": 0,
  "scale": 1,
  "type": "自定义",
  "status": "正常使用",
  "description": "通过外部模型导入的建筑"
}
```

## 扩展方向

- 接入 WebSocket 实时数据（传感器、人流统计）
- 第一人称漫游模式
- 天气系统（雨/雪粒子效果）
- 经纬度坐标对接真实地图
- 后端 API 数据服务集成
