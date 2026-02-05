import { Token, TokenType, ASTNode, NumberNode, BinaryOpNode, UnaryOpNode, FunctionNode, GroupNode } from '../types/parser';

export class Parser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ASTNode {
    const node = this.parseExpression();
    if (this.current()?.type !== 'EOF') {
      throw new Error(`意外的 token: ${this.current()?.value} (位置 ${this.position})`);
    }
    return node;
  }

  private current(): Token | undefined {
    return this.tokens[this.position];
  }

  private peek(offset: number = 1): Token | undefined {
    return this.tokens[this.position + offset];
  }

  private consume(expectedType: TokenType): Token {
    const token = this.current();
    if (token?.type !== expectedType) {
      throw new Error(`期望 ${expectedType}, 实际是 ${token?.type} (位置 ${this.position})`);
    }
    this.position++;
    return token;
  }

  private parseExpression(): ASTNode {
    return this.parseBinaryOp(() => this.parseTerm(), ['PLUS', 'MINUS']);
  }

  private parseTerm(): ASTNode {
    return this.parseBinaryOp(() => this.parseFactor(), ['MULTIPLY', 'DIVIDE']);
  }

  private parseFactor(): ASTNode {
    return this.parseBinaryOp(() => this.parsePrimary(), ['POWER']);
  }

  private parseBinaryOp(parseOperand: () => ASTNode, operatorTypes: TokenType[]): ASTNode {
    let left = parseOperand();

    while (operatorTypes.includes(this.current()?.type as TokenType)) {
      const token = this.consume(this.current()!.type);
      const operator = token.value as '+' | '-' | '*' | '/' | '^';
      const right = parseOperand();
      left = { type: 'BinaryOp', operator, left, right };
    }

    return left;
  }

  private parsePrimary(): ASTNode {
    const token = this.current();

    if (!token || token.type === 'EOF') {
      throw new Error(`意外的输入结束 (位置 ${this.position})`);
    }

    if (token.type === 'NUMBER') {
      this.consume('NUMBER');
      return { type: 'Number', value: parseFloat(token.value) };
    }

    if (token.type === 'PLUS' || token.type === 'MINUS') {
      this.consume(token.type);
      const operator = token.value as '+' | '-';
      const operand = this.parsePrimary();
      return { type: 'UnaryOp', operator, operand };
    }

    if (token.type === 'FUNCTION') {
      return this.parseFunction();
    }

    if (token.type === 'LPAREN') {
      return this.parseGroup();
    }

    throw new Error(`意外的 token: ${token.value} (位置 ${token.position})`);
  }

  private parseFunction(): FunctionNode {
    const token = this.consume('FUNCTION');
    const name = token.value as 'sin' | 'cos' | 'tan' | 'log' | 'exp' | 'sqrt';
    this.consume('LPAREN');

    const args: ASTNode[] = [];
    if (this.current()?.type !== 'RPAREN') {
      args.push(this.parseExpression());
      while (this.current()?.type === 'COMMA') {
        this.consume('COMMA');
        args.push(this.parseExpression());
      }
    }

    this.consume('RPAREN');
    return { type: 'Function', name, args };
  }

  private parseGroup(): GroupNode {
    this.consume('LPAREN');
    const expression = this.parseExpression();
    this.consume('RPAREN');
    return { type: 'Group', expression };
  }
}
