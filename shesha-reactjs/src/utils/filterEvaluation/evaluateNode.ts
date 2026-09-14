import { isRecord } from '@/utils/object';
import { ExpressionLanguage } from './types';

/** The argument object of an `evaluate` node. `required` is left loose: legacy filters stored it in more than one shape. */
export interface EvaluateNodeArgs {
  expression: string;
  type?: string | undefined;
  required?: unknown;
}

export const isExpressionLanguage = (type: unknown): type is ExpressionLanguage => type === 'mustache' || type === 'javascript';

export const isEvaluateNodeArgs = (value: unknown): value is EvaluateNodeArgs =>
  isRecord(value) && typeof value['expression'] === 'string' && (value['type'] === undefined || typeof value['type'] === 'string');

/** `{"evaluate":[{...}]}` with exactly one argument object, or undefined for anything else. */
export const getEvaluateNodeArgs = (node: unknown): EvaluateNodeArgs | undefined => {
  if (!isRecord(node)) return undefined;
  const list = node['evaluate'];
  if (!Array.isArray(list) || list.length !== 1) return undefined;
  const args: unknown = list[0];
  return isEvaluateNodeArgs(args) ? args : undefined;
};
