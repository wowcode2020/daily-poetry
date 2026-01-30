# 标签筛选功能使用说明

## 功能概述

每日诗词网站的标签筛选功能允许用户通过分类和标签来筛选诗词，支持多维度筛选，帮助用户快速找到感兴趣的诗词内容。

## 使用方法

### 1. 分类筛选

**操作步骤**：
1. 在页面中找到分类筛选区域
2. 点击不同的分类标签（全部、唐代、宋代、五言诗、七言诗、词）
3. 系统会自动筛选符合该分类的诗词

**分类说明**：
- **全部**：显示所有诗词
- **唐代**：显示唐代诗人的诗词
- **宋代**：显示宋代词人的作品
- **五言诗**：显示五言绝句和五言律诗
- **七言诗**：显示七言绝句和七言律诗
- **词**：显示宋词作品

### 2. 标签筛选

**操作步骤**：
1. 先选择一个分类（如"唐代"）
2. 系统会自动显示该分类相关的标签
3. 点击标签进行筛选（可多选）
4. 再次点击可取消该标签的筛选

**可用标签**：
- 🌸 春天 - 描写春天景象的诗词
- 🌞 夏天 - 描写夏天景象的诗词
- 🍂 秋天 - 描写秋天景象的诗词
- ❄️ 冬天 - 描写冬天景象的诗词
- ❤️ 爱情 - 表达爱情的诗词
- 🏠 思乡 - 表达思乡之情的诗词
- 🌿 自然 - 描写自然风光的诗词
- 🏔️ 山水 - 描写山水景色的诗词
- 🌙 月亮 - 描写月亮的诗词
- 🌊 江河 - 描写江河湖海的诗词

### 3. 清除筛选

**操作步骤**：
1. 点击"清除筛选"按钮
2. 系统会重置所有筛选条件
3. 显示全部诗词

### 4. 查看结果

筛选后，系统会显示：
- 符合条件的诗词数量
- 实时更新的诗词列表
- 可点击诗词查看详情

## 技术实现

### 前端组件

**CategoryFilter.vue** 组件结构：
```
├── 分类标签区域
│   └── v-for 遍历 categories 数组
├── 标签筛选区域（条件显示）
│   └── v-if="selectedCategory && availableTags.length > 0"
│   └── v-for 遍历 availableTags 数组
├── 筛选操作区域
│   └── 清除筛选按钮
│   └── 结果数量显示
```

### 核心逻辑

**1. 分类筛选逻辑**：
```typescript
const filteredResults = computed(() => {
  let results = backupData.poetry;

  if (selectedCategory.value) {
    results = results.filter(poetry => {
      switch (selectedCategory.value) {
        case 'tang':
          return poetry.dynasty === '唐';
        case 'song':
          return poetry.dynasty === '宋';
        case 'five-character':
          return poetry.category?.includes('五言');
        case 'seven-character':
          return poetry.category?.includes('七言');
        case 'ci':
          return poetry.category === '词';
        default:
          return true;
      }
    });
  }

  return results;
});
```

**2. 标签筛选逻辑**：
```typescript
if (selectedTags.value.length > 0) {
  results = results.filter(poetry =>
    selectedTags.value.some(tagId => {
      const tag = backupData.tags.find(t => t.id === tagId);
      return tag && poetry.tags?.includes(tag.name);
    })
  );
}
```

**3. 可用标签计算**：
```typescript
const availableTags = computed(() => {
  if (!selectedCategory.value) {
    return backupData.tags;
  }

  const tagSet = new Set<string>();
  backupData.poetry.forEach(poetry => {
    if (
      (selectedCategory.value === 'tang' && poetry.dynasty === '唐') ||
      (selectedCategory.value === 'song' && poetry.dynasty === '宋')
    ) {
      poetry.tags?.forEach(tag => tagSet.add(tag));
    }
  });

  return backupData.tags.filter(tag => tagSet.has(tag.name));
});
```

### 事件传递

组件通过 `updateResults` 事件向上传递筛选结果：
```typescript
const emit = defineEmits<{
  'updateResults': [results: Poetry[]];
}>();

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId;
  selectedTags.value = [];
  emit('updateResults', filteredResults.value);
};
```

## 常见问题

### Q1: 标签不显示？
**原因**：只有选择了具体分类后，才会显示该分类相关的标签
**解决**：先选择一个分类（如"唐代"），标签区域会自动显示

### Q2: 筛选结果不正确？
**原因**：可能是分类和标签筛选条件组合问题
**解决**：
1. 点击"清除筛选"重置所有条件
2. 单独测试分类筛选
3. 单独测试标签筛选

### Q3: 如何选择多个标签？
**解决**：点击多个标签按钮，系统会筛选同时满足所有选中标签的诗词

### Q4: 筛选结果为0？
**原因**：当前筛选条件没有匹配的诗词
**解决**：尝试其他筛选条件或清除筛选

## 排查步骤

如果筛选功能不工作，请按以下步骤排查：

### 1. 检查控制台错误
- 打开浏览器开发者工具（F12）
- 查看 Console 标签页
- 是否有 JavaScript 错误信息

### 2. 检查数据加载
- 确认 `backupPoetry.json` 文件存在且格式正确
- 确认数据已正确加载到 `backupData` 变量

### 3. 检查事件绑定
- 确认 App.vue 中正确绑定了 `@updateResults` 事件
- 确认 `handleFilterResults` 函数正确接收并处理了结果

### 4. 检查筛选逻辑
- 确认分类ID和诗词数据匹配
- 确认标签ID和诗词标签匹配
- 确认使用可选链操作符（?.）避免空值错误

## 优化建议

### 1. 性能优化
- 大数据量时使用防抖处理
- 使用虚拟列表优化长列表渲染
- 缓存筛选结果避免重复计算

### 2. 用户体验
- 添加加载状态提示
- 保持筛选条件的URL同步
- 添加快捷筛选按钮

### 3. 功能扩展
- 添加按作者筛选
- 添加按朝代+类型的组合筛选
- 添加最近使用的筛选记忆

## 相关文件

- **组件文件**：`src/components/CategoryFilter.vue`
- **数据文件**：`src/data/backupPoetry.json`
- **类型定义**：`src/types/poetry.ts`
- **父组件**：`src/App.vue`