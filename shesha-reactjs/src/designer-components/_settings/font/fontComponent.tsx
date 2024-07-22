import React, { useState } from 'react';
import { InputNumber, Select, Slider, Form, ColorPicker } from 'antd';

const { Option } = Select;

interface IFontControlValues {
    fontSize: number;
    fontWeight: number;
    textDecoration: string;
    fontAlignment: string;
    fontColor: string;
}

interface IFontSizeControlProps {
    onChange?: (values: IFontControlValues) => void;
    value?: IFontControlValues
}

const FontComponent: React.FC<IFontSizeControlProps> = ({ onChange, value }) => {
    const [fontSize, setFontSize] = useState<number>(value?.fontSize);
    const [fontWeight, setFontWeight] = useState<number>(value?.fontWeight);
    const [textDecoration, settextDecoration] = useState<string>(value?.textDecoration);
    const [fontAlignment, setFontAlignment] = useState<string>(value?.fontAlignment);
    const [fontColor, setFontColor] = useState<string>(value?.fontColor);

    const handleFontSizeChange = (value: number) => {
        setFontSize(value);
        triggerChange({ fontSize: value });
    };

    const handleFontWeightChange = (value: number) => {
        setFontWeight(value);
        triggerChange({ fontWeight: value });
    };

    const handleTextDecorationChange = (value: string) => {
        settextDecoration(value);
        triggerChange({ textDecoration: value });
    };

    const handleFontAlignmentChange = (value: string) => {
        setFontAlignment(value);
        triggerChange({ fontAlignment: value });
    };

    const handleFontColorChange = (value: string) => {
        setFontColor(value);
        triggerChange({fontColor: value});
    }

    const triggerChange = (changedValues: Partial<IFontControlValues>) => {
        const newValues = {
            fontSize,
            fontWeight,
            textDecoration,
            fontAlignment,
            fontColor,
            ...changedValues,
        };
        onChange(newValues);
    };

    return (
        <Form>
            <Form.Item
                label="Font Size"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <InputNumber value={fontSize} defaultValue={14} onChange={handleFontSizeChange} />
            </Form.Item>

            <Form.Item
                label="Font Weight"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Slider
                    min={100}
                    max={900}
                    step={100}
                    value={fontWeight}
                    onChange={handleFontWeightChange}
                />
            </Form.Item>

            <Form.Item
                label="Text Decoration"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Select value={textDecoration} onChange={handleTextDecorationChange}>
                    <Option value="italic">Italic</Option>
                    <Option value="underline">Underline</Option>
                    <Option value="bold">Bold</Option>
                    <Option value="none">None</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Font Alignment"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Select value={fontAlignment} onChange={handleFontAlignmentChange}>
                    <Option value="start">Left</Option>
                    <Option value="center">Center</Option>
                    <Option value="end">Right</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Font Color"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <ColorPicker
                    allowClear
                    value={value?.fontColor || '#000000'}
                    onChange={(color)=>handleFontColorChange(color.toHexString())}
                />
            </Form.Item>
        </Form>
    );
};

export default FontComponent;
