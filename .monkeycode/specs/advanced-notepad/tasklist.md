{
  "project": "advanced-notepad",
  "version": "1.0.0",
  "created": "2026-02-05",
  "tasks": [
    {
      "id": "1",
      "title": "项目初始化与环境配置",
      "description": "初始化 Tauri + Svelte + TypeScript 项目,配置开发环境和构建工具",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 2,
      "dependencies": [],
      "subtasks": [
        "使用 pnpm create tauri-app 初始化项目,选择 Svelte + TypeScript 模板",
        "配置 Vite 开发服务器,设置 allowedHosts 为 *.monkeycode-ai.online",
        "安装和配置 TailwindCSS",
        "配置 ESLint、Prettier 和 Svelte Check",
        "创建项目目录结构 (src/lib/components, src/lib/stores, src/lib/parser, etc.)",
        "配置 TypeScript 严格模式"
      ]
    },
    {
      "id": "2",
      "title": "实现文本编辑器组件",
      "description": "创建基础的文本编辑器组件,支持文本输入、选择、复制、粘贴、剪切等基本操作",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 4,
      "dependencies": ["1"],
      "subtasks": [
        "创建 Editor.svelte 组件,使用 contenteditable 实现编辑区域",
        "实现光标位置跟踪功能",
        "实现文本选择跟踪功能",
        "实现复制、粘贴、剪切操作的监听和处理",
        "实现撤销/重做功能",
        "添加基本样式和响应式布局"
      ]
    },
    {
      "id": "3",
      "title": "实现表达式词法分析器",
      "description": "创建词法分析器,将数学表达式转换为 Token 序列",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["1"],
      "subtasks": [
        "定义 TokenType 类型 (NUMBER, PLUS, MINUS, MULTIPLY, DIVIDE, POWER, LPAREN, RPAREN, FUNCTION, COMMA, EOF)",
        "定义 Token 接口,包含 type、value、position 属性",
        "实现 Lexer 类,逐个字符扫描输入字符串",
        "实现数字识别逻辑 (支持整数和小数)",
        "实现运算符识别逻辑",
        "实现函数名识别逻辑 (sin, cos, tan, log, exp, sqrt)",
        "实现括号识别逻辑",
        "实现错误处理,识别非法字符并抛出有意义错误信息",
        "编写单元测试验证各种输入场景"
      ]
    },
    {
      "id": "4",
      "title": "实现表达式语法分析器",
      "description": "创建语法分析器,将 Token 序列转换为抽象语法树(AST)",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 5,
      "estimatedHours": 4,
      "dependencies": ["3"],
      "subtasks": [
        "定义 AST 节点类型 (NumberNode, BinaryOpNode, UnaryOpNode, FunctionNode, GroupNode)",
        "实现 Parser 类,使用递归下降解析算法",
        "实现 parseExpression 方法处理加减运算",
        "实现 parseTerm 方法处理乘除运算",
        "实现 parseFactor 方法处理幂运算和一元运算符",
        "实现 parsePrimary 方法处理数字、函数调用和括号分组",
        "实现 parseFunction 方法处理函数调用",
        "实现运算符优先级逻辑: () > ^ > */ > +-",
        "实现嵌套括号处理",
        "实现错误处理,检测语法错误并抛出详细错误信息",
        "编写单元测试验证各种表达式结构"
      ]
    },
    {
      "id": "5",
      "title": "实现表达式求值器",
      "description": "创建表达式求值器,遍历 AST 并计算表达式值",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 4,
      "dependencies": ["4"],
      "subtasks": [
        "实现 Evaluator 类,包含 evaluate 方法",
        "实现 NumberNode 求值逻辑",
        "实现 BinaryOpNode 求值逻辑 (加、减、乘、除、幂)",
        "实现 UnaryOpNode 求值逻辑 (正负号)",
        "实现 FunctionNode 求值逻辑 (sin, cos, tan, log, exp, sqrt)",
        "实现 GroupNode 求值逻辑",
        "实现数学函数: sin, cos, tan (使用 Math.sin, Math.cos, Math.tan)",
        "实现数学函数: log, exp (使用 Math.log, Math.exp)",
        "实现数学函数: sqrt (使用 Math.sqrt)",
        "实现除以零错误处理",
        "实现函数定义域错误处理 (log(x) x>0, sqrt(x) x>=0, tan(x) x!=pi/2+k*pi)",
        "编写单元测试验证各种计算场景和错误处理"
      ]
    },
    {
      "id": "6",
      "title": "实现表达式序列化器",
      "description": "创建序列化器,将计算结果格式化为字符串插入到文本中",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 2,
      "dependencies": ["5"],
      "subtasks": [
        "实现 Serializer 类",
        "实现 serializeResult 方法,格式化数值结果",
        "实现整数格式化 (不带小数点)",
        "实现浮点数格式化 (保留4位小数)",
        "实现科学计数法转换 (将大数转换为标准小数格式)",
        "实现负数格式化 (保留负号)",
        "实现 serializeError 方法,格式化错误信息",
        "编写单元测试验证各种格式化场景"
      ]
    },
    {
      "id": "7",
      "title": "实现表达式漂亮打印器",
      "description": "创建漂亮打印器,将 AST 格式化为可读的缩进形式,用于调试和验证",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 2,
      "dependencies": ["4"],
      "subtasks": [
        "实现 PrettyPrinter 类",
        "实现 print 方法,遍历 AST 生成格式化文本",
        "实现缩进逻辑,按照 AST 层级进行缩进",
        "实现 NumberNode 打印逻辑",
        "实现 BinaryOpNode 打印逻辑 (左右子节点独立行显示)",
        "实现 UnaryOpNode 打印逻辑",
        "实现 FunctionNode 打印逻辑 (函数名和参数独立行显示)",
        "实现 GroupNode 打印逻辑 (使用缩进表示分组)",
        "实现错误节点打印逻辑 (标记错误位置和类型)",
        "编写单元测试验证打印输出格式"
      ]
    },
    {
      "id": "8",
      "title": "实现表达式往返验证",
      "description": "创建往返验证器,验证表达式的解析和序列化过程是否正确",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["6", "7"],
      "subtasks": [
        "实现 RoundtripValidator 类",
        "实现 validate 方法,执行往返验证流程",
        "实现文本 → AST1 的解析过程",
        "实现 AST1 → 文本 的漂亮打印过程",
        "实现 文本 → AST2 的重新解析过程",
        "实现 AST1 和 AST2 的深度比较逻辑",
        "实现空白字符保留逻辑 (保留语义无关的空白)",
        "实现括号结构保留逻辑",
        "实现差异报告生成 (记录验证失败的具体位置和类型)",
        "编写单元测试验证各种表达式的往返正确性",
        "编写边界情况测试 (嵌套括号、复杂函数调用等)"
      ]
    },
    {
      "id": "9",
      "title": "集成行内计算功能到编辑器",
      "description": "将表达式计算功能集成到编辑器中,实现按等号键触发行的行内计算",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 4,
      "dependencies": ["2", "5", "6"],
      "subtasks": [
        "在编辑器中实现等号键监听 (onKeyDown 事件)",
        "实现当前行检测逻辑 (从光标位置向前找到行首,向后找到行尾)",
        "实现行内表达式提取逻辑 (检测行中最后一个 = 号前的内容)",
        "实现表达式调用流程: Lexer → Parser → Evaluator → Serializer",
        "实现计算结果插入逻辑 (在 = 号后插入结果,替换原 = 号)",
        "实现错误信息插入逻辑 (在 = 号后插入 [错误: 原因])",
        "实现多行表达式处理 (如果一行包含多个表达式,分别计算)",
        "实现防抖逻辑 (避免快速连按等号导致多次计算)",
        "编写集成测试验证各种计算场景",
        "编写用户体验测试 (响应速度、错误提示等)"
      ]
    },
    {
      "id": "10",
      "title": "实现自动保存功能",
      "description": "实现编辑器内容的自动保存机制,使用 localStorage 存储数据",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["2"],
      "subtasks": [
        "创建 EditorStorage 类,封装存储逻辑",
        "实现 save 方法,使用 localStorage.setItem 保存内容",
        "实现 load 方法,使用 localStorage.getItem 加载内容",
        "在编辑器 onInput 事件中集成防抖保存逻辑 (500ms 防抖)",
        "实现窗口失去焦点时立即保存 (onBlur 事件)",
        "实现应用关闭前强制保存 (beforeunload 事件)",
        "实现应用启动时加载上次保存的内容",
        "实现保存失败错误处理 (捕获异常并提示用户)",
        "添加保存状态指示器 (显示未保存/已保存状态)",
        "编写集成测试验证自动保存和恢复功能"
      ]
    },
    {
      "id": "11",
      "title": "实现图片粘贴功能",
      "description": "实现将剪贴板中的图片直接粘贴到编辑器中的功能,使用 Base64 编码存储",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 4,
      "dependencies": ["2"],
      "subtasks": [
        "创建 ImageHandler 类,封装图片处理逻辑",
        "在编辑器中实现粘贴事件监听 (onPaste 事件)",
        "实现剪贴板内容类型检测 (Clipboard API)",
        "实现图片数据提取逻辑 (getAsString 或 getAsFile)",
        "实现图片到 Base64 转换逻辑 (FileReader)",
        "实现 Markdown 格式图片标记生成: ![图片](data:image/png;base64,...)",
        "实现光标位置插入逻辑 (insertText 方法)",
        "实现非图片内容的降级处理 (按照文本粘贴规则处理)",
        "实现大图片大小限制 (超过限制提示用户)",
        "实现图片预览功能 (在编辑器中直接显示图片)",
        "编写单元测试验证各种图片格式 (PNG, JPG, GIF, WebP)",
        "编写集成测试验证粘贴流程和存储恢复"
      ]
    },
    {
      "id": "12",
      "title": "实现窗口管理 Tauri 命令",
      "description": "在 Rust 后端实现窗口透明度和置顶设置的 Tauri 命令",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["1"],
      "subtasks": [
        "在 src-tauri/src/commands 目录创建 window.rs 文件",
        "实现 set_window_opacity 命令,调用 window.set_opacity",
        "实现 set_window_always_on_top 命令,调用 window.set_always_on_top",
        "实现 set_window_decorations 命令,控制窗口边框显示",
        "实现 set_window_transparent 命令,控制窗口透明",
        "在 src-tauri/src/commands/mod.rs 中声明和导出命令模块",
        "在 src-tauri/src/lib.rs 中注册所有窗口相关命令",
        "编写单元测试验证命令执行",
        "测试命令在不同操作系统上的兼容性"
      ]
    },
    {
      "id": "13",
      "title": "实现设置管理模块",
      "description": "创建设置管理模块,管理应用程序的各种设置(透明度、字体大小、置顶、主题等)",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["12"],
      "subtasks": [
        "定义 Settings 接口 (opacity, fontSize, alwaysOnTop, theme, autoSave, autoSaveInterval)",
        "创建 SettingsStore (Svelte writable store)",
        "实现默认设置值",
        "实现从 localStorage 加载设置 (应用启动时)",
        "实现设置保存到 localStorage (设置变更时)",
        "实现设置变更的响应式更新 (订阅 store 变化)",
        "实现设置项的验证逻辑 (如 opacity 范围 0.2-1.0, fontSize 范围 12-48)",
        "编写单元测试验证设置加载、保存和验证逻辑"
      ]
    },
    {
      "id": "14",
      "title": "实现窗口透明度调节",
      "description": "实现窗口透明度调节功能,用户可以通过滑动条调节透明度",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 2,
      "dependencies": ["13"],
      "subtasks": [
        "创建 OpacitySlider 组件 (使用 HTML input type=range)",
        "设置滑动条范围 (20-100) 和步长 (1)",
        "实现滑动值到透明度的转换 (value / 100)",
        "调用 Tauri set_window_opacity 命令更新窗口透明度",
        "实现实时预览 (拖动时实时更新窗口透明度)",
        "将透明度值绑定到 SettingsStore",
        "添加透明度数值显示标签",
        "编写集成测试验证透明度调节和持久化"
      ]
    },
    {
      "id": "15",
      "title": "实现字体大小调节",
      "description": "实现字体大小调节功能,用户可以通过按钮或滑动条调节编辑器字体大小",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 2,
      "dependencies": ["13"],
      "subtasks": [
        "创建 FontSizeControl 组件 (包含 A-、A+ 按钮和滑动条)",
        "设置字体大小范围 (12-48px) 和步长 (1px)",
        "实现字体大小增加/减少逻辑",
        "将字体大小值绑定到编辑器的 style.fontSize 属性",
        "将字体大小值绑定到 SettingsStore",
        "实现字体大小的实时预览",
        "添加当前字体大小显示标签",
        "编写集成测试验证字体大小调节和持久化"
      ]
    },
    {
      "id": "16",
      "title": "实现置顶显示功能",
      "description": "实现置顶显示功能,用户可以切换窗口是否始终显示在最上层",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 2,
      "dependencies": ["13"],
      "subtasks": [
        "创建 PinToggle 组件 (复选框或开关)",
        "调用 Tauri set_window_always_on_top 命令更新置顶状态",
        "将置顶状态绑定到 SettingsStore",
        "实现置顶状态的视觉反馈 (高亮或图标变化)",
        "实现置顶状态持久化",
        "编写集成测试验证置顶功能切换和持久化"
      ]
    },
    {
      "id": "17",
      "title": "实现主题管理模块",
      "description": "实现深色/浅色主题切换功能,使用 CSS 变量定义主题颜色",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["1"],
      "subtasks": [
        "定义 Theme 接口,包含 name 和 colors 属性",
        "定义 lightTheme 和 darkTheme 常量",
        "创建 ThemeStore (Svelte writable store)",
        "使用 CSS 变量定义主题颜色 (--bg-color, --fg-color, --surface-color, etc.)",
        "实现 setTheme 函数,更新 CSS 变量值",
        "创建 ThemeToggle 组件 (按钮或切换开关,显示 🌓/🌙 图标)",
        "实现主题切换逻辑 (light ↔ dark)",
        "将主题状态绑定到 SettingsStore",
        "实现主题状态持久化",
        "实现系统主题偏好检测 (可选功能,监听 prefers-color-scheme)",
        "编写集成测试验证主题切换和持久化"
      ]
    },
    {
      "id": "18",
      "title": "创建工具栏组件",
      "description": "创建工具栏组件,包含常用操作按钮和设置入口",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 2,
      "dependencies": ["14", "15", "16", "17"],
      "subtasks": [
        "创建 Toolbar.svelte 组件",
        "添加文件操作按钮 (复制、粘贴、剪切、清空)",
        "添加图片粘贴按钮 (触发剪贴板检查和粘贴)",
        "集成 ThemeToggle 组件",
        "集成 PinToggle 组件",
        "添加字体大小调节控件",
        "添加设置面板入口按钮 (⚙️ 图标)",
        "实现工具栏布局和样式 (使用 TailwindCSS)",
        "实现按钮悬停和点击效果",
        "编写集成测试验证工具栏功能"
      ]
    },
    {
      "id": "19",
      "title": "创建设置面板组件",
      "description": "创建设置面板组件,提供所有设置的集中管理界面",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["14", "15", "16", "17"],
      "subtasks": [
        "创建 SettingsPanel.svelte 组件",
        "实现面板显示/隐藏逻辑 (模态对话框或侧边栏)",
        "添加外观设置分组 (透明度、字体大小、主题)",
        "集成 OpacitySlider 组件",
        "集成 FontSizeControl 组件",
        "集成 ThemeToggle 组件",
        "添加编辑设置分组 (自动保存开关、自动保存间隔)",
        "添加窗口设置分组 (置顶显示开关)",
        "实现设置重置功能 (恢复默认设置)",
        "实现设置应用和取消按钮",
        "编写集成测试验证设置面板功能"
      ]
    },
    {
      "id": "20",
      "title": "实现主应用组件和布局",
      "description": "创建主应用组件,整合所有子组件,实现完整的用户界面",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["2", "18", "19"],
      "subtasks": [
        "创建 App.svelte 主组件",
        "实现主界面布局 (菜单栏、工具栏、编辑区域)",
        "集成 Toolbar 组件",
        "集成 Editor 组件",
        "集成 SettingsPanel 组件",
        "实现组件间通信 (使用 Svelte Stores 或事件)",
        "实现响应式布局 (自适应窗口大小)",
        "添加全局样式 (CSS 变量、通用样式)",
        "实现应用初始化逻辑 (加载设置、加载编辑器内容)",
        "编写集成测试验证完整应用流程"
      ]
    },
    {
      "id": "21",
      "title": "配置 Tauri 打包",
      "description": "配置 Tauri 打包选项,确保生成单个 .exe 文件",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 2,
      "dependencies": ["20"],
      "subtasks": [
        "配置 tauri.conf.json 的 build 选项",
        "配置 frontendDist 指向构建输出目录",
        "配置 bundle 选项 (targets, icon, identifier, publisher)",
        "配置 app.windows 选项 (title, width, height, resizable)",
        "配置安全选项 (security.csp)",
        "准备应用图标文件 (32x32.png, 128x128.png, 128x128@2x.png, icon.ico, icon.icns)",
        "测试开发模式启动 (pnpm run dev)",
        "测试生产构建 (pnpm run build)",
        "测试打包命令 (pnpm run tauri build)",
        "验证生成的 .exe 文件包含所有依赖和资源",
        "验证 .exe 文件可以直接运行,无需安装其他依赖"
      ]
    },
    {
      "id": "22",
      "title": "编写单元测试",
      "description": "为所有核心模块编写单元测试,确保代码质量和功能正确性",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 8,
      "dependencies": ["3", "4", "5", "6", "7", "8"],
      "subtasks": [
        "配置测试框架 (Vitest)",
        "为 Lexer 编写单元测试 (各种 Token 识别场景、错误处理)",
        "为 Parser 编写单元测试 (各种 AST 结构、错误处理)",
        "为 Evaluator 编写单元测试 (各种计算场景、数学函数、错误处理)",
        "为 Serializer 编写单元测试 (各种格式化场景)",
        "为 PrettyPrinter 编写单元测试 (打印输出格式)",
        "为 RoundtripValidator 编写单元测试 (往返正确性)",
        "为 EditorStorage 编写单元测试 (保存和加载)",
        "为 ImageHandler 编写单元测试 (图片转换)",
        "为 SettingsStore 编写单元测试 (设置加载和保存)",
        "确保测试覆盖率 >= 80%"
      ]
    },
    {
      "id": "23",
      "title": "编写集成测试",
      "description": "编写集成测试,验证各个模块之间的协作是否正常",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 6,
      "dependencies": ["9", "10", "11", "14", "15", "16", "17"],
      "subtasks": [
        "配置集成测试环境",
        "测试行内计算完整流程 (输入表达式→按下=→查看结果)",
        "测试自动保存完整流程 (编辑→自动保存→关闭→重新打开→恢复内容)",
        "测试图片粘贴完整流程 (复制图片→粘贴→保存→重新打开→显示图片)",
        "测试窗口透明度调节完整流程 (调节透明度→关闭→重新打开→恢复透明度)",
        "测试字体大小调节完整流程 (调节字体大小→关闭→重新打开→恢复字体大小)",
        "测试置顶显示完整流程 (切换置顶→验证置顶状态→关闭→重新打开→恢复置顶状态)",
        "测试主题切换完整流程 (切换主题→验证主题→关闭→重新打开→恢复主题)",
        "测试设置持久化完整流程 (修改各种设置→关闭→重新打开→验证设置恢复)",
        "确保所有集成测试通过"
      ]
    },
    {
      "id": "24",
      "title": "编写 E2E 测试",
      "description": "编写端到端测试,验证完整用户场景和跨平台兼容性",
      "priority": "low",
      "status": "pending",
      "estimatedHours": 6,
      "dependencies": ["21"],
      "subtasks": [
        "配置 E2E 测试框架 (Playwright)",
        "测试用户启动应用的基本场景",
        "测试用户创建新文档的场景",
        "测试用户编辑文本并计算表达式的场景",
        "测试用户粘贴图片的场景",
        "测试用户调整各种设置的场景",
        "测试用户关闭应用并重新打开的场景",
        "测试应用在 Windows 平台的兼容性",
        "测试应用在不同屏幕分辨率下的响应性",
        "确保所有 E2E 测试通过"
      ]
    },
    {
      "id": "25",
      "title": "性能优化",
      "description": "优化应用性能,确保良好的用户体验",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 4,
      "dependencies": ["22", "23"],
      "subtasks": [
        "分析应用性能瓶颈 (使用 Chrome DevTools)",
        "优化编辑器渲染性能 (减少重渲染、虚拟滚动)",
        "优化表达式计算性能 (缓存、避免重复计算)",
        "优化图片加载性能 (懒加载、压缩)",
        "优化 Rust ↔ JS 通信 (减少 IPC 调用、批量操作)",
        "优化打包体积 (Tree-shaking、代码分割、资源压缩)",
        "优化启动时间 (延迟加载、代码分割)",
        "验证优化效果 (性能测试、对比优化前后数据)"
      ]
    },
    {
      "id": "26",
      "title": "代码审查和重构",
      "description": "进行代码审查和重构,提高代码质量和可维护性",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 4,
      "dependencies": ["25"],
      "subtasks": [
        "运行 ESLint 和 Prettier,修复代码风格问题",
        "运行 Svelte Check,修复类型错误",
        "进行代码审查,识别代码异味和改进点",
        "重构复杂函数 (拆分为小函数、提高可读性)",
        "重构重复代码 (提取公共逻辑)",
        "优化命名 (确保命名清晰、准确)",
        "添加必要的注释 (解释复杂逻辑)",
        "确保代码符合项目规范和最佳实践"
      ]
    },
    {
      "id": "27",
      "title": "编写用户文档",
      "description": "编写用户使用文档,包括安装说明、功能介绍、使用教程等",
      "priority": "low",
      "status": "pending",
      "estimatedHours": 4,
      "dependencies": ["21"],
      "subtasks": [
        "创建 README.md 文件",
        "编写项目简介和功能特性",
        "编写安装和运行说明",
        "编写基础功能使用教程 (文本编辑、保存)",
        "编写高级功能使用教程 (行内计算、图片粘贴)",
        "编写设置功能使用教程 (透明度、字体、主题等)",
        "编写常见问题解答 (FAQ)",
        "添加截图和示例",
        "将文档上传到 MonkeyCode 平台"
      ]
    },
    {
      "id": "28",
      "title": "最终测试和发布",
      "description": "进行最终测试,准备发布应用",
      "priority": "high",
      "status": "pending",
      "estimatedHours": 3,
      "dependencies": ["26", "27"],
      "subtasks": [
        "运行所有测试,确保 100% 通过",
        "进行完整的应用功能测试",
        "测试应用在不同操作系统的兼容性",
        "测试应用打包后的 .exe 文件",
        "检查应用安全性 (XSS 防护、文件访问限制)",
        "生成最终版本号 (遵循语义化版本规范)",
        "打包发布版本 (pnpm run tauri build)",
        "验证 .exe 文件大小和完整性",
        "准备发布说明和更新日志",
        "提交代码到 Git 仓库",
        "打 Git 标签并推送到远程仓库"
      ]
    }
  ]
}