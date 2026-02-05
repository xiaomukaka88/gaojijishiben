export type TokenType =
  | 'NUMBER'
  | 'PLUS'
  | 'MINUS'
  | 'MULTIPLY'
  | 'DIVIDE'
  | 'POWER'
  | 'LPAREN'
  | 'RPAREN'
  | 'FUNCTION'
  | 'COMMA'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export type ASTNode =
  | NumberNode
  | BinaryOpNode
  | UnaryOpNode
  | FunctionNode
  | GroupNode;

export interface NumberNode {
  type: 'Number';
  value: number;
}

export interface BinaryOpNode {
  type: 'BinaryOp';
  operator: '+' | '-' | '*' | '/' | '^';
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryOpNode {
  type: 'UnaryOp';
  operator: '+' | '-';
  operand: ASTNode;
}

export interface FunctionNode {
  type: 'Function';
  name: 'sin' | 'cos' | 'tan' | 'log' | 'exp' | 'sqrt';
  args: ASTNode[];
}

export interface GroupNode {
  type: 'Group';
  expression: ASTNode;
}
