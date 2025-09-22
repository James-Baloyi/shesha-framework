import { useRef } from "react";
import { IApplicationContext, executeScriptSync, useAvailableConstantsContexts, wrapConstantsData } from "..";
import { TouchableProxy, makeTouchableProxy } from "@/providers/form/touchableProxy";
import { isEqual } from "lodash";

export interface IActualContextExecutionResult<T = any> {
  value: T;
  isResolving: boolean;
  hasError: boolean;
  error?: any;
}

export function useActualContextExecution<T = any>(code: string, additionalData?: any) {
  const fullContext = useAvailableConstantsContexts();
  const accessors = wrapConstantsData({ fullContext });

  const contextProxyRef = useRef<TouchableProxy<IApplicationContext>>();
  if (!contextProxyRef.current) {
    contextProxyRef.current = makeTouchableProxy<IApplicationContext>(accessors);
  } else {
    contextProxyRef.current.refreshAccessors(accessors);
  }
  contextProxyRef.current.setAdditionalData(additionalData);

  contextProxyRef.current.checkChanged();

  const prevCode = useRef<string>();
  const actualDataRef = useRef<T>(undefined);

  if (contextProxyRef.current.changed || !isEqual(prevCode.current, code)) {
    actualDataRef.current = Boolean(code)
      ? executeScriptSync(code, contextProxyRef.current)
      : undefined;
  }

  prevCode.current = code;

  return actualDataRef.current;
}

export function useActualContextExecutionWithStatus<T = any>(code: string, additionalData?: any): IActualContextExecutionResult<T> {
  const fullContext = useAvailableConstantsContexts();
  const accessors = wrapConstantsData({ fullContext });

  const contextProxyRef = useRef<TouchableProxy<IApplicationContext>>();
  if (!contextProxyRef.current) {
    contextProxyRef.current = makeTouchableProxy<IApplicationContext>(accessors);
  } else {
    contextProxyRef.current.refreshAccessors(accessors);
  }
  contextProxyRef.current.setAdditionalData(additionalData);

  contextProxyRef.current.checkChanged();

  const prevCode = useRef<string>();
  const actualDataRef = useRef<T>(undefined);
  const isResolvingRef = useRef<boolean>(false);
  const errorRef = useRef<any>(null);

  if (contextProxyRef.current.changed || !isEqual(prevCode.current, code)) {
    if (Boolean(code)) {
      try {
        isResolvingRef.current = true;
        errorRef.current = null;

        const result = executeScriptSync(code, contextProxyRef.current);
        
        const hasUndefinedProperties = result === undefined && contextProxyRef.current.touchedProps.size > 0;

        actualDataRef.current = result;
        isResolvingRef.current = hasUndefinedProperties;
      } catch (error) {
        errorRef.current = error;
        isResolvingRef.current = false;
        actualDataRef.current = undefined;
      }
    } else {
      actualDataRef.current = undefined;
      isResolvingRef.current = false;
      errorRef.current = null;
    }
  }

  prevCode.current = code;

  return {
    value: actualDataRef.current,
    isResolving: isResolvingRef.current,
    hasError: !!errorRef.current,
    error: errorRef.current
  };
}

export function useActualContextExecutionExecutor<T = any>(executor: (context: any) => any, additionalData?: any) {
  const fullContext = useAvailableConstantsContexts();
  const accessors = wrapConstantsData({ fullContext });

  const contextProxyRef = useRef<TouchableProxy<IApplicationContext>>();
  if (!contextProxyRef.current) {
    contextProxyRef.current = makeTouchableProxy<IApplicationContext>(accessors);
  } else {
    contextProxyRef.current.refreshAccessors(accessors);
  }
  contextProxyRef.current.setAdditionalData(additionalData);    

  contextProxyRef.current.checkChanged();

  const prevCode = useRef(executor);
  const actualDataRef = useRef<T>(undefined);

  if (contextProxyRef.current.changed || !isEqual(prevCode.current, executor)) {
    actualDataRef.current = executor(contextProxyRef.current);
  }

  prevCode.current = executor;

  return actualDataRef.current;
}