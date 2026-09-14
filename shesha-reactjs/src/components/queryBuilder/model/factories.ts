import { nanoid } from '@/utils/uuid';
import { Conjunction, GroupNode, QueryTree, RuleNode, RuleValue, ValueSource, ExpressionValue } from './types';

export const newNodeId = (): string => nanoid();

export const createRule = (): RuleNode => ({ kind: 'rule', id: newNodeId(), values: [] });

export const createGroup = (conjunction: Conjunction = 'and'): GroupNode => ({
  kind: 'group',
  id: newNodeId(),
  conjunction,
  not: false,
  children: [],
});

export const createEmptyTree = (): QueryTree => createGroup();

export const createExpressionValue = (): ExpressionValue => ({ source: 'expression', language: 'mustache', expression: '', required: true });

export const createValue = (source: ValueSource): RuleValue => {
  switch (source) {
    case 'field':
      return { source: 'field' };
    case 'expression':
      return createExpressionValue();
    default:
      return { source: 'value' };
  }
};
