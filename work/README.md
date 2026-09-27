# 机械加工在线计算工具箱 | Mechanical Calculator

<div align="center">
  <h3>精密数控机床与齿轮/蜗杆加工工程计算器</h3>
  <p>CNC Machining Engineering Calculators, Geometry Analytics & Tooling Formulas</p>

  <p>
    <a href="#-工具矩阵">工具矩阵</a> •
    <a href="#-核心特性">核心特性</a> •
    <a href="#-技术栈">技术栈</a> •
    <a href="#-访客统计系统">访客统计</a> •
    <a href="#-快速开始">快速开始</a> •
    <a href="#-版权与链接">版权与链接</a>
  </p>
</div>

---

## 🚀 工具矩阵

本工具箱专为机械加工工程师、数控程序员及磨削工艺人员设计，包含 7 大实用计算工具：

1. **双圆弧参数计算器 (Double Arc Calculator)**：
   * 输入两圆弧几何参数，实时解算相切交点、圆心坐标及平滑拟合轨迹；
2. **螺旋升角计算器 (Spiral Angle Calculator)**：
   * 支持根据导程、中径或模数/头数快速解算精密螺纹与蜗杆的理论螺旋升角；
3. **线速度 ↔ 转速换算 (Linear Speed & RPM Calculator)**：
   * 工件/砂轮直径与线速度（m/s、m/min）及主轴转速（rpm）之间的双向毫秒级极速换算；
4. **三针测量终尺寸计算器 (Three-Wire Measurement Calculator)**：
   * 精密螺纹/蜗杆中径三针法测量计算，快速给出最佳量针直径及跨针 M 读数值；
5. **AB 旋转轴拟合计算器 (AB Rotary Axis Fitting)**：
   * 多轴联动数控加工中 A/B 空间旋转轴空间姿态转换与角度偏差拟合；
6. **蜗杆加工全数据计算 (Worm Gear Calculator)**：
   * 包含法向模数、轴向模数、分度圆柱参数、齿顶齿根高及蜗轮配对啮合中心距等全套数据；
7. **砂轮杆最大干涉偏移计算 (Max Arbor Offset Calculator)**：
   * 计算内螺纹/内螺旋槽磨削时砂轮杆与工件孔径在倾角工况下的临界防干涉偏移极限。

---

## 🛡️ 核心特性

* **全端响应式设计**：专为车间现场设计，移动端横向滑动手势适配，手机/平板/电脑均可舒适操作；
* **即时响应与零延迟**：纯前端实时计算，参数变动瞬时刷新结果，支持一键重置与示例载入；
* **极简自托管**：零外部冗余依赖，所有矢量图标与英文字体完整打包；
* **边缘访客统计**：集成 Cloudflare D1 边缘去重统计，底栏实时呈现本周、本月及历史总访问人数。

---

## 🛠️ 技术栈

* **核心框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **构建工具**：[Vite](https://vitejs.dev/)
* **矢量图标**：[FontAwesome Free](https://fontawesome.com/)
* **排版字体**：[@fontsource/inter](https://fontsource.org/fonts/inter)
* **代码规范**：[Oxlint](https://oxc.rs/)
* **边缘计算与存储**：Cloudflare Workers + [Cloudflare D1 SQL](https://developers.cloudflare.com/d1/)

---

## 📊 访客统计系统 (Visitor Analytics)

网站底栏内置了轻量级独立访客统计微徽标：
* **本周访客**：按 ISO 8601 自然周去重；
* **本月访客**：按自然月去重；
* **历史总访客**：全周期主键去重。

> 📖 **完整配置操作手册**：有关 Cloudflare Workers 动静分离部署、D1 绑定及 Worker 脚本的详细设置，请参阅专属文档：[ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md)。

---

## 💻 快速开始

### 1. 克隆仓库
```bash
git clone https://github.com/nie11kun/HtmlApp.git
cd HtmlApp/work
```

### 2. 安装依赖
```bash
npm install
```

### 3. 本地启动开发服务器
```bash
npm run dev
```
本地访问地址：`http://localhost:5173`。

### 4. 生产环境打包
```bash
npm run build
```
执行后将通过 `tsc -b && vite build` 编译输出至 `dist/` 目录，可直接上传部署至 Cloudflare Workers / Pages、Nginx 或 Vercel。

---

## 📞 版权与链接

* **作者**：[聂坤 (niekun.net)](https://niekun.net/)
* **技术博客**：[blog.niekun.net](https://blog.niekun.net/)
* **开源仓库**：[GitHub - HtmlApp](https://github.com/nie11kun/HtmlApp)
* **版权所有**：© 2026 聂坤. All Rights Reserved.
