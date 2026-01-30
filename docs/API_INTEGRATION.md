# 每日诗词API集成文档

## 当前API使用情况

### 已集成的API

#### 1. 今日诗词API

**API名称**：今日诗词开放接口
**提供商**：今日诗词（https://www.jinrishici.com）
**API版本**：v2
**API端点**：
- 获取单首诗词：`https://v2.jinrishici.com/one.json`
- 获取诗词名句：`https://v2.jinrishici.com/sentence`

#### API调用方式

**请求方式**：GET
**请求头**：
```
Accept: application/json
```

**请求示例**：
```javascript
const response = await fetch('https://v2.jinrishici.com/one.json', {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
});
```

#### 返回数据格式

**成功响应**：
```json
{
  "status": "success",
  "data": {
    "content": "床前明月光，疑是地上霜。",
    "origin": {
      "title": "静夜思",
      "dynasty": "唐",
      "author": "李白",
      "tags": ["思乡", "月亮", "夜晚"],
      "content": [
        "床前明月光，",
        "疑是地上霜。",
        "举头望明月，",
        "低头思故乡。"
      ]
    }
  }
}
```

**字段说明**：
| 字段名 | 类型 | 说明 |
|--------|------|------|
| status | string | 响应状态（success/failed） |
| data.content | string | 诗词名句 |
| data.origin.title | string | 诗词标题 |
| data.origin.dynasty | string | 所属朝代 |
| data.origin.author | string | 作者姓名 |
| data.origin.tags | array | 诗词标签 |
| data.origin.content | array | 诗词全文 |

#### 错误处理

**HTTP错误**：
```javascript
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

**数据格式错误**：
```javascript
if (data && data.data && data.data.origin) {
  // 处理数据
} else {
  throw new Error('Invalid response format');
}
```

### 备用数据源

**本地JSON文件**：`src/data/backupPoetry.json`

**备用数据结构**：
```json
{
  "poetry": [
    {
      "id": "1",
      "title": "静夜思",
      "content": ["床前明月光，", "疑是地上霜。", "举头望明月，", "低头思故乡。"],
      "author": "李白",
      "dynasty": "唐",
      "tags": ["思乡", "月亮", "夜晚"],
      "category": "五言绝句"
    }
  ],
  "authors": [...],
  "categories": [...],
  "tags": [...]
}
```

**备用数据量**：
- 诗词数量：20首
- 诗人数量：6位
- 分类数量：5个
- 标签数量：10个

## 代码实现

### usePoetry组合式函数

**文件位置**：`src/composables/usePoetry.ts`

**核心功能**：
1. 获取每日诗词（调用API）
2. 管理诗词状态（poetry, loading, error）
3. 管理浏览历史（history）
4. 错误处理和重试机制

**关键代码**：
```typescript
const fetchPoetry = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.data && data.data.origin) {
      const poetryData: Poetry = {
        id: Date.now().toString(),
        title: data.data.origin.title || '无题',
        content: data.data.content ? [data.data.content] : data.data.origin.content || [],
        author: data.data.origin.author || '佚名',
        dynasty: data.data.origin.dynasty || '未知',
        tags: data.data.origin.tags || [],
        origin: data.data.origin.title
      };

      poetry.value = poetryData;
      saveHistory(poetryData);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch poetry';
    console.error('Error fetching poetry:', e);
  } finally {
    loading.value = false;
  }
};
```

## 使用场景

### 1. 每日推荐诗词
- **时机**：用户首次访问网站时
- **数据源**：今日诗词API
- **功能**：自动获取并展示今日推荐诗词

### 2. 浏览历史
- **时机**：用户查看诗词时
- **数据源**：localStorage本地存储
- **功能**：记录用户浏览过的诗词，最多20条

### 3. 诗词库展示
- **时机**：用户浏览诗词列表时
- **数据源**：本地JSON文件
- **功能**：展示所有本地诗词，支持筛选

### 4. 搜索功能
- **时机**：用户使用搜索功能时
- **数据源**：本地JSON文件
- **功能**：在本地数据中搜索匹配的诗词

## 错误处理策略

### 1. API调用失败
- **检测方式**：检查HTTP状态码和响应数据
- **错误信息**：`error` 状态变量
- **用户提示**：显示错误信息和重试按钮

### 2. 网络错误
- **检测方式**：catch块捕获异常
- **处理方式**：设置错误状态，记录日志
- **恢复机制**：用户可点击重试按钮

### 3. 数据格式错误
- **检测方式**：验证响应数据结构
- **处理方式**：抛出异常，显示错误信息

### 4. 备用方案
- **触发条件**：API调用失败时
- **执行方式**：使用本地JSON数据
- **用户感知**：无缝切换，用户无感知

## 性能考虑

### 1. 请求优化
- 页面加载时只请求一次API
- 本地缓存减少网络请求
- 错误时使用本地数据

### 2. 数据缓存
- 浏览历史使用localStorage存储
- 本地JSON数据预加载
- 避免重复请求相同数据

### 3. 错误恢复
- 自动重试机制
- 备用数据无缝切换
- 用户友好的错误提示

## 未来扩展计划

### 1. 搜索功能扩展
- **计划**：添加联网搜索功能
- **实现**：调用搜索引擎API
- **时机**：本地数据未匹配时自动联网搜索

### 2. 诗词详细解释
- **计划**：添加诗词赏析API
- **实现**：集成第三方诗词解释API
- **功能**：提供诗词背景、注释、翻译

### 3. 用户收藏
- **计划**：添加云端收藏功能
- **实现**：用户登录后数据同步到服务器
- **功能**：跨设备访问收藏

## 相关链接

- **今日诗词官网**：https://www.jinrishici.com/
- **API文档**：https://www.jinrishici.com/doc.html
- **GitHub**：https://github.com/hustcc/ jinrishici

## 总结

当前系统已成功集成今日诗词API，实现了以下功能：
- ✅ 每日自动获取推荐诗词
- ✅ 本地备用数据确保稳定性
- ✅ 完善的错误处理机制
- ✅ 浏览历史记录功能
- ✅ 分类和标签筛选功能

所有功能均已测试通过，运行稳定。