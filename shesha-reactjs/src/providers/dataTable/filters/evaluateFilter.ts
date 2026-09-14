import { useDeepCompareMemoize } from "@/hooks/index";
import { IApplicationContext, IMatchData, useAvailableConstantsContexts, wrapConstantsData } from "@/providers/form/utils";
import { NestedPropertyMetadatAccessor } from "@/providers/metadataDispatcher/contexts";
import { evaluateDynamicFilters } from '@/utils/datatable';
import { buildEvaluationContext, createDefaultEvaluators, matchesRow } from '@/utils/filterEvaluation';
import { FilterExpression, IStoredFilter, RowPredicate } from "../interfaces";
import { useEffect, useRef, useState } from "react";
import { useTouchableProxy } from "@/hooks/formComponentHooks";
import { isDefined } from "@/utils/nullables";

interface IMatchDataWithPreparation extends IMatchData {
  prepare?: (data: unknown) => unknown;
}

export interface UseEvaluatedFilterArgs {
  filter?: FilterExpression | undefined;
  mappings: IMatchDataWithPreparation[];
  metadataAccessor?: NestedPropertyMetadatAccessor | undefined;
};

export interface UseFormEvaluatedFilterArgs {
  filter?: FilterExpression | undefined;
  metadataAccessor?: NestedPropertyMetadatAccessor | undefined;
};
export interface EvaluatedFilter {
  filter: string | undefined;
  /** false while the filter is still evaluating or contains unresolved required expressions (e.g. `{{data.id}}` before the form data has loaded) */
  ready: boolean;
  /** Applies the rules that read `row` to fetched records; undefined when the filter has none. */
  rowPredicate?: RowPredicate | undefined;
}

export const useFormEvaluatedFilterWithReadiness = (args: UseFormEvaluatedFilterArgs, additionalData?: object): EvaluatedFilter => {
  const fullContext = useAvailableConstantsContexts();
  const accessors = wrapConstantsData({ fullContext });

  const contextProxyRef = useTouchableProxy<IApplicationContext>(accessors, additionalData);

  const prevChanged = useRef<number>(0);
  if (contextProxyRef.changed)
    prevChanged.current = Date.now();

  var keys = Object.keys({ ...contextProxyRef }) as Array<keyof typeof contextProxyRef>;
  var mappings = keys.map<IMatchData>((key) => ({ match: key, data: contextProxyRef[key] }));

  // state must be compared by value: this hook re-evaluates on every observed context change,
  // and setting a fresh object each time re-renders in a loop (interaction -> context change -> render -> ...)
  const [evaluatedFilters, setEvaluatedFilters] = useState<EvaluatedFilter>({ filter: undefined, ready: !isDefined(args.filter) });

  useEffect(() => {
    let cancelled = false;
    const evaluateAsync = async (): Promise<EvaluatedFilter> => {
      if (!isDefined(args.filter)) return { filter: '', ready: true };

      const response = await evaluateDynamicFilters(
        [{ expression: args.filter } as IStoredFilter],
        mappings,
        args.metadataAccessor,
      );

      const result = response[0];
      const ready = !isDefined(result) || result.hasDynamicExpression !== true || result.allFieldsEvaluatedSuccessfully === true;
      const rowFilter = result?.rowFilter;
      const rowPredicate: RowPredicate | undefined = isDefined(rowFilter)
        ? ((): RowPredicate => {
          const options = { context: buildEvaluationContext(mappings), evaluators: createDefaultEvaluators() };
          return (row) => matchesRow(row, rowFilter, options);
        })()
        : undefined;
      return { filter: JSON.stringify(result?.expression) || '', ready, rowPredicate };
    };
    evaluateAsync().then((next) => {
      // a row predicate closes over the current context, so it is always taken fresh
      if (!cancelled)
        setEvaluatedFilters((prev) => prev.filter === next.filter && prev.ready === next.ready && prev.rowPredicate === undefined && next.rowPredicate === undefined ? prev : next);
    }).catch((error) => {
      console.error('Failed to evaluate filter', error);
    });
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, useDeepCompareMemoize([args.filter, prevChanged.current]));

  return evaluatedFilters;
};

export const useFormEvaluatedFilter = (args: UseFormEvaluatedFilterArgs, additionalData?: object): string | undefined => {
  return useFormEvaluatedFilterWithReadiness(args, additionalData).filter;
};
