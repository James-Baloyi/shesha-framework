import React, { useState } from 'react';
import { InputNumber, Select, Slider, Form } from 'antd';
import { ColorPicker } from 'antd';
import { Color } from 'antd/es/color-picker';

const { Option } = Select;

interface IFontControlValues {
    fontSize: number;
    fontWeight: number;
    fontColor: Color;
    fontAlignment: string;
}

interface IFontSizeControlProps {
    onChange?: (values: IFontControlValues) => void;
    value?: IFontControlValues
}


const FontComponent: React.FC<IFontSizeControlProps> = ({ onChange, value = { fontSize: 12, fontWeight: 700, fontColor: "#ff00ff", fontAlignment: "left" } }) => {
    const [fontSize, setFontSize] = useState<number>(value.fontSize);
    const [fontWeight, setFontWeight] = useState<number>(value.fontWeight);
    const [fontColor, setFontColor] = useState<Color>();
    const [fontAlignment, setFontAlignment] = useState<string>(value.fontAlignment);

    const handleFontSizeChange = (value: number) => {
        setFontSize(value);
        triggerChange({ fontSize: value });
    };

    const handleFontWeightChange = (value: number) => {
        setFontWeight(value);
        triggerChange({ fontWeight: value });
    };

    const updateFontColor = (value: Color) => {
        setFontColor(value);
        triggerChange({ fontColor: value });
    }

    const handleFontAlignmentChange = (value: string) => {
        setFontAlignment(value);
        triggerChange({ fontAlignment: value });
    };

    const triggerChange = (changedValues: Partial<IFontControlValues>) => {
        console.log(changedValues)
        const newValues = {
            fontSize,
            fontWeight,
            fontColor,
            fontAlignment,
            ...changedValues,
        };
        onChange(newValues);
    };

    return (
        <Form layout="horizontal">
            <Form.Item label="Font Size">
                <InputNumber min={8} max={72} value={fontSize} onChange={handleFontSizeChange} />
            </Form.Item>

            <Form.Item label="Font Weight">
                <Slider
                    min={100}
                    max={900}
                    step={100}
                    value={fontWeight}
                    onChange={handleFontWeightChange}
                />
            </Form.Item>

            <Form.Item label="Font Color">
                <ColorPicker
                    allowClear
                    value={'#000000'}
                    onChange={(color) => updateFontColor(color)}
                />
            </Form.Item>

            <Form.Item label="Font Alignment">
                <Select value={fontAlignment} onChange={handleFontAlignmentChange}>
                    <Option value="left">Left</Option>
                    <Option value="center">Center</Option>
                    <Option value="right">Right</Option>
                    <Option value="justify">Justify</Option>
                </Select>
            </Form.Item>
        </Form>
    );
};

export default FontComponent;
