import { Lexer } from './lexer';
import { Parser } from './parser';
import { PrettyPrinter } from './pretty-printer';

export class RoundtripValidator {
  validate(input: string): { success: boolean; message: string; difference?: string } {
    try {
      const lexer1 = new Lexer(input);
      const tokens1 = lexer1.tokenize();
      const parser1 = new Parser(tokens1);
      const ast1 = parser1.parse();

      const printer = new PrettyPrinter();
      const formatted = printer.print(ast1);

      const lexer2 = new Lexer(formatted);
      const tokens2 = lexer2.tokenize();
      const parser2 = new Parser(tokens2);
      const ast2 = parser2.parse();

      const ast1Str = JSON.stringify(ast1, null, 2);
      const ast2Str = JSON.stringify(ast2, null, 2);

      if (ast1Str === ast2Str) {
        return { success: true, message: '往返验证成功' };
      } else {
        return {
          success: false,
          message: '往返验证失败: AST 不匹配',
          difference: this.diff(ast1Str, ast2Str),
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `往返验证失败: ${(error as Error).message}`,
      };
    }
  }

  private diff(str1: string, str2: string): string {
    const lines1 = str1.split('\n');
    const lines2 = str2.split('\n');
    const differences: string[] = [];

    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
      if (lines1[i] !== lines2[i]) {
        differences.push(`行 ${i + 1}:\n  预期: ${lines1[i] || '(空)'}\n  实际: ${lines2[i] || '(空)'}`);
      }
    }

    return differences.join('\n');
  }
}
