# 生成 .exe 文件操作步骤

按照以下步骤在本地 Windows 环境中生成高级记事本的 `.exe` 文件。

---

## 前置要求

### 1. 克隆项目
```bash
git clone https://github.com/xiaomukaka88/gaojijishiben.git
cd gaojijishiben
```

### 2. 安装 Node.js
- 访问: https://nodejs.org/
- 下载并安装 Node.js 18.x 或更高版本 (LTS 版本)
- 安装时勾选 "Add to PATH"

### 3. 安装 Rust
- 访问: https://www.rust-lang.org/tools/install
- 下载并安装 Rustup
- 运行命令安装 Rust:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

### 4. 安装 pnpm
```bash
npm install -g pnpm
```

---

## 构建步骤

### 1. 安装依赖
```bash
cd gaojijishiben
pnpm install
```

### 2. 构建前端
```bash
pnpm run build
```

### 3. 构建 Tauri 应用(生成 .exe)
```bash
pnpm run tauri:build
```

---

## 输出文件

构建成功后,.exe 文件位于:

```
src-tauri/target/release/advanced-notepad.exe
```

文件大小约 30-50 MB。

---

## 常见问题

### 问题1: Rust 编译错误
**错误**: `error: linker not found`
**解决**: 安装 Microsoft C++ Build Tools
- 下载: https://visualstudio.microsoft.com/downloads/
- 安装 "Desktop C++" x64 或 x86

### 问题2: pnpm install 失败
**解决**: 使用 npm 代替
```bash
npm install
npm run build
npm run tauri: 完成
```

### 问题3: 构建很慢
**说明**: 首次构建需要 10-30 分钟,后续会快很多

### 问题4: 杀毒软件误报
**解决**: 添加到信任列表,或暂时关闭杀毒软件

---

## 一键构建脚本

如果您已完成所有环境配置,可以直接运行:

```bash
git clone https://github.com/xiaomukaka88/gaojijishiben.git
cd gaojijishiben
pnpm install
pnpm run build
pnpm run tauri:build
```

---

## 开发模式测试

如果只想测试功能而不生成 .exe:

```bash
cd gaojijishiben
pnpm install
pnpm run dev
```

这将启动开发服务器,所有功能都可以正常使用。

---

## 分发

生成的 `.exe` 文件可以直接:
- ✅ 发送给其他人使用
- ✅ 上传到网盘分享
- ✅ 复制到其他电脑
- ✅ 打包成安装程序

---

## 需要帮助?

如果遇到问题,请提供:
1. 错误信息的完整内容
2. 当前系统版本
3. 已安装的软件版本
