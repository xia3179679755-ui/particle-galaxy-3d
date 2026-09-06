# 粒子星系 / Particle Galaxy

一个以 FastAPI 提供单页应用的沉浸式 WebGL 宇宙。Python 只负责 HTML、静态文件和经过 Pydantic 校验的配置接口；每帧的粒子轨道、闪烁、吸引/排斥及超新星波纹均在浏览器顶点 Shader 中运行。

> 太阳系的大小、距离、位置和周期均为美术化的简化视觉模拟，不适用于天文计算。真实日期按钮会把当前日期映射为简化圆轨道相位。

## 需求分析与架构

页面有两个层次：进入页和可收起控制台之上的全屏 `<canvas>`。一个 `THREE.Points` 搭配 `BufferGeometry` 与 `ShaderMaterial` 承载全部星尘；没有为每颗粒子创建 Mesh，也不会把粒子逐帧传回 Python。Shader 按模式从随机种子计算四种参数曲线（旋臂、自由引力、星云、吸积盘），并在前后模式位置之间插值，所以切换不会闪屏。

鼠标/触摸屏坐标以射线与 z=0 平面的交点转换为世界坐标。顶点 Shader 根据粒子到该点的距离计算平滑力、切向涡旋与速度扰动。左键/长按增强作用；按 `R` 或控制台可切换排斥；双击/双触调用一次带衰减的超新星冲击波。单指拖动转动观察，双指平移转动、捏合缩放，滚轮缩放。

太阳系是少量普通 Mesh、轨道 Line 和投影的 HTML 名称标签，故可被 Raycaster 选中。选择行星会显示信息卡，并使镜头平滑聚焦。它与粒子系统交叉淡入淡出，旧 GPU 资源不重复创建。声音是可选接口：项目没有随附音频文件，因此声音按钮明确提示而不会影响画面。

自动画质起点根据粗指针/小屏和像素比选择；连续低于 30 FPS 时自动模式会降低粒子数和像素比，并有 15 秒冷却期防止反复跳变。页面后台停止渲染。`prefers-reduced-motion` 会关闭漂移/自动旋转并限制初始粒子数；WebGL 或固定版 Three.js 双 CDN 均无法加载时给出可恢复的兼容提示。

## 模块与目录

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

开源参考与许可边界见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。项目没有引入这些仓库的构建工具或源代码。

## Visual Studio Code（Windows 10/11）运行

前提：安装 Python 3.11+、Visual Studio Code 和官方 **Python** 扩展。无需 Node.js 和 Docker。

1. 在 VS Code 中打开 `galaxy-particles` 文件夹。
2. 打开 PowerShell 终端，创建并启用环境：

   ```powershell
   py -3.11 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

   若 PowerShell 禁止激活，可直接继续使用 ` .\.venv\Scripts\python.exe ` 运行下列命令，或仅对当前用户执行 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`。

3. 安装依赖：

   ```powershell
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

4. 在状态栏选择 `.venv` 解释器，按 **F5**，选择“FastAPI: 粒子星系（开发）”。启动日志出现后访问 [http://127.0.0.1:8000](http://127.0.0.1:8000)。

也可用 **Terminal → Run Task** 运行“创建 Python 虚拟环境”“安装项目依赖”“启动开发服务器”“运行测试”。按 `Ctrl+C` 停止服务。开发模式使用 `--reload`；生产环境去掉 `--reload`，例如：

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

修改 `--port 8000` 和访问地址即可更换端口。`.env.example` 记录建议的变量；目前 VS Code 调试配置显式给出本地安全绑定地址。

## 部署到 GitHub Pages

本项目的画面、Three.js 和交互都在浏览器执行，因而可作为静态网站发布。仓库推送到 GitHub 的 `main` 分支后，`.github/workflows/deploy-pages.yml` 会自动把 `templates/index.html` 与 `static/` 发布到 GitHub Pages。页面在 Pages 环境中会跳过本地 FastAPI 配置接口，自动使用内置默认配置。

首次发布时，在 GitHub 仓库的 **Settings → Pages** 中将 Source 设为 **GitHub Actions**。工作流完成后，访问仓库页面右侧的 **Deployments** 提供的地址，通常为 `https://<你的 GitHub 用户名>.github.io/<仓库名>/`。

## 使用说明

- **场景**：旋涡星系、粒子引力场、太阳系、深空星云、黑洞。
- **操作**：鼠标移动/单指滑动扰动，按住增强吸引，拖动旋转，滚轮或捏合缩放；双击/双触爆发；`R` 切换排斥。
- **太阳系**：底栏可暂停、改变时间倍率、切换真实日期（简化近似）、俯视和重置。点击行星显示资料并聚焦；控制台控制轨道和名称。
- **保存**：控制台每项设置即时生效并保存在 `localStorage` 的 `galaxy.settings`；恢复默认会覆盖该保存值。
- **性能**：高画质在具备独立显卡的桌面浏览器上目标为 90,000 点；自动模式初始为 60,000，移动端为 24,000。实际帧率取决于 GPU/显示器/浏览器。

## 验证与测试

运行后端测试：

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
