import {
  ColumnSorting,
  DataFetchingMode,
  FilterExpression,
  GroupingItem,
  ISortingItem,
  SortMode,
} from '@/providers/dataTable/interfaces';
import { IConfigurableFormComponent } from '@/providers/form/models';
import { ComponentDefinition, YesNoInherit } from '@/interfaces';
import { IConfigurableActionConfiguration } from '@/interfaces/configurableAction';
import { IEntityTypeIdentifier } from '@/providers/sheshaApplication/publicApi/entities/models';

export interface ITableContextComponentProps extends Omit<IConfigurableFormComponent, 'description'> {
  sourceType?: 'Form' | 'Entity' | 'Url';
  entityType?: string | IEntityTypeIdentifier;
  endpoint?: string;
  customReorderEndpoint?: string;
  components?: IConfigurableFormComponent[]; // If isDynamic we wanna
  dataFetchingMode?: DataFetchingMode;
  defaultPageSize?: number;
  grouping?: GroupingItem[];
  sortMode?: SortMode;
  strictSortBy?: string;
  strictSortOrder?: ColumnSorting;
  standardSorting?: ISortingItem[];
  allowReordering?: YesNoInherit;
  permanentFilter?: FilterExpression;
  disableRefresh?: string;
  onBeforeRowReorder?: IConfigurableActionConfiguration;
  onAfterRowReorder?: IConfigurableActionConfiguration;
}

export interface IBeforeRowReorderArguments<TData = unknown> {
  oldIndex: number;
  newIndex: number;
  rowData: TData;
  allData: TData[];
}

export interface IAfterRowReorderArguments<TData = unknown, TResponse = unknown> {
  oldIndex: number;
  newIndex: number;
  rowData: TData;
  allData: TData[];
  response?: TResponse;
}

/**
 * Legacy DataTable Context component definition (datatableContext)
 * @deprecated Use TableContextComponentDefinition instead. This is kept only for migration of existing forms.
 */
export type TableContextComponentLegacyDefinition = ComponentDefinition<"datatableContext", ITableContextComponentProps>;

/**
 * Data Context component definition (dataContext)
 * This is the new clean implementation of the data context component.
 */
export type TableContextComponentDefinition = ComponentDefinition<'dataContext', ITableContextComponentProps>;
