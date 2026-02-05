export class ImageHandler {
  static async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static generateImageMarkdown(base64: string, mimeType: string): string {
    return `![图片](data:${mimeType};base64,${base64})`;
  }

  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }
}
