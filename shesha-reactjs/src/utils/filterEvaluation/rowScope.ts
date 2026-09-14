import { JsonLogicFilter } from '@/interfaces/jsonLogic';
import { isRecord } from '@/utils/object';
import { getEvaluateNodeArgs } from './evaluateNode';

/** The root an expression reads a fetched record through: `{{UPPER(row.country)}}`. */
export const ROW_SCOPE = 'row';

const TEMPLATE_PATTERN = /\{\{(?:(?!}}).)*\}\}/;
const STRING_LITERAL_PATTERN = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g;
/** `row` as a root identifier: not `data.row`, not `rowCount`. */
const ROW_REFERENCE = new RegExp(`(?<![\\w$.])${ROW_SCOPE}(?![\\w$])`);

/** True when the expression reads the record, so it can only be evaluated once a row is in hand. */
export const isRowScopedExpression = (expression: string): boolean => ROW_REFERENCE.test(expression.replace(STRING_LITERAL_PATTERN, '""'));

/** True when any expression under the node is row-scoped, including bare `{{…}}` string arguments. */
export const containsRowScopedNode = (node: unknown): boolean => {
  const args = getEvaluateNodeArgs(node);
  if (args) return isRowScopedExpression(args.expression);
  if (typeof node === 'string') return TEMPLATE_PATTERN.test(node) && isRowScopedExpression(node);
  if (Array.isArray(node)) return node.some(containsRowScopedNode);
  if (isRecord(node)) return Object.values(node).some(containsRowScopedNode);
  return false;
};

export interface SplitFilter {
  /** What the backend can run. */
  server: JsonLogicFilter | undefined;
  /** What only the browser can run, once rows are fetched. */
  row: JsonLogicFilter | undefined;
}

const wrap = (items: unknown[]): JsonLogicFilter | undefined => {
  if (items.length === 0) return undefined;
  const [only] = items;
  return items.length === 1 && isRecord(only) ? only : { and: items };
};

/**
 * Splits a filter into the part the backend runs and the part that reads fetched rows.
 *
 * Only a root-level `and` can be split soundly: each child is a constraint every row must meet, so
 * moving one child to the browser keeps the result exact for the rows the server returns. A row-scoped
 * rule inside an `or` or a negation drags the whole filter to the browser.
 */
export const splitRowScoped = (logic: JsonLogicFilter): SplitFilter => {
  if (!containsRowScopedNode(logic)) return { server: logic, row: undefined };
  const keys = Object.keys(logic);
  const children = keys.length === 1 && keys[0] === 'and' && Array.isArray(logic['and']) ? (logic['and'] as unknown[]) : undefined;
  if (!children) return { server: undefined, row: logic };
  return {
    server: wrap(children.filter((child) => !containsRowScopedNode(child))),
    row: wrap(children.filter(containsRowScopedNode)),
  };
};
