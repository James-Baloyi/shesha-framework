import { IConfigurableFormComponent } from "@/providers";

export interface IFontControlValues {
    fontSize?: number;
    fontWeight?: number;
    fontColor?: string;
    fontAlignment?: string;
    textDecoration?: string;
}

export interface IFontSizeControlProps extends IConfigurableFormComponent{
    onChange?: (values: IFontControlValues) => void;
    value?: IFontControlValues;
    fields?: string[];
}