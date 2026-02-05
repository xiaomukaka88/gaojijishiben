export interface EditorState {
  content: string;
  cursorPosition: number;
  selection: { start: number; end: number };
}
