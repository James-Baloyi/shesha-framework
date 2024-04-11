import React, { CSSProperties, FC } from 'react';
import { Image } from 'antd';

export enum ImageStorageFormat {
    url = 'url',
    storedFile = 'stored-file',
    base64 = 'base64',
}
export interface IImageFieldProps {
    storageFormat: ImageStorageFormat;
    value?: string;
    onChange?: (newValue: string) => void;
    readOnly: boolean;
    style: CSSProperties

    height?: string | number;
    width?: string | number;
}

export const ImageField: FC<IImageFieldProps> = (props) => {
    const { value, height, width, style } = props;
    return (
        <Image
            src={value}
            height={height}
            width={width}
            preview={false}
            style={style}
        />
    );
};