import { IConfigurableFormComponent } from "@/providers";
import { Color } from "antd/es/color-picker";

export interface IFontControlValues {
    fontSize: number;
    fontWeight: number;
    fontColor: Color;
    fontAlignment: string;
}

export interface IFontSizeControlProps extends IConfigurableFormComponent{
    onChange?: (values: IFontControlValues) => void;
    value?: IFontControlValues
}