import { JsonLogicFilter } from '@/interfaces/jsonLogic';
import { isDefined } from '@/utils/nullables';
import { createEmptyTree, newNodeId } from '../model/factories';
import { Conjunction, ExpressionLanguage, ExpressionValue, GroupNode, QueryNode, QueryTree, RawRuleNode, RuleNode, RuleValue, ScalarValue } from '../model/types';

type Logic = Record<string, unknown>;

const isObject = (value: unknown): value is Logic => typeof value === 'object' && value !== null && !Array.isArray(value);
const isScalar = (value: unknown): value is ScalarValue => value === null || ['string', 'number', 'boolean'].includes(typeof value);
const isScalarList = (value: unknown): value is ScalarValue[] => Array.isArray(value) && (value as unknown[]).every(isScalar);
const asList = (value: unknown): unknown[] | undefined => Array.isArray(value) ? (value as unknown[]) : undefined;

const varPath = (node: unknown): string | undefined =>
  isObject(node) && Object.keys(node).length === 1 && typeof node['var'] === 'string' ? node['var'] : undefined;

/** The single operator of a JsonLogic node, or undefined for anything that is not `{ op: args }`. */
const single = (node: Logic): [string, unknown] | undefined => {
  const keys = Object.keys(node);
  return keys.length === 1 && keys[0] !== undefined ? [keys[0], node[keys[0]]] : undefined;
};

const importValue = (node: unknown): RuleValue | undefined => {
  const path = varPath(node);
  if (path !== undefined) return { source: 'field', path };
  const evaluate = isObject(node) ? asList(node['evaluate']) : undefined;
  const args = evaluate?.length === 1 ? evaluate[0] : undefined;
  if (isObject(args) && typeof args['expression'] === 'string') {
    // a missing type is the legacy mustache node; anything else unknown is not ours to normalise
    const type = args['type'];
    if (type !== undefined && type !== 'mustache' && type !== 'javascript') return undefined;
    const language: ExpressionLanguage = type === 'javascript' ? 'javascript' : 'mustache';
    return { source: 'expression', language, expression: args['expression'], required: args['required'] === true };
  }
  if (isScalar(node) || isScalarList(node)) return { source: 'value', value: node };
  return undefined;
};

/** The left side of a rule: a property path, or a function over the row. */
type Left = { field: string } | { fieldExpression: ExpressionValue };

const asLeft = (node: unknown): Left | undefined => {
  const path = varPath(node);
  if (path !== undefined) return { field: path };
  const value = importValue(node);
  return value?.source === 'expression' ? { fieldExpression: value } : undefined;
};

const rule = (left: Left, operator: string, values: RuleValue[] = []): RuleNode => ({ kind: 'rule', id: newNodeId(), ...left, operator, values });
const propertyRule = (field: string, operator: string, values: RuleValue[] = []): RuleNode => rule({ field }, operator, values);

const raw = (json: unknown, reason: string): RawRuleNode => ({ kind: 'raw', id: newNodeId(), json, reason });

/** Comparison with the left side on either side: a property first, then a function over the row. */
const splitComparison = (args: unknown): [Left, unknown] | undefined => {
  const list = asList(args);
  if (!list || list.length !== 2) return undefined;
  const [a, b] = list;
  const pathA = varPath(a);
  if (pathA !== undefined) return [{ field: pathA }, b];
  const pathB = varPath(b);
  if (pathB !== undefined) return [{ field: pathB }, a];
  const leftA = asLeft(a);
  if (leftA) return [leftA, b];
  const leftB = asLeft(b);
  return leftB ? [leftB, a] : undefined;
};

const importRule = (node: Logic): QueryNode => {
  const entry = single(node);
  if (!entry) return raw(node, 'A rule must have exactly one operator');
  const [operator, args] = entry;

  const withValue = (key: string, left: Left, operand: unknown): QueryNode => {
    const value = importValue(operand);
    return value ? rule(left, key, [value]) : raw(node, `Unsupported value for '${key}'`);
  };

  switch (operator) {
    case '!':
    case '!!': {
      const unaryList = asList(args);
      const unary = unaryList?.length === 1 ? unaryList[0] : args;
      const left = asLeft(unary);
      if (left) return rule(left, operator === '!' ? 'is_empty' : 'is_not_empty');
      if (operator === '!' && isObject(unary)) {
        const inner = single(unary);
        const innerList = inner?.[0] === 'in' ? asList(inner[1]) : undefined;
        if (innerList?.length === 2) {
          const [x, y] = innerList;
          const listPath = varPath(x);
          if (listPath !== undefined && isScalarList(y)) return propertyRule(listPath, 'none_of', [{ source: 'value', value: y }]);
          const text = asLeft(y);
          if (text) return withValue('not_contains', text, x);
        }
      }
      return raw(node, `Unsupported '${operator}' shape`);
    }
    case '==':
    case '!=': {
      const split = splitComparison(args);
      if (!split) return raw(node, `'${operator}' needs a property and a value`);
      const [left, operand] = split;
      if (operand === null) return rule(left, operator === '==' ? 'is_null' : 'is_not_null');
      return withValue(operator === '==' ? 'is' : 'is_not', left, operand);
    }
    case 'in': {
      const list = asList(args);
      if (!list || list.length !== 2) return raw(node, "'in' needs two arguments");
      const [x, y] = list;
      const listPath = varPath(x);
      if (listPath !== undefined && isScalarList(y)) return propertyRule(listPath, 'any_of', [{ source: 'value', value: y }]);
      const text = asLeft(y);
      if (text) return withValue('contains', text, x);
      return raw(node, "Unsupported 'in' shape");
    }
    case 'startsWith':
    case 'endsWith': {
      const list = asList(args);
      const left = list?.length === 2 ? asLeft(list[0]) : undefined;
      return left && list ? withValue(operator === 'startsWith' ? 'starts_with' : 'ends_with', left, list[1]) : raw(node, `'${operator}' needs a property first`);
    }
    case '>':
    case '>=':
    case '<':
    case '<=': {
      const list = asList(args);
      if (operator === '<=' && list?.length === 3) {
        const left = asLeft(list[1]);
        const lower = importValue(list[0]);
        const upper = importValue(list[2]);
        return left && lower && upper ? rule(left, 'between', [lower, upper]) : raw(node, 'Unsupported between shape');
      }
      const left = list?.length === 2 ? asLeft(list[0]) : undefined;
      const keys: Record<string, string> = { '>': 'greater', '>=': 'greater_or_equal', '<': 'less', '<=': 'less_or_equal' };
      return left && list ? withValue(keys[operator] ?? operator, left, list[1]) : raw(node, `'${operator}' needs a property first`);
    }
    case 'is_satisfied': {
      const list = asList(args) ?? [args];
      if (list.length > 2) return raw(node, 'A specification rule takes a name and at most one condition');
      const name = varPath(list[0]);
      if (name === undefined) return raw(node, 'A specification rule needs the specification name');
      if (list.length === 1) return propertyRule(name, 'is_satisfied');
      const condition = list[1];
      if (typeof condition === 'string') return propertyRule(name, 'is_satisfied_when', [{ source: 'expression', language: 'javascript', expression: condition, required: true }]);
      const value = importValue(condition);
      return value?.source === 'expression' ? propertyRule(name, 'is_satisfied_when', [{ ...value, language: 'javascript' }]) : raw(node, 'Unsupported specification condition');
    }
    default:
      return raw(node, `Operator '${operator}' is not supported by the builder`);
  }
};

const importNode = (node: unknown): QueryNode => {
  if (!isObject(node)) return raw(node, 'Not a JsonLogic node');
  const entry = single(node);
  if (entry) {
    const [operator, args] = entry;
    const children = asList(args);
    if ((operator === 'and' || operator === 'or') && children) return importGroup(operator, children, false);
    if (operator === '!' && isObject(args)) {
      const inner = single(args);
      const innerChildren = inner ? asList(inner[1]) : undefined;
      if (inner && (inner[0] === 'and' || inner[0] === 'or') && innerChildren) return importGroup(inner[0], innerChildren, true);
    }
  }
  return importRule(node);
};

const importGroup = (conjunction: Conjunction, children: unknown[], not: boolean): GroupNode => ({
  kind: 'group',
  id: newNodeId(),
  conjunction,
  not,
  children: children.map(importNode),
});

/** Loads saved JsonLogic into the model. Anything the builder cannot represent becomes a raw rule and round-trips untouched. */
export const importFromJsonLogic = (logic: JsonLogicFilter | undefined): QueryTree => {
  if (!isDefined(logic) || !isObject(logic) || Object.keys(logic).length === 0) return createEmptyTree();
  const node = importNode(logic);
  if (node.kind === 'group') return node;
  const root = createEmptyTree();
  return { ...root, children: [node] };
};
