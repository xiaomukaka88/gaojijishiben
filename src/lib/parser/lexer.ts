import { TokenType, Token } from '../types/parser';

export class Lexer {
  private input: string;
  private position: number = 0;
  private readonly tokens: Token[] = [];

  constructor(input: string) {
    this.input = input.trim();
  }

  tokenize(): Token[] {
    while (this.position < this.input.length) {
      const char = this.input[this.position];

      if (this.isWhitespace(char)) {
        this.position++;
        continue;
      }

      if (this.isDigit(char) || (char === '.' && this.position + 1 < this.input.length && this.isDigit(this.input[this.position + 1]))) {
        this.tokenizeNumber();
      } else if (this.isAlpha(char)) {
        this.tokenizeFunction();
      } else {
        this.tokenizeOperator();
      }
    }

    this.tokens.push({ type: 'EOF', value: '', position: this.position });
    return this.tokens;
  }

  private isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }

  private tokenizeNumber(): void {
    const start = this.position;
    let hasDecimal = false;

    while (this.position < this.input.length) {
      const char = this.input[this.position];
      if (this.isDigit(char)) {
        this.position++;
      } else if (char === '.' && !hasDecimal) {
        hasDecimal = true;
        this.position++;
      } else {
        break;
      }
    }

    const value = this.input.substring(start, this.position);
    this.tokens.push({ type: 'NUMBER', value, position: start });
  }

  private tokenizeFunction(): void {
    const start = this.position;
    const functions = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt'];

    while (this.position < this.input.length && this.isAlpha(this.input[this.position])) {
      this.position++;
    }

    const name = this.input.substring(start, this.position).toLowerCase();
    if (functions.includes(name)) {
      this.tokens.push({ type: 'FUNCTION', value: name, position: start });
    } else {
      throw new Error(`未知函数: ${name} (位置 ${start})`);
    }
  }

  private tokenizeOperator(): void {
    const char = this.input[this.position];
    const start = this.position;

    switch (char) {
      case '+':
        this.tokens.push({ type: 'PLUS', value: char, position: start });
        break;
      case '-':
        this.tokens.push({ type: 'MINUS', value: char, position: start });
        break;
      case '*':
        this.tokens.push({ type: 'MULTIPLY', value: char, position: start });
        break;
      case '/':
        this.tokens.push({ type: 'DIVIDE', value: char, position: start });
        break;
      case '^':
        this.tokens.push({ type: 'POWER', value: char, position: start });
        break;
      case '(':
        this.tokens.push({ type: 'LPAREN', value: char, position: start });
        break;
      case ')':
        this.tokens.push({ type: 'RPAREN', value: char, position: start });
        break;
      case ',':
        this.tokens.push({ type: 'COMMA', value: char, position: start });
        break;
      default:
        throw new Error(`非法字符: ${char} (位置 ${start})`);
    }

    this.position++;
  }
}
