export class Serializer {
  serializeResult(result: number): string {
    if (Number.isInteger(result)) {
      return result.toString();
    } else {
      return result.toFixed(4);
    }
  }

  serializeError(error: Error): string {
    return `[错误: ${error.message}]`;
  }
}
