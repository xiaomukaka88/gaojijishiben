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

  onMount(async () => {
    await editorStore.load();
    await settingsStore.load();
    
    editorStore.subscribe((state) => {
      content = state.content;
      if (editorDiv && state.content !== editorDiv.innerText) {
        editorDiv.innerText = state.content;
      }
    });

    if (editorDiv) {
      editorDiv.innerText = content;
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

    const range = selection.getRangeAt(0);
    const text = editorDiv.innerText;
    const cursorOffset = getCaretCharacterOffsetWithin(editorDiv);

    const lineStart = text.lastIndexOf('\n', cursorOffset - 1) + 1;
    const lineEnd = text.indexOf('\n', cursorOffset);
    const lineText = text.substring(
      lineStart,
      lineEnd === -1 ? text.length : lineEnd
    );

    console.log('当前行:', lineText);

    const lastEqualIndex = lineText.lastIndexOf('=');
    if (lastEqualIndex === -1 || lastEqualIndex === lineText.length - 1) return;

    const expression = lineText.substring(0, lastEqualIndex).trim();
    if (!expression) return;

    console.log('计算表达式:', expression);

    try {
      const lexer = new Lexer(expression);
      const tokens = lexer.tokenize();
      console.log('Tokens:', tokens);

      const parser = new Parser(tokens);
      const ast = parser.parse();
      console.log('AST:', ast);

      const evaluator = new Evaluator();
      const result = evaluator.evaluate(ast);
      console.log('结果:', result);

      const serializer = new Serializer();
      const resultText = serializer.serializeResult(result);
      console.log('格式化结果:', resultText);

      const resultStart = lineStart + lastEqualIndex + 1;
      const resultEnd = lineEnd === -1 ? text.length : lineEnd;
      const existingResult = text.substring(resultStart, resultEnd);

      if (existingResult !== resultText) {
        const newContent = text.substring(0, resultStart) + ' ' + resultText + text.substring(resultEnd);
        editorDiv.innerText = newContent;
        content = newContent;
        editorStore.update((state) => ({ ...state, content }));
        editorStore.save();

        const newCursorPos = resultStart + resultText.length + 1;
        setCaretPosition(editorDiv, newCursorPos);
      }
    } catch (error) {
      console.error('计算错误:', error);

      const serializer = new Serializer();
      const errorText = serializer.serializeError(error as Error);

      const resultStart = lineStart + lastEqualIndex + 1;
      const resultEnd = lineEnd === -1 ? text.length : lineEnd;
      const existingResult = text.substring(resultStart, resultEnd);

      if (existingResult !== errorText) {
        const newContent = text.substring(0, resultStart) + ' ' + errorText + text.substring(resultEnd);
        editorDiv.innerText = newContent;
        content = newContent;
        editorStore.update((state) => ({ ...state, content }));
        editorStore.save();

        const newCursorPos = resultStart + errorText.length + 1;
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

<div
  bind:this={editorDiv}
  class="flex-1 p-4 outline-none overflow-auto font-mono whitespace-pre-wrap"
  contenteditable="true"
  on:input={handleInput}
  on:paste={handlePaste}
  on:keydown={handleKeyDown}
  style="font-size: {$settingsStore.fontSize}px; min-height: 100%;"
></div>

<style>
  :global([contenteditable]:empty:before) {
    content: '在此输入内容...';
    color: var(--secondary-color);
  }
</style>
