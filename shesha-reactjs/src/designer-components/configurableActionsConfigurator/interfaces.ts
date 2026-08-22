import { ComponentDefinition } from '@/interfaces';
import { IConfigurableFormComponent } from '@/providers/form/models';

/**
 * A constant the owning component injects into the action's evaluation context at runtime,
 * declared here so the action's script editors advertise it (autocomplete/hints).
 * Serializable: declared in settings-form markup.
 */
export interface IActionConfiguratorConstant {
  path: string;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';
}

export interface IConfigurableActionConfiguratorComponentProps extends IConfigurableFormComponent {
  allowedActions?: string[];
  /**
   * Extra constants available to the configured action's arguments and scripts, on top of the
   * standard set. The owning component is responsible for actually providing them in the
   * action's evaluation context at runtime
   */
  additionalConstants?: IActionConfiguratorConstant[];
}

export type ConfigurableActionConfiguratorComponentDefinition = ComponentDefinition<"configurableActionConfigurator", IConfigurableActionConfiguratorComponentProps>;
