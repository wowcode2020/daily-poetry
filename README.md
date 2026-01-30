# 每日诗词

一个优雅的每日诗词展示网站，采用液态玻璃设计风格，每天自动展示一首中国古诗词。

## ✨ 特性

- 🎨 **优雅设计**：液态玻璃（Liquid Glass）风格，流动的视觉效果
- 📱 **响应式**：完美适配手机、平板和电脑
- 🌙 **主题切换**：支持深色/浅色模式
- 📜 **历史浏览**：自动保存浏览历史
- 🔗 **分享功能**：支持分享诗词到社交媒体
- ❤️ **收藏功能**：收藏喜欢的诗词
- ⚡ **快速加载**：优化的性能和动画
- ♿ **可访问性**：遵循WCAG可访问性标准

## 🛠 技术栈

- **框架**：Vue 3 + Vite + TypeScript
- **样式**：CSS（玻璃拟态、动画）
- **图标**：Heroicons（SVG）
- **API**：今日诗词API（https://www.jinrishici.com/）
- **部署**：Vercel

## 🚀 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看网站

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📦 部署到Vercel

### 方法1：通过Vercel CLI部署

1. 安装Vercel CLI

```bash
npm install -g vercel
```

2. 在项目根目录运行

```bash
vercel
```

3. 按照提示完成部署

### 方法2：通过GitHub部署

1. 将代码推送到GitHub仓库
2. 在Vercel中导入该仓库
3. Vercel会自动检测Vite项目并进行部署
4. 完成后获得部署URL

### 方法3：通过Vercel Dashboard部署

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入你的GitHub仓库
4. 配置构建设置（通常自动检测）
5. 点击 "Deploy"

## 🎨 设计系统

### 配色方案

- **主色调**：#DB2777（浪漫粉色）
- **辅助色**：#F472B6（浅粉色）
- **强调色**：#CA8A04（优雅金色）
- **背景色**：#FDF2F8（米白色）
- **文字色**：#831843（深紫色）

### 字体

- **标题**：Noto Serif TC（思源宋体繁体中文）
- **正文**：Noto Sans TC（思源黑体繁体中文）

### 动画

- 淡入淡出：300ms ease-in-out
- 卡片悬停：200ms ease
- 流动边框：2s infinite
- 背景动画：10s infinite

## 📄 许可证

MIT License

## 🙏 致谢

- 诗词数据来源：[今日诗词 API](https://www.jinrishici.com/)
- 设计灵感：UI/UX Pro Max

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 Issue
- 发送 Pull Request

---

**每日诗词 - 每天一首好诗，感受中华文化的魅力**