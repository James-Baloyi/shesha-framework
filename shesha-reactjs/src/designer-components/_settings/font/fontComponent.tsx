import React, { useState } from 'react';
import { InputNumber, Select, Slider, Form, ColorPicker } from 'antd';

const { Option } = Select;

interface IFontControlValues {
    fontSize?: number;
    fontWeight?: number;
    textDecoration?: string;
    fontAlignment?: string;
    fontColor?: string;
}

interface IFontSizeControlProps {
    fields: string[];
    onChange?: (values: IFontControlValues) => void;
    value?: IFontControlValues;
}

const FontComponent: React.FC<IFontSizeControlProps> = ({ fields, onChange, value }) => {
    const [fontSize, setFontSize] = useState<number>(value?.fontSize || 14);
    const [fontWeight, setFontWeight] = useState<number>(value?.fontWeight || 400);
    const [textDecoration, setTextDecoration] = useState<string>(value?.textDecoration || 'none');
    const [fontAlignment, setFontAlignment] = useState<string>(value?.fontAlignment || 'start');
    const [fontColor, setFontColor] = useState<string>(value?.fontColor || '#000000');

    const handleFieldChange = (field: keyof IFontControlValues, val: any) => {
        switch (field) {
            case 'fontSize':
                setFontSize(val);
                break;
            case 'fontWeight':
                setFontWeight(val);
                break;
            case 'textDecoration':
                setTextDecoration(val);
                break;
            case 'fontAlignment':
                setFontAlignment(val);
                break;
            case 'fontColor':
                setFontColor(val);
                break;
        }
        triggerChange({ [field]: val });
    };

    const triggerChange = (changedValues: Partial<IFontControlValues>) => {
        const newValues = {
            fontSize,
            fontWeight,
            textDecoration,
            fontAlignment,
            fontColor,
            ...changedValues,
        };
        if (onChange) {
            onChange(newValues);
        }
    };

    return (
        <Form>
            {fields.includes('fontSize') && (
                <Form.Item label="Font Size" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                    <InputNumber value={fontSize} defaultValue={14} onChange={(val) => handleFieldChange('fontSize', val)} />
                </Form.Item>
            )}
            {fields.includes('fontWeight') && (
                <Form.Item label="Font Weight" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                    <Slider min={100} max={900} step={100} value={fontWeight} onChange={(val) => handleFieldChange('fontWeight', val)} />
                </Form.Item>
            )}
            {fields.includes('textDecoration') && (
                <Form.Item label="Text Decoration" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                    <Select value={textDecoration} onChange={(val) => handleFieldChange('textDecoration', val)}>
                        <Option value="italic">Italic</Option>
                        <Option value="underline">Underline</Option>
                        <Option value="bold">Bold</Option>
                        <Option value="none">None</Option>
                    </Select>
                </Form.Item>
            )}
            {fields.includes('fontAlignment') && (
                <Form.Item label="Font Alignment" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                    <Select value={fontAlignment} onChange={(val) => handleFieldChange('fontAlignment', val)}>
                        <Option value="start">Left</Option>
                        <Option value="center">Center</Option>
                        <Option value="end">Right</Option>
                    </Select>
                </Form.Item>
            )}
            {fields.includes('fontColor') && (
                <Form.Item label="Font Color" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                    <ColorPicker
                        allowClear
                        value={fontColor}
                        onChange={(color) => handleFieldChange('fontColor', color.toHexString())}
                    />
                </Form.Item>
            )}
        </Form>
    );
};

export default FontComponent;
