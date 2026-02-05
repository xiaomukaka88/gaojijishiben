import { ASTNode } from '../types/parser';
import { Serializer } from './serializer';

export class PrettyPrinter {
  print(node: ASTNode, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    const serializer = new Serializer();

    switch (node.type) {
      case 'Number':
        return `${indentStr}Number: ${node.value}`;
      case 'BinaryOp':
        return `${indentStr}BinaryOp: ${node.operator}\n${this.print(node.left, indent + 1)}\n${this.print(node.right, indent + 1)}`;
      case 'UnaryOp':
        return `${indentStr}UnaryOp: ${node.operator}\n${this.print(node.operand, indent + 1)}`;
      case 'Function':
        const argsStr = node.args.map((arg) => this.print(arg, indent + 1)).join('\n');
        return `${indentStr}Function: ${node.name}\n${indentStr}args:\n${argsStr}`;
      case 'Group':
        return `${indentStr}Group:\n${this.print(node.expression, indent + 1)}`;
    }
  }
}
