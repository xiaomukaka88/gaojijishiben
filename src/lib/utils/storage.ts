export class EditorStorage {
  private readonly STORAGE_KEY = 'advanced-notepad-content';

  async save(content: string): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, content);
    } catch (error) {
      console.error('保存失败:', error);
      throw error;
    }
  }

  async load(): Promise<string> {
    try {
      const content = localStorage.getItem(this.STORAGE_KEY);
      return content || '';
    } catch (error) {
      console.error('加载失败:', error);
      throw error;
    }
  }
}
