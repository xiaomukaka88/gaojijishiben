import { ASTNode } from '../types/parser';

export class Evaluator {
  evaluate(node: ASTNode): number {
    switch (node.type) {
      case 'Number':
        return node.value;
      case 'BinaryOp':
        return this.evaluateBinaryOp(node);
      case 'UnaryOp':
        return this.evaluateUnaryOp(node);
      case 'Function':
        return this.evaluateFunction(node);
      case 'Group':
        return this.evaluate(node.expression);
    }
  }

  private evaluateBinaryOp(node: ASTNode & { type: 'BinaryOp' }): number {
    const left = this.evaluate(node.left);
    const right = this.evaluate(node.right);

    switch (node.operator) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        if (right === 0) {
          throw new Error('除以零');
        }
        return left / right;
      case '^':
        return Math.pow(left, right);
      default:
        throw new Error(`未知的二元运算符: ${node.operator}`);
    }
  }

  private evaluateUnaryOp(node: ASTNode & { type: 'UnaryOp' }): number {
    const operand = this.evaluate(node.operand);

    switch (node.operator) {
      case '+':
        return +operand;
      case '-':
        return -operand;
      default:
        throw new Error(`未知的一元运算符: ${node.operator}`);
    }
  }

  private evaluateFunction(node: ASTNode & { type: 'Function' }): number {
    const args = node.args.map((arg) => this.evaluate(arg));

    switch (node.name) {
      case 'sin':
        return Math.sin(args[0]);
      case 'cos':
        return Math.cos(args[0]);
      case 'tan':
        const tanValue = Math.tan(args[0]);
        if (!isFinite(tanValue)) {
          throw new Error('tan 函数参数超出定义域');
        }
        return tanValue;
      case 'log':
        if (args[0] <= 0) {
          throw new Error('log 函数参数必须大于 0');
        }
        return Math.log(args[0]);
      case 'exp':
        return Math.exp(args[0]);
      case 'sqrt':
        if (args[0] < 0) {
          throw new Error('sqrt 函数参数必须大于等于 0');
        }
        return Math.sqrt(args[0]);
      default:
        throw new Error(`未知的函数: ${node.name}`);
    }
  }
}
