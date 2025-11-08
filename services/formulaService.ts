import type { Formula } from '../types';

export interface FormulaResult {
  isActive: boolean;
  output: {
    variableName?: string;
    value?: string | number;
  } | null;
  error: string | null;
}

class FormulaService {
  /**
   * Evaluates a list of formula objects in order.
   * @param formulas The array of formula objects.
   * @param context An object mapping variable names to their numeric values.
   * @returns A record mapping formula IDs to their evaluation results.
   */
  public evaluateFormulaList(
    formulas: Formula[],
    context: Record<string, number>
  ): Record<string, FormulaResult> {
    const results: Record<string, FormulaResult> = {};
    const localContext = { ...context };

    for (const formula of formulas) {
      try {
        const isConditionActive = this.evaluateCondition(formula.condition, localContext);

        if (!isConditionActive) {
          results[formula.id] = { isActive: false, output: null, error: null };
          continue;
        }
        
        const actionMatch = formula.action.trim().match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/);

        if (!actionMatch) {
            throw new Error('Ação inválida. Use o formato: variavel = expressao');
        }

        const [, varName, expression] = actionMatch;
        const value = this.evaluateExpression(expression, localContext);

        if (typeof value === 'number') {
            localContext[varName] = value;
        }

        results[formula.id] = {
          isActive: true,
          output: { variableName: varName, value },
          error: null,
        };

      } catch (e: any) {
        results[formula.id] = {
          isActive: false, 
          output: null,
          error: e.message,
        };
      }
    }
    return results;
  }
  
  /**
   * Evaluates a single mathematical, conditional, or string expression.
   * @param expression The expression string to evaluate.
   * @param context A record of variable names to their values.
   * @returns The result of the evaluation (string or number).
   */
  private evaluateExpression(expression: string, context: Record<string, number>): string | number {
    let expr = expression.trim();
    
    const stringMatch = expr.match(/^"(.*)"$|^'(.*)'$/);
    if (stringMatch) {
        return stringMatch[1] || stringMatch[2];
    }
    
    const ifRegex = /IF\((.+?),\s*(.+?),\s*(.+?)\)/gi;
    expr = expr.replace(ifRegex, (_, condition, trueVal, falseVal) => {
      const isConditionTrue = this.evaluateCondition(condition, context);
      const evaluatedTrueVal = this.evaluateExpression(trueVal, context);
      const evaluatedFalseVal = this.evaluateExpression(falseVal, context);
      return String(isConditionTrue ? evaluatedTrueVal : evaluatedFalseVal);
    });

    expr = expr.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match) => {
      if (context.hasOwnProperty(match)) {
        return String(context[match]);
      }
      return match;
    });
    
    try {
      if (!isNaN(parseFloat(expr)) && isFinite(expr as any)) {
        return parseFloat(expr);
      }
      if (/[^0-9.+\-*/()\s.]/.test(expr)) {
          throw new Error(`Expressão contém caracteres inválidos: ${expr}`);
      }
      return new Function(`return ${expr}`)();
    } catch (e) {
      throw new Error(`Erro ao avaliar a expressão: "${expression}"`);
    }
  }
  
  /**
   * Evaluates a simple condition string like "var > 10".
   * @param conditionStr The condition string.
   * @param context The variable context.
   * @returns A boolean result of the condition.
   */
  private evaluateCondition(conditionStr: string, context: Record<string, number>): boolean {
    if (conditionStr.trim().toLowerCase() === 'true') return true;

    const comparisonMatch = conditionStr.match(/([a-zA-Z0-9_.\s]+)\s*(>|>=|<|<=|==|!=)\s*([a-zA-Z0-9_.\s]+)/);
    if (!comparisonMatch) {
      throw new Error(`Condição inválida: ${conditionStr}`);
    }
    
    const [, left, operator, right] = comparisonMatch;
    
    const leftVal = this.evaluateExpression(left, context);
    const rightVal = this.evaluateExpression(right, context);
    
    if (typeof leftVal !== 'number' || typeof rightVal !== 'number') {
        throw new Error(`Não é possível comparar valores não numéricos em: "${conditionStr}"`);
    }

    switch (operator) {
      case '>': return leftVal > rightVal;
      case '>=': return leftVal >= rightVal;
      case '<': return leftVal < rightVal;
      case '<=': return leftVal <= rightVal;
      case '==': return leftVal === rightVal;
      case '!=': return leftVal !== rightVal;
      default: throw new Error(`Operador desconhecido: ${operator}`);
    }
  }
}

export const formulaService = new FormulaService();
