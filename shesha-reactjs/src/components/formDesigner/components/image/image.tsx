import React, { FC } from 'react';
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

    height?: string | number;
    width?: string | number;
}

export const ImageField: FC<IImageFieldProps> = (props) => {
    const { value, height, width } = props;
    console.log(value, "IMAGE URL")
    return (
        <Image
            src={"https://static.canva.com/web/images/12487a1e0770d29351bd4ce4f87ec8fe.svg"}
            height={height}
            width={width}
        />
    );
};