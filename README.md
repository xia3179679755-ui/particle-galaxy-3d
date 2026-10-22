# 粒子星系 / Particle Galaxy

[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white)](https://github.com/xia3179679755-ui/particle-galaxy-3d)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009488?logo=fastapi&logoColor=white)](https://github.com/xia3179679755-ui/particle-galaxy-3d)
[![Three.js](https://img.shields.io/badge/Three.js-0.161-049EF4?logo=three.js)](https://github.com/xia3179679755-ui/particle-galaxy-3d)
[![WebGL](https://img.shields.io/badge/%E6%B8%B2%E6%9F%93-WebGL%20%E9%A1%B6%E7%82%B9%20Shader-9348A0)](https://github.com/xia3179679755-ui/particle-galaxy-3d)

一个以 FastAPI 提供单页应用的沉浸式 WebGL 宇宙。Python 只负责 HTML、静态文件和经过 Pydantic 校验的配置接口；每帧的粒子轨道、闪烁、吸引/排斥及超新星波纹均在浏览器顶点 Shader 中运行。

> 太阳系的大小、距离、位置和周期均为美术化的简化视觉模拟，不适用于天文计算。真实日期按钮会把当前日期映射为简化圆轨道相位。

## 功能特性

- 🌌 **五种场景**：旋涡星系、粒子引力场、太阳系、深空星云、黑洞（吸积盘），切换无闪屏
- ✨ **GPU 粒子系统**：单个 `THREE.Points` + 一次 draw-call 承载最高 90,000 粒子，全部轨道运动在顶点 Shader 内计算
- 🖱️ **丰富交互**：鼠标/触摸扰动粒子、按住增强吸引、`R` 切换排斥、双击触发超新星冲击波；单指旋转、双指平移缩放
- 🪐 **可探索太阳系**：八颗行星可点击选中，显示信息卡并平滑聚焦；支持暂停、时间倍率、真实日期映射
- 📈 **自动画质**：按设备选择初始粒子数，帧率过低时自动降级（含 15 秒冷却防抖动）；页面后台自动停止渲染
- ♿ **可访问性**：`prefers-reduced-motion` 下关闭漂移/自动旋转并限制粒子数；WebGL 不可用时给出可恢复的兼容提示
- 💾 **设置持久化**：控制台每项设置即时生效并保存到 `localStorage` 的 `galaxy.settings`

## 环境要求

- **本地运行**：Python 3.11+（无需 Node.js、无需 Docker）、现代支持 WebGL 的浏览器
- **VS Code（可选）**：官方 **Python** 扩展可获得 F5 一键调试与预设任务
- **在线版**：仅需浏览器，画面与 Three.js 均在浏览器执行

## 快速开始（VS Code，Windows 10/11）

1. 在 VS Code 中打开 `galaxy-particles` 文件夹。
2. 打开 PowerShell 终端，创建并启用环境：

   ```powershell
   py -3.11 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

   若 PowerShell 禁止激活，可直接继续使用 `.\.venv\Scripts\python.exe` 运行下列命令，或仅对当前用户执行 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`。

3. 安装依赖：

   ```powershell
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

4. 在状态栏选择 `.venv` 解释器，按 **F5**，选择“FastAPI: 粒子星系（开发）”。启动日志出现后访问 [http://127.0.0.1:8000](http://127.0.0.1:8000)。

也可用 **Terminal → Run Task** 运行“创建 Python 虚拟环境”“安装项目依赖”“启动开发服务器”“运行测试”。按 `Ctrl+C` 停止服务。

## 通用命令行运行（任意平台）

```bash
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt   # Windows；Linux/macOS 为 .venv/bin/python

# 开发模式（--reload）
.venv/Scripts/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# 生产模式（去掉 --reload）
.venv/Scripts/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

`.env.example` 记录建议的变量（`GALAXY_HOST` / `GALAXY_PORT` / `GALAXY_DEBUG`）；修改端口后同步修改访问地址即可。

## 部署到 GitHub Pages

本项目的画面、Three.js 和交互都在浏览器执行，因而可作为静态网站发布。仓库推送到 GitHub 的 `main` 分支后，`.github/workflows/deploy-pages.yml` 会自动把 `templates/index.html` 与 `static/` 发布到 GitHub Pages。页面在 Pages 环境中会跳过本地 FastAPI 配置接口，自动使用内置默认配置。

首次发布时，在 GitHub 仓库的 **Settings → Pages** 中将 Source 设为 **GitHub Actions**。工作流完成后，访问仓库页面右侧的 **Deployments** 提供的地址，通常为 `https://<你的 GitHub 用户名>.github.io/<仓库名>/`。

## 操作指南

- **场景**：旋涡星系、粒子引力场、太阳系、深空星云、黑洞。
- **操作**：鼠标移动/单指滑动扰动，按住增强吸引，拖动旋转，滚轮或捏合缩放；双击/双触爆发；`R` 切换排斥。
- **太阳系**：底栏可暂停、改变时间倍率、切换真实日期（简化近似）、俯视和重置。点击行星显示资料并聚焦；控制台控制轨道和名称。
- **保存**：控制台每项设置即时生效并保存在 `localStorage` 的 `galaxy.settings`；恢复默认会覆盖该保存值。
- **性能**：高画质在具备独立显卡的桌面浏览器上目标为 90,000 点；自动模式初始为 60,000，移动端为 24,000。实际帧率取决于 GPU/显示器/浏览器。

## 架构概览

- **页面两层结构**：进入页 + 可收起控制台之上的全屏 `<canvas>`。
- **粒子渲染**：一个 `THREE.Points` 搭配 `BufferGeometry` 与 `ShaderMaterial` 承载全部星尘；不为每颗粒子创建 Mesh，也不把粒子逐帧传回 Python。Shader 按模式从随机种子计算四种参数曲线（旋臂、自由引力、星云、吸积盘），并在前后模式位置之间插值，所以切换不闪屏。
- **指针交互**：鼠标/触摸坐标以射线与 z=0 平面的交点转换为世界坐标；顶点 Shader 根据粒子到该点的距离计算平滑力、切向涡旋与速度扰动。
- **太阳系**：少量普通 Mesh、轨道 Line 和投影的 HTML 名称标签，可被 Raycaster 选中；与粒子系统交叉淡入淡出，旧 GPU 资源不重复创建。
- **声音**：可选接口，项目未随附音频文件；声音按钮会明确提示，不影响画面。
- **降级策略**：自动画质起点根据粗指针/小屏和像素比选择；连续低于 30 FPS 时降低粒子数和像素比（15 秒冷却）；优先加载内置固定版 Three.js 0.161，本地文件被误删才回退双 CDN，全部失败显示重新加载按钮。

## 目录结构

```text
galaxy-particles/
├─ .vscode/                 # F5、虚拟环境、安装、测试任务
├─ app/
│  ├─ main.py               # FastAPI 页面/静态文件服务
│  ├─ api/routes.py         # /api/config 和偏好校验
│  └─ config/settings.py    # 公开配置与 Pydantic 模型
├─ static/
│  ├─ css/main.css
│  └─ js/
│     ├─ core/              # 启动、相机、生命周期、CDN 回退
│     ├─ particles/         # 单 draw-call GPU 粒子和 GLSL
│     ├─ interaction/       # 鼠标、指针、触摸、手势
│     ├─ scenes/            # 无闪屏场景编排/销毁
│     ├─ solar-system/      # 八大行星、选择、时间
│     ├─ performance/       # FPS 和自动画质
│     └─ ui/                # 控制面板和 localStorage
├─ templates/index.html
├─ tests/test_app.py
├─ requirements.txt
└─ .env.example
```

## 验证与测试

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

测试覆盖首页、静态 CSS、公开配置、有效参数与无效参数（422）。浏览器手工验收清单：

1. 打开首页、进入星系，查看控制台切换全部五种场景时是否平滑。
2. 移动、按住、按 `R`、双击；在手机模拟器测试单指、长按、双指和横竖屏。
3. 太阳系检查八颗行星不同速度，点击信息卡，测试暂停/倍率/真实日期。
4. 修改控制项、刷新，确认恢复；DevTools 可查看 FPS，自动模式在低帧率时会通知降级。
5. 切换浏览器后台再返回，确认未在后台持续运行；系统“减少动态效果”下确认漂移关闭。
6. 在不支持 WebGL 的环境（或禁用硬件加速）确认出现兼容提示。性能/内存检查可用 Chrome DevTools Performance + Memory：切换场景多次后做 Heap Snapshot，`beforeunload` 会主动 dispose 几何体、材质和标签。

## 常见问题

| 情况 | 解决方法 |
| --- | --- |
| `py -3.11` 不存在 | 安装 Python 3.11+，或把命令改为 `python -m venv .venv`。 |
| F5 提示找不到解释器 | 先创建 `.venv`，再用 VS Code 的 “Python: Select Interpreter” 选择它。 |
| 画面提示 WebGL 不可用 | 更新浏览器、开启硬件加速、更新显卡驱动，或关闭会阻止 WebGL 的扩展。 |
| 首次没有星尘 | 项目优先加载内置的固定版 Three.js 0.161；如本地文件被误删，才会自动尝试两个 CDN，全部失败会显示重新加载按钮。 |
| 手机卡顿 | 保持“自动”或选“低”，关闭自动旋转/镜头漂移并减少粒子数。 |

## 开发者与智能体指引

- **依赖清单**：FastAPI 0.115.6、Uvicorn 0.34.0、Jinja2 3.1.5；测试用 pytest 8.3.4 + httpx 0.28.1。
- **配置接口**：`app/api/routes.py` 暴露 `/api/config`，参数经 Pydantic 校验；GitHub Pages 环境会自动跳过该接口并使用内置默认配置——新增配置项时需同步维护两处默认值。
- **无构建步骤**：前端为原生 JS 模块，无打包器；改完刷新即可。
- **资源生命周期**：场景切换采用交叉淡入淡出 + 旧资源销毁；`beforeunload` 主动 dispose 几何体、材质和标签，改动场景编排时请保持该约定，避免 GPU 泄漏。

## 许可与第三方说明

开源参考与许可边界见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。项目没有引入这些仓库的构建工具或源代码。
