import { IFontControlValues } from "./interface";

export const convertToCSSProperties = (values: IFontControlValues): React.CSSProperties => {

  return {
    fontSize: `${values?.fontSize}px`,
    fontWeight: values?.fontWeight,
    textDecoration: values?.textDecoration,
    textAlign: values?.fontAlignment as React.CSSProperties['textAlign'],
    color: values?.fontColor
  };
};
