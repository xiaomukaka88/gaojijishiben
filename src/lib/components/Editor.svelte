<script lang="ts">
  import { onMount } from 'svelte';
  import { editorStore } from '../stores/editor';
  import { settingsStore } from '../stores/settings';
  import { invoke } from '@tauri-apps/api/core';
  import { Lexer } from '../parser/lexer';
  import { Parser } from '../parser/parser';
  import { Evaluator } from '../parser/evaluator';
  import { Serializer } from '../parser/serializer';

  let editorDiv: HTMLDivElement;
  let content = '';
  let showIntro = true;

  onMount(async () => {
    await editorStore.load();
    await settingsStore.load();
    
    editorStore.subscribe((state) => {
      content = state.content;
      if (editorDiv && state.content !== editorDiv.innerText) {
        editorDiv.innerText = state.content;
        if (state.content && state.content.trim().length > 0) {
          showIntro = false;
        }
      }
    });

    if (editorDiv) {
      const savedContent = editorDiv.innerText;
      editorDiv.innerText = content;
      if (savedContent && savedContent.trim().length > 0) {
        showIntro = false;
      }
    }

    await applySettings();
  });

  async function applySettings() {
    const settings = await new Promise((resolve) => {
      const unsub = settingsStore.subscribe(resolve);
      setTimeout(() => unsub(), 100);
    });

    try {
      await invoke('set_window_opacity', { opacity: settings.opacity });
      await invoke('set_window_always_on_top', { alwaysOnTop: settings.alwaysOnTop });
    } catch (error) {
      console.log('窗口命令不可用 (开发模式)');
    }
  }

  settingsStore.subscribe(async (settings) => {
    try {
      await invoke('set_window_opacity', { opacity: settings.opacity });
      await invoke('set_window_always_on_top', { alwaysOnTop: settings.alwaysOnTop });
    } catch (error) {
      console.log('窗口命令不可用 (开发模式)');
    }
  });

  function handleInput(event: Event) {
    const target = event.target as HTMLDivElement;
    const newContent = target.innerText;
    
    if (newContent !== content) {
      content = newContent;
      editorStore.update((state) => ({ ...state, content }));
      editorStore.scheduleSave();
      
      if (newContent.trim().length > 0) {
        showIntro = false;
      } else {
        showIntro = true;
      }
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (!blob) continue;

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          const imageMarkdown = `![图片](data:${blob.type};base64,${base64})\n`;
          insertAtCursor(imageMarkdown);
        };
        reader.readAsDataURL(blob);
        return;
      }
    }

    const text = event.clipboardData?.getData('text/plain');
    if (text) {
      document.execCommand('insertText', false, text);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === '=') {
      event.preventDefault();
      insertAtCursor('=');
      
      setTimeout(() => {
        calculateExpression();
      }, 0);
    }
  }

  async function calculateExpression() {
    const selection = window.getSelection();
    if (!selection || !editorDiv) return;

    const text = editorDiv.innerText;
    const cursorOffset = getCaretCharacterOffsetWithin(editorDiv);

    const lineStart = text.lastIndexOf('\n', cursorOffset - 1) + 1;
    const lineEnd = text.indexOf('\n', cursorOffset);
    const lineText = text.substring(
      lineStart,
      lineEnd === -1 ? text.length : lineEnd
    );

    const lastEqualIndex = lineText.lastIndexOf('=');
    if (lastEqualIndex === -1) return;

    const expression = lineText.substring(0, lastEqualIndex).trim();
    if (!expression) return;

    try {
      const lexer = new Lexer(expression);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const evaluator = new Evaluator();
      const result = evaluator.evaluate(ast);
      const serializer = new Serializer();
      const resultText = serializer.serializeResult(result);

      const existingResult = lineText.substring(lastEqualIndex + 1).trim();
      
      if (existingResult === '' || existingResult !== resultText) {
        const resultStart = lineStart + lastEqualIndex + 1;
        const resultEnd = lineEnd === -1 ? text.length : lineEnd;
        const newContent = text.substring(0, resultStart) + resultText + text.substring(resultEnd);
        
        editorDiv.innerText = newContent;
        content = newContent;
        editorStore.update((state) => ({ ...state, content }));
        editorStore.save();

        const newCursorPos = resultStart + resultText.length;
        setCaretPosition(editorDiv, newCursorPos);
      }
    } catch (error) {
      const serializer = new Serializer();
      const errorText = serializer.serializeError(error as Error);

      const existingResult = lineText.substring(lastEqualIndex + 1).trim();
      
      if (existingResult === '' || existingResult !== errorText) {
        const resultStart = lineStart + lastEqualIndex + 1;
        const resultEnd = lineEnd === -1 ? text.length : lineEnd;
        const newContent = text.substring(0, resultStart) + errorText + text.substring(resultEnd);
        
        editorDiv.innerText = newContent;
        content = newContent;
        editorStore.update((state) => ({ ...state, content }));
        editorStore.save();

        const newCursorPos = resultStart + errorText.length;
        setCaretPosition(editorDiv, newCursorPos);
      }
    }
  }

  function insertAtCursor(text: string) {
    document.execCommand('insertText', false, text);
  }

  function getCaretCharacterOffsetWithin(element: HTMLElement): number {
    const selection = window.getSelection();
    if (!selection) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }

  function setCaretPosition(element: HTMLElement, offset: number): void {
    const range = document.createRange();
    const selection = window.getSelection();
    if (!selection) return;

    let charCount = 0;
    let found = false;

    const traverse = (node: Node): boolean => {
      if (found) return true;

      if (node.nodeType === Node.TEXT_NODE) {
        const nextCount = charCount + (node.textContent?.length || 0);
        if (offset <= nextCount) {
          range.setStart(node, offset - charCount);
          range.collapse(true);
          found = true;
          return true;
        }
        charCount = nextCount;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const child of node.childNodes) {
          if (traverse(child)) return true;
        }
      }
      return false;
    };

    traverse(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
</script>

<div class="flex-1 flex flex-col">
  {#if showIntro}
  <div class="flex-1 p-8 overflow-auto">
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold mb-2">高级记事本</h1>
        <p class="text-[var(--secondary-color)]">智能计算 · 自动保存</p>
      </div>

      <div class="bg-[var(--bg-color)] rounded-xl p-6 border border-[var(--border-color)]">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span class="text-xl">🧮</span>
          智能数学计算
        </h2>
        <div class="space-y-3 text-sm">
          <p><strong>操作方式:</strong>输入数学表达式后按 <code class="bg-[var(--surface-color)] px-2 py-1 rounded">=</code> 键即可</p>
          <p><strong>支持:</strong>四则运算、三角函数、对数、指数、平方根</p>
          <p><strong>示例:</strong>2+3=5, sin(1.57)=1, sqrt(16)=4</p>
        </div>
      </div>

      <div class="bg-[var(--bg-color)] rounded-xl p-6 border border-[var(--border-color)]">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span class="text-xl">📝</span>
          文本编辑
        </h2>
        <div class="space-y-2 text-sm">
          <p>• 自由输入文字和数学公式</p>
          <p>• 支持粘贴图片(Ctrl+V)</p>
          <p>• 自动保存,防止数据丢失</p>
        </div>
      </div>

      <div class="bg-gradient-to-r from-[var(--primary-color)] to-blue-600 rounded-xl p-6 text-white">
        <p class="text-center font-medium">👆 开始输入,功能介绍将自动隐藏</p>
      </div>
    </div>
  </div>
  {/if}

  <div
    bind:this={editorDiv}
    class="flex-1 p-4 outline-none overflow-auto font-mono whitespace-pre-wrap"
    contenteditable="true"
    on:input={handleInput}
    on:paste={handlePaste}
    on:keydown={handleKeyDown}
    style="font-size: {$settingsStore.fontSize}px; min-height: 100%;"
  ></div>
</div>

<style>
  :global([contenteditable]:empty:before) {
    content: '';
  }
</style>
