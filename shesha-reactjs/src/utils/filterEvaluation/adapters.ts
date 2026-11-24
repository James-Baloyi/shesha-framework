import { isPropertiesArray, NestedProperties } from '@/interfaces/metadata';
import { JsonLogicFilter } from '@/interfaces/jsonLogic';
import { IStoredFilter } from '@/providers/dataTable/interfaces';
import { NestedPropertyMetadatAccessor } from '@/providers/metadataDispatcher/contexts';
import { extractErrorMessage } from '@/utils/errors';
import { isDefined, isNullOrWhiteSpace } from '@/utils/nullables';
import { buildEvaluationContext, resolveFilter, resolveFilterSync } from './engine';
import { ResolvedFilter } from './types';

/*
 * Compatibility layer. These keep the signatures the rest of the codebase calls today while the
 * implementation lives in the engine. Call sites move to `resolveFilter` directly in a later phase.
 */

export interface IMatchData {
  match: string;
  data: unknown;
}

const EMPTY_FILTERS: IStoredFilter[] = [];

const invalidFilter = (filter: IStoredFilter, error: string): IStoredFilter => {
  console.error(`Failed to parse filter expression for filter ${filter.id || 'unknown'}:`, error);
  return { ...filter, hasInvalidExpression: true, expressionError: error };
};

const toStoredFilter = (filter: IStoredFilter, resolved: ResolvedFilter): IStoredFilter => ({
  ...filter,
  hasDynamicExpression: resolved.hasExpressions,
  allFieldsEvaluatedSuccessfully: resolved.status === 'ready',
  unevaluatedExpressions: resolved.unresolved.filter((item) => item.required).map((item) => item.expression),
  expression: resolved.logic,
});

const parseExpression = (filter: IStoredFilter): { logic: JsonLogicFilter | undefined; error?: string } => {
  const { expression } = filter;
  if (typeof expression !== 'string') return { logic: expression };
  if (isNullOrWhiteSpace(expression)) return { logic: undefined };
  try {
    const parsed: unknown = JSON.parse(expression);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('Parsed expression must be an object');
    return { logic: parsed as JsonLogicFilter };
  } catch (error) {
    return { logic: undefined, error: extractErrorMessage(error) };
  }
};

/** @deprecated use `resolveFilter` */
export const evaluateDynamicFilters = (
  filters: IStoredFilter[] | undefined,
  mappings: IMatchData[],
  propertyMetadataAccessor: NestedPropertyMetadatAccessor | undefined,
): Promise<IStoredFilter[]> => {
  if (!isDefined(filters) || filters.length === 0 || mappings.length === 0) return Promise.resolve(EMPTY_FILTERS);
  const context = buildEvaluationContext(mappings);
  const getVariableDataType = isDefined(propertyMetadataAccessor)
    ? async (path: string): Promise<string | undefined> => (await propertyMetadataAccessor(path))?.dataType
    : undefined;

  return Promise.all(filters.map(async (filter) => {
    const { logic, error } = parseExpression(filter);
    if (error !== undefined) return invalidFilter(filter, error);
    if (!isDefined(logic)) return filter;
    return toStoredFilter({ ...filter, expression: logic }, await resolveFilter(logic, { context, getVariableDataType }));
  }));
};

/** @deprecated use `resolveFilterSync` */
export const evaluateDynamicFiltersSync = (
  filters: IStoredFilter[],
  mappings: IMatchData[],
  propertyMetadata: NestedProperties | undefined,
): IStoredFilter[] => {
  if (!isDefined(filters) || filters.length === 0 || mappings.length === 0) return EMPTY_FILTERS;
  const context = buildEvaluationContext(mappings);
  const getVariableDataType = isPropertiesArray(propertyMetadata)
    ? (path: string): string | undefined => propertyMetadata.find((m) => m.label === path || m.path === path)?.dataType
    : undefined;

  return filters.map((filter) => {
    const { logic, error } = parseExpression(filter);
    if (error !== undefined) return invalidFilter(filter, error);
    if (!isDefined(logic)) return filter;
    return toStoredFilter({ ...filter, expression: logic }, resolveFilterSync(logic, { context, getVariableDataType }));
  });
};
