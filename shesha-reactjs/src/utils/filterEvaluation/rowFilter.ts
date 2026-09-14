import { JsonLogicFilter } from '@/interfaces/jsonLogic';
import { isRecord } from '@/utils/object';
import { createDefaultEvaluators, resolveFilterSync } from './engine';
import { ROW_SCOPE } from './rowScope';
import { ResolveFilterOptions } from './types';

type RowRecord = Record<string, unknown>;

/** Returned when the row part uses an operator only the backend understands; the row is then kept, not dropped. */
const UNSUPPORTED = Symbol('unsupported');

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

const isDateLike = (value: unknown): boolean => value instanceof Date || (typeof value === 'string' && ISO_DATE_PATTERN.test(value));
const toTime = (value: unknown): number => value instanceof Date ? value.getTime() : new Date(String(value)).getTime();
const isNumeric = (value: unknown): boolean =>
  typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)));
const isEmpty = (value: unknown): boolean => value === null || value === undefined || value === '';

const truthy = (value: unknown): boolean => Array.isArray(value) ? value.length > 0 : Boolean(value) && value !== '0';

/** Loose equality in the spirit of the backend: null and undefined agree, dates compare as instants, numerics as numbers. */
const equals = (a: unknown, b: unknown): boolean => {
  if (isEmpty(a) || isEmpty(b)) return isEmpty(a) && isEmpty(b);
  if (isDateLike(a) && isDateLike(b)) return toTime(a) === toTime(b);
  if (isNumeric(a) && isNumeric(b)) return Number(a) === Number(b);
  if (typeof a === 'boolean' || typeof b === 'boolean') return String(a).toLowerCase() === String(b).toLowerCase();
  return String(a) === String(b);
};

const compare = (a: unknown, b: unknown): number | undefined => {
  if (isEmpty(a) || isEmpty(b)) return undefined;
  if (isDateLike(a) && isDateLike(b)) return toTime(a) - toTime(b);
  if (isNumeric(a) && isNumeric(b)) return Number(a) - Number(b);
  return String(a).localeCompare(String(b));
};

const ordered = (values: unknown[], test: (delta: number) => boolean): boolean => {
  for (let i = 1; i < values.length; i++) {
    const delta = compare(values[i - 1], values[i]);
    if (delta === undefined || !test(delta)) return false;
  }
  return values.length > 1;
};

/** `row['address.city']` first, then `row.address.city`: rows carry nested properties either way. */
const readPath = (row: RowRecord, path: string): unknown => {
  if (path in row) return row[path];
  return path.split('.').reduce<unknown>((current, key) => isRecord(current) ? current[key] : undefined, row);
};

const evaluate = (node: unknown, row: RowRecord): unknown => {
  if (!isRecord(node)) return node;
  const keys = Object.keys(node);
  const operator = keys[0];
  if (keys.length !== 1 || operator === undefined) return UNSUPPORTED;
  const raw = node[operator];
  const list = Array.isArray(raw) ? raw : [raw];
  const args = (): unknown[] => list.map((item) => evaluate(item, row));
  const text = (value: unknown): string => isEmpty(value) ? '' : String(value).toLowerCase();

  switch (operator) {
    case 'var': return typeof raw === 'string' ? readPath(row, raw) : undefined;
    case 'and': return list.every((child) => truthy(evaluate(child, row)));
    case 'or': return list.some((child) => truthy(evaluate(child, row)));
    case '!': return !truthy(evaluate(list[0], row));
    case '!!': return truthy(evaluate(list[0], row));
    case '==': case '===': {
      const [a, b] = args();
      return equals(a, b);
    }
    case '!=': case '!==': {
      const [a, b] = args();
      return !equals(a, b);
    }
    case '<': return ordered(args(), (delta) => delta < 0);
    case '<=': return ordered(args(), (delta) => delta <= 0);
    case '>': return ordered(args(), (delta) => delta > 0);
    case '>=': return ordered(args(), (delta) => delta >= 0);
    case 'in': {
      const [needle, haystack] = args();
      if (Array.isArray(haystack)) return haystack.some((item) => equals(item, needle));
      return text(haystack).includes(text(needle));
    }
    case 'startsWith': {
      const [a, b] = args();
      return text(a).startsWith(text(b));
    }
    case 'endsWith': {
      const [a, b] = args();
      return text(a).endsWith(text(b));
    }
    case 'toLowerCase': return text(evaluate(list[0], row));
    case 'toUpperCase': return text(evaluate(list[0], row)).toUpperCase();
    default: return UNSUPPORTED;
  }
};

const warned = new Set<string>();

/**
 * Whether a record passes already-resolved JsonLogic: no expressions left, only the backend's operator set.
 * This is what an in-memory data source uses on the filter string the table hands it. Returns undefined when
 * the logic uses an operator the browser cannot evaluate, so the caller decides whether that keeps or drops the record.
 */
export const matchesJsonLogic = (record: RowRecord, logic: JsonLogicFilter | undefined): boolean | undefined => {
  if (logic === undefined || Object.keys(logic).length === 0) return true;
  const result = evaluate(logic, record);
  return result === UNSUPPORTED ? undefined : truthy(result);
};

/**
 * Whether a fetched record passes the row part of a filter.
 *
 * The record is exposed to expressions as `row`, alongside the form context, so `{{UPPER(row.country)}}` resolves
 * per record. The resolved JsonLogic is then evaluated here. A required expression with no value fails the row;
 * an optional one drops its rule. An operator this evaluator does not know keeps the row rather than hiding it.
 */
export const matchesRow = (row: RowRecord, rowFilter: JsonLogicFilter, options: ResolveFilterOptions): boolean => {
  const resolved = resolveFilterSync(rowFilter, { ...options, context: { ...options.context, [ROW_SCOPE]: row }, rowScope: 'inline' });
  if (resolved.status !== 'ready') return false;
  if (resolved.logic === undefined) return true;
  const result = evaluate(resolved.logic, row);
  if (result === UNSUPPORTED) {
    const key = JSON.stringify(resolved.logic);
    if (!warned.has(key)) {
      warned.add(key);
      console.warn('[query builder] row filter uses an operator the browser cannot evaluate; rows were kept:', resolved.logic);
    }
    return true;
  }
  return truthy(result);
};

/** Applies the row part of a filter to a fetched page. Evaluators are built once for the page. */
export const filterRows = <TRow extends RowRecord>(rows: TRow[], rowFilter: JsonLogicFilter | undefined, options: ResolveFilterOptions): TRow[] => {
  if (rowFilter === undefined) return rows;
  const shared: ResolveFilterOptions = { ...options, evaluators: options.evaluators ?? createDefaultEvaluators() };
  return rows.filter((row) => matchesRow(row, rowFilter, shared));
};
