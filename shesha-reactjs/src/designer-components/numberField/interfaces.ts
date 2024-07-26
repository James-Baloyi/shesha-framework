import { IConfigurableFormComponent } from '@/providers/form/models';

export interface INumberFieldComponentProps extends IConfigurableFormComponent {
  hideBorder?: boolean;
  min?: number;
  max?: number;
  highPrecision?: boolean;
  stepNumeric?: number;
  stepString?: string;
  placeholder?: string;
  borderSize?: number;
  borderRadius?: number;
  borderType?: string;
  borderColor?: string;
  fontSize?: string;
  stylingBox?: string;
  height?: string;
  width?: string;
  backgroundColor?: string;
}
