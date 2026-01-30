# 部署指南

本指南将帮助你将"每日诗词"网站免费部署到Vercel。

## 📋 前置要求

- 一个GitHub账号
- 一个Vercel账号（可以使用GitHub账号登录）
- Git已安装并配置

## 🚀 部署步骤

### 方法1：通过Vercel CLI部署（推荐）

#### 1. 安装Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录Vercel

```bash
vercel login
```

按照提示选择登录方式（推荐使用GitHub）

#### 3. 初始化Git仓库（如果还没有）

```bash
cd daily-poetry
git init
git add .
git commit -m "Initial commit"
```

#### 4. 部署到Vercel

```bash
vercel
```

按照提示完成以下步骤：

1. **Set up and deploy?** → `Y`
2. **Which scope do you want to deploy to?** → 选择你的账号
3. **Link to existing project?** → `N`
4. **What's your project's name?** → 输入项目名称（如：daily-poetry）
5. **In which directory is your code located?** → 按Enter使用当前目录
6. **Want to modify these settings?** → `N`

等待部署完成，你会获得一个Vercel URL（如：https://daily-poetry.vercel.app）

#### 5. 生产环境部署

```bash
vercel --prod
```

### 方法2：通过GitHub + Vercel Dashboard部署

#### 1. 推送代码到GitHub

```bash
cd daily-poetry
git init
git add .
git commit -m "Initial commit"

# 创建GitHub仓库后，添加远程仓库
git remote add origin https://github.com/你的用户名/daily-poetry.git
git branch -M main
git push -u origin main
```

#### 2. 在Vercel中导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 点击 "Import" 按钮导入你的GitHub仓库
4. Vercel会自动检测到Vite项目
5. 点击 "Deploy" 按钮

#### 3. 等待部署完成

部署完成后，你会获得一个URL，如：https://daily-poetry.vercel.app

### 方法3：通过Vercel Dashboard手动部署

#### 1. 准备项目

确保项目根目录包含：
- `package.json`
- `vercel.json`（已包含）
- `.gitignore`（已包含）

#### 2. 登录Vercel Dashboard

访问 [https://vercel.com/dashboard](https://vercel.com/dashboard)

#### 3. 创建新项目

1. 点击 "Add New..." → "Project"
2. 选择 "Continue with GitHub"
3. 授权Vercel访问你的GitHub仓库
4. 选择或创建一个新的GitHub仓库
5. 点击 "Import"

#### 4. 配置项目

Vercel会自动检测到以下配置：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

如果配置正确，直接点击 "Deploy"

#### 5. 等待部署

部署通常需要1-2分钟，完成后会显示成功页面和URL

## 🎯 自定义域名（可选）

### 添加自定义域名

1. 在Vercel Dashboard中打开你的项目
2. 点击 "Settings" → "Domains"
3. 输入你的域名（如：poetry.yourdomain.com）
4. 按照提示配置DNS记录

### 免费域名选项

- Freenom（免费域名，如：.tk, .ml, .ga）
- GitHub Pages（使用yourname.github.io）
- Netlify（使用netlify.app子域名）

## 🔄 更新网站

### 方法1：通过Git推送更新

```bash
git add .
git commit -m "Update website"
git push
```

Vercel会自动检测到推送并重新部署

### 方法2：通过Vercel CLI

```bash
vercel --prod
```

## 📊 监控和分析

### 查看部署日志

1. 打开Vercel Dashboard
2. 选择你的项目
3. 点击 "Deployments"
4. 点击任意部署查看日志

### 查看访问统计

1. 打开Vercel Dashboard
2. 选择你的项目
3. 点击 "Analytics"

## 🐛 常见问题

### 1. 部署失败

**问题**：构建失败

**解决方案**：
- 检查`package.json`中的scripts是否正确
- 确保所有依赖都在`dependencies`或`devDependencies`中
- 查看构建日志了解具体错误

### 2. API调用失败

**问题**：诗词无法加载

**解决方案**：
- 检查今日诗词API是否正常工作
- 确认API URL正确：`https://v2.jinrishici.com/one.json`
- 查看浏览器控制台的错误信息

### 3. 样式加载问题

**问题**：CSS样式不正确

**解决方案**：
- 确认CSS文件路径正确
- 检查浏览器缓存
- 清除浏览器缓存后重试

### 4. 本地可以，部署后不行

**问题**：本地开发正常，部署后有问题

**解决方案**：
- 检查相对路径是否正确
- 确认API调用是否受CORS限制
- 查看Vercel部署日志

## 💡 优化建议

### 1. 性能优化

- 启用图片压缩
- 使用CDN加速
- 启用Gzip压缩（Vercel默认启用）

### 2. SEO优化

- 已添加meta标签
- 可以添加sitemap.xml
- 可以添加robots.txt

### 3. 安全性

- 启用HTTPS（Vercel默认启用）
- 添加安全headers
- 定期更新依赖

## 📞 获取帮助

如果遇到问题：

1. 查看 [Vercel文档](https://vercel.com/docs)
2. 搜索 [Vercel社区](https://vercel.com/community)
3. 查看项目Issues
4. 提交新的Issue

## ✅ 部署检查清单

部署前确认：

- [ ] 代码已提交到Git仓库
- [ ] `package.json`配置正确
- [ ] `vercel.json`配置正确
- [ ] 本地构建成功（`npm run build`）
- [ ] 所有依赖已安装
- [ ] API调用正常工作

部署后确认：

- [ ] 网站可以访问
- [ ] 诗词可以正常加载
- [ ] 主题切换功能正常
- [ ] 响应式设计正常
- [ ] 分享功能正常
- [ ] 历史浏览功能正常

---

**恭喜！你的每日诗词网站已成功部署！** 🎉