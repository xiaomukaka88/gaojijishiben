# 技术设计文档

## 1. 架构概述

高级记事本采用 Tauri 框架构建,采用前后端分离的架构模式。前端使用 Svelte + TypeScript 开发用户界面,后端使用 Rust 处理系统级操作和文件 I/O。所有资源通过 Tauri 打包为单个 .exe 文件,无需外部依赖。

```
┌─────────────────────────────────────────┐
│         用户界面层 (Frontend)            │
│  Svelte + TypeScript + TailwindCSS      │
├─────────────────────────────────────────┤
│  文本编辑器组件                          │
│  工具栏组件                              │
│  设置面板组件                            │
│  主题管理器                              │
├─────────────────────────────────────────┤
│         业务逻辑层 (Business Logic)      │
│  表达式解析器                            │
│  表达式序列化器                          │
│  表达式漂亮打印器                        │
│  往返验证器                              │
├─────────────────────────────────────────┤
│         数据持久层 (Persistence)         │
│  localStorage API                       │
│  Tauri Store API                        │
├─────────────────────────────────────────┤
│      系统接口层 (System Interface)      │
│  Tauri Commands (Rust)                  │
│  文件系统访问                            │
│  窗口管理                                │
│  剪贴板访问                              │
└─────────────────────────────────────────┘
```

## 2. 技术栈

### 2.1 前端技术

- **框架**: Svelte 4.x
- **语言**: TypeScript 5.x
- **样式**: TailwindCSS 3.x
- **组件库**: shadcn-svelte (UI 组件)
- **状态管理**: Svelte Stores (writable, derived)
- **路由**: 无需路由(单页面应用)
- **构建工具**: Vite 5.x

### 2.2 后端技术

- **框架**: Tauri 2.x
- **语言**: Rust 1.70+
- **窗口管理**: Tauri Window API
- **文件系统**: Tauri FS API
- **剪贴板**: Tauri Clipboard API
- **本地存储**: Tauri Store API

### 2.3 开发工具

- **包管理器**: pnpm
- **代码格式化**: Prettier
- **代码检查**: ESLint + Svelte Check
- **Git**: 版本控制

## 3. 项目结构

```
advanced-notepad/
├── src/
│   ├── lib/
│   │   ├── components/           # Svelte 组件
│   │   │   ├── Editor.svelte     # 文本编辑器
│   │   │   ├── Toolbar.svelte    # 工具栏
│   │   │   ├── SettingsPanel.svelte  # 设置面板
│   │   │   └── ThemeToggle.svelte    # 主题切换
│   │   ├── stores/               # 状态管理
│   │   │   ├── editor.ts         # 编辑器状态
│   │   │   ├── settings.ts       # 设置状态
│   │   │   └── theme.ts          # 主题状态
│   │   ├── parser/               # 表达式解析
│   │   │   ├── lexer.ts          # 词法分析器
│   │   │   ├── parser.ts         # 语法分析器
│   │   │   ├── evaluator.ts      # 表达式求值器
│   │   │   ├── serializer.ts     # 序列化器
│   │   │   ├── pretty-printer.ts # 漂亮打印器
│   │   │   └── roundtrip.ts      # 往返验证
│   │   ├── utils/
│   │   │   ├── image-handler.ts  # 图片处理
│   │   │   ├── storage.ts        # 本地存储
│   │   │   └── math.ts           # 数学函数
│   │   └── types/
│   │       ├── editor.ts         # 编辑器类型
│   │       ├── parser.ts         # 解析器类型
│   │       └── settings.ts       # 设置类型
│   ├── App.svelte                # 主应用组件
│   ├── main.ts                   # 应用入口
│   └── app.css                   # 全局样式
├── src-tauri/
│   ├── src/
│   │   ├── main.rs               # Rust 主程序
│   │   ├── commands/
│   │   │   ├── mod.rs            # 模块声明
│   │   │   ├── window.rs         # 窗口命令
│   │   │   ├── clipboard.rs      # 剪贴板命令
│   │   │   └── fs.rs             # 文件系统命令
│   │   └── lib.rs                # 库入口
│   ├── Cargo.toml                # Rust 依赖
│   ├── tauri.conf.json           # Tauri 配置
│   └── icons/                    # 应用图标
├── public/                       # 静态资源
├── index.html                     # HTML 入口
├── package.json                  # Node.js 依赖
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 配置
├── tailwind.config.js            # TailwindCSS 配置
└── README.md                     # 项目说明
```

## 4. 核心模块设计

### 4.1 文本编辑器组件 (Editor.svelte)

**职责**: 提供文本编辑功能,处理用户输入和显示

**实现要点**:

- 使用 `contenteditable` div 或 textarea 实现编辑区域
- 监听输入事件,触发自动保存
- 监听粘贴事件,处理文本和图片粘贴
- 集成表达式计算逻辑(检测 `=` 号后触发计算)

**状态管理**:

```typescript
interface EditorState {
  content: string;              // 编辑器内容
  cursorPosition: number;       // 光标位置
  selection: { start: number; end: number };  // 文本选择
}
```

**事件处理**:

- `onInput`: 输入时更新内容,触发自动保存
- `onPaste`: 粘贴时判断内容类型(文本/图片)
- `onKeyDown`: 监听 `=` 键触发计算

### 4.2 表达式解析器设计

#### 4.2.1 词法分析器 (lexer.ts)

**职责**: 将输入的数学表达式转换为 Token 序列

**Token 类型定义**:

```typescript
type TokenType =
  | 'NUMBER'
  | 'PLUS'        // +
  | 'MINUS'       // -
  | 'MULTIPLY'    // *
  | 'DIVIDE'      // /
  | 'POWER'       // ^
  | 'LPAREN'      // (
  | 'RPAREN'      // )
  | 'FUNCTION'    // sin, cos, tan, log, exp, sqrt
  | 'COMMA'       // ,
  | 'EOF';

interface Token {
  type: TokenType;
  value: string;
  position: number;
}
```

**实现逻辑**:

1. 逐个字符扫描输入字符串
2. 识别数字、运算符、函数名、括号等
3. 生成 Token 序列
4. 处理错误(非法字符)

#### 4.2.2 语法分析器 (parser.ts)

**职责**: 将 Token 序列转换为抽象语法树(AST)

**AST 节点类型定义**:

```typescript
type ASTNode =
  | NumberNode
  | BinaryOpNode
  | UnaryOpNode
  | FunctionNode
  | GroupNode;

interface NumberNode {
  type: 'Number';
  value: number;
}

interface BinaryOpNode {
  type: 'BinaryOp';
  operator: '+' | '-' | '*' | '/' | '^';
  left: ASTNode;
  right: ASTNode;
}

interface UnaryOpNode {
  type: 'UnaryOp';
  operator: '+' | '-';
  operand: ASTNode;
}

interface FunctionNode {
  type: 'Function';
  name: 'sin' | 'cos' | 'tan' | 'log' | 'exp' | 'sqrt';
  args: ASTNode[];
}

interface GroupNode {
  type: 'Group';
  expression: ASTNode;
}
```

**实现逻辑**:

1. 使用递归下降解析算法
2. 遵循运算符优先级: `()` > `^` > `*/` > `+-`
3. 处理函数调用和括号分组
4. 构建抽象语法树

#### 4.2.3 表达式求值器 (evaluator.ts)

**职责**: 遍历 AST 并计算表达式值

**数学函数实现**:

```typescript
function evaluateSin(node: FunctionNode): number {
  const arg = evaluate(node.args[0]);
  return Math.sin(arg);
}

function evaluateLog(node: FunctionNode): number {
  const arg = evaluate(node.args[0]);
  if (arg <= 0) {
    throw new Error('log函数的参数必须大于0');
  }
  return Math.log(arg);
}

function evaluateExp(node: FunctionNode): number {
  const arg = evaluate(node.args[0]);
  return Math.exp(arg);
}

function evaluateSqrt(node: FunctionNode): number {
  const arg = evaluate(node.args[0]);
  if (arg < 0) {
    throw new Error('sqrt函数的参数必须大于等于0');
  }
  return Math.sqrt(arg);
}
```

**错误处理**:

- 除以零错误
- 函数定义域错误(如 log(-1))
- 语法错误(如括号不匹配)

#### 4.2.4 表达式序列化器 (serializer.ts)

**职责**: 将计算结果格式化为字符串插入到文本中

**格式化规则**:

```typescript
function serializeResult(result: number): string {
  if (Number.isInteger(result)) {
    return result.toString();  // 整数不带小数点
  } else {
    return result.toFixed(4);  // 浮点数保留4位小数
  }
}

function serializeError(error: Error): string {
  return `[错误: ${error.message}]`;
}
```

#### 4.2.5 表达式漂亮打印器 (pretty-printer.ts)

**职责**: 将 AST 格式化为可读的缩进形式

**输出格式示例**:

```
BinaryOp: +
  left: Function: sin
    args[0]: Number: 3.14
  right: Function: cos
    args[0]: Number: 1.57
```

#### 4.2.6 往返验证器 (roundtrip.ts)

**职责**: 验证解析和序列化的正确性

**验证流程**:

1. 解析原始文本 → AST1
2. 使用漂亮打印器将 AST1 转换为文本
3. 重新解析文本 → AST2
4. 比较 AST1 和 AST2 是否相同
5. 输出验证结果或差异报告

### 4.3 图片处理模块 (image-handler.ts)

**职责**: 处理图片粘贴和存储

**实现要点**:

1. 监听粘贴事件
2. 检查剪贴板内容类型
3. 如果是图片,转换为 Base64 字符串
4. 在光标位置插入 Markdown 格式的图片标记

```typescript
async function handlePaste(event: ClipboardEvent): Promise<void> {
  const items = event.clipboardData?.items;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile();
      const base64 = await blobToBase64(blob);
      const imageMarkdown = `![图片](data:${blob.type};base64,${base64})`;
      insertAtCursor(imageMarkdown);
      event.preventDefault();
    }
  }
}
```

### 4.4 设置管理模块 (settings.ts)

**职责**: 管理应用程序的各种设置

**设置项定义**:

```typescript
interface Settings {
  opacity: number;        // 窗口透明度 0.2-1.0
  fontSize: number;       // 字体大小 12-48px
  alwaysOnTop: boolean;   // 置顶显示
  theme: 'light' | 'dark'; // 主题模式
  autoSave: boolean;      // 自动保存开关
  autoSaveInterval: number; // 自动保存间隔(毫秒)
}
```

**存储策略**:

- 使用 `localStorage` 存储设置
- 应用启动时加载设置
- 设置变更时立即保存

### 4.5 主题管理模块 (theme.ts)

**职责**: 管理深色/浅色主题切换

**主题定义**:

```typescript
interface Theme {
  name: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    surface: string;
    border: string;
    primary: string;
    secondary: string;
  };
}

const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    surface: '#f5f5f5',
    border: '#e0e0e0',
    primary: '#3b82f6',
    secondary: '#6b7280',
  },
};

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#1a1a1a',
    foreground: '#ffffff',
    surface: '#2d2d2d',
    border: '#404040',
    primary: '#60a5fa',
    secondary: '#9ca3af',
  },
};
```

**实现要点**:

- 使用 CSS 变量定义颜色
- 主题切换时更新 CSS 变量值
- 监听系统主题偏好(可选)

### 4.6 窗口管理 (Tauri Commands)

**职责**: 处理窗口透明度和置顶设置

**Rust 命令定义**:

```rust
#[tauri::command]
async fn set_window_opacity(window: tauri::Window, opacity: f64) -> Result<(), String> {
    window.set_decorations(false)?;
    window.set_always_on_top(false)?;
    window.set_ignore_cursor_events(false)?;
    window.set_transparent(true)?;
    window.set_opacity(opacity)?;
    Ok(())
}

#[tauri::command]
async fn set_window_always_on_top(window: tauri::Window, always_on_top: bool) -> Result<(), String> {
    window.set_always_on_top(always_on_top)?;
    Ok(())
}
```

**前端调用**:

```typescript
import { invoke } from '@tauri-apps/api/core';

async function setOpacity(value: number) {
  await invoke('set_window_opacity', { opacity: value });
}

async function setAlwaysOnTop(value: boolean) {
  await invoke('set_window_always_on_top', { alwaysOnTop: value });
}
```

### 4.7 数据持久化

**职责**: 自动保存编辑器内容

**实现方案**:

```typescript
class EditorStorage {
  private readonly STORAGE_KEY = 'advanced-notepad-content';

  async save(content: string): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, content);
      // 同时使用 Tauri Store 作为备份
      await invoke('save_content', { content });
    } catch (error) {
      console.error('保存失败:', error);
    }
  }

  async load(): Promise<string> {
    try {
      // 优先从 localStorage 读取
      const content = localStorage.getItem(this.STORAGE_KEY);
      if (content) return content;

      // 如果 localStorage 为空,尝试从 Tauri Store 读取
      return await invoke('load_content') || '';
    } catch (error) {
      console.error('加载失败:', error);
      return '';
    }
  }
}
```

**自动保存策略**:

- 输入防抖(500ms)后触发保存
- 窗口失去焦点时立即保存
- 应用关闭前强制保存

## 5. 用户界面设计

### 5.1 主界面布局

```
┌─────────────────────────────────────────┐
│  [文件] [编辑] [视图] [帮助]  [⚙️ 设置]  │ ← 菜单栏
├─────────────────────────────────────────┤
│  📋 📷 [🌓/🌙] [📌]  [A-] [字体大小] [A+] │ ← 工具栏
├─────────────────────────────────────────┤
│                                         │
│                                         │
│          文本编辑区域                   │
│                                         │
│                                         │
└─────────────────────────────────────────┘
└─────────────────────────────────────────┘
```

### 5.2 设置面板

设置面板包含以下选项:

1. **外观设置**
   - 透明度滑动条(20% - 100%)
   - 字体大小调节(12px - 48px)
   - 主题切换(深色/浅色)

2. **编辑设置**
   - 自动保存开关
   - 自动保存间隔(1s - 60s)

3. **窗口设置**
   - 置顶显示开关

### 5.3 响应式设计

- 自适应窗口大小
- 最小窗口尺寸: 800x600
- 支持全屏模式

## 6. 打包配置

### 6.1 Tauri 打包配置 (tauri.conf.json)

```json
{
  "build": {
    "beforeDevCommand": "pnpm run dev",
    "beforeBuildCommand": "pnpm run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "identifier": "com.advanced-notepad.app",
    "publisher": "Advanced Notepad"
  },
  "app": {
    "windows": [
      {
        "title": "高级记事本",
        "width": 1024,
        "height": 768,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  }
}
```

### 6.2 单文件打包

Tauri 默认打包为单个 .exe 文件,包含所有依赖和资源。

**打包命令**:

```bash
pnpm tauri build
```

**输出位置**:

- Windows: `src-tauri/target/release/advanced-notepad.exe`

## 7. 开发流程

### 7.1 环境准备

```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Node.js 18+
# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install
```

### 7.2 开发模式

```bash
# 启动开发服务器(热重载)
pnpm run dev

# 单独启动 Tauri 后端
pnpm run tauri dev
```

### 7.3 构建打包

```bash
# 构建生产版本
pnpm run build

# 打包为 .exe
pnpm run tauri build
```

## 8. 测试策略

### 8.1 单元测试

- 表达式解析器测试
- 数学函数测试
- 序列化器测试
- 往返验证测试

### 8.2 集成测试

- 自动保存功能测试
- 图片粘贴功能测试
- 设置持久化测试

### 8.3 E2E 测试

- 用户场景测试(如:输入表达式→按下=→查看结果)
- 跨平台兼容性测试

## 9. 性能优化

### 9.1 前端优化

- 使用 Svelte 的响应式特性减少重渲染
- 虚拟滚动(长文本场景)
- 图片懒加载

### 9.2 后端优化

- 避免频繁的 Rust ↔ JS 通信
- 批量操作减少 IPC 调用
- 使用 Web Worker 处理复杂计算

### 9.3 打包优化

- Tree-shaking 删除未使用代码
- 压缩资源文件
- 优化 Rust 编译选项

## 10. 安全考虑

- XSS 防护(对用户输入进行转义)
- 沙箱隔离(Tauri 提供安全边界)
- 文件系统访问限制
- 剪贴板访问限制

## 11. 未来扩展

- 支持多文档标签页
- 支持 Markdown 渲染
- 支持代码高亮
- 支持插件系统
- 支持云同步

## 12. 依赖清单

### 前端依赖

```json
{
  "dependencies": {
    "svelte": "^4.0.0",
    "@tauri-apps/api": "^2.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "svelte-check": "^3.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### Rust 依赖 (Cargo.toml)

```toml
[dependencies]
tauri = { version = "2.0", features = ["shell-open"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
```
