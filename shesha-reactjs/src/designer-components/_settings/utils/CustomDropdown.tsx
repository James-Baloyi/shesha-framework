import React, { FC, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Space } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { IDropdownOption } from '@/designer-components/_settings/utils/background/interfaces';

interface CustomDropdownProps {
    value: string;
    options: Array<string | IDropdownOption>;
    readOnly?: boolean;
    label?: string | React.ReactNode;
    size?: SizeType;
    onAddCustomOption?: (newOption: string) => void;
    onChange?: (value: string) => void;
    variant?: 'borderless' | 'outlined' | 'filled';
}

const CustomDropdown: FC<CustomDropdownProps> = ({
    value,
    options,
    readOnly,
    label,
    onChange,
    size
}) => {
    const [customOption, setCustomOption] = useState({ x: '', y: '' });
    const [customOptions, setCustomOptions] = useState(options);

    const clearInputs = () => {
        setCustomOption({ x: '', y: '' });
    };

    const addCustomOption = () => {
        const { x, y } = customOption;
        const newValue = `${x} ${y}`;
        setCustomOptions(prev => [...prev, newValue]);
        clearInputs();
    };

    const renderCustomOptionInput = () => (
        <>
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }} onClick={(e) => e.stopPropagation()}>
                <Space.Compact size="large">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', width: '100%' }}>
                        {['x', 'y'].map((dim) => (
                            <div key={dim} >
                                <Space style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Input
                                        type='number'
                                        readOnly={readOnly}
                                        value={customOption[dim].value}
                                        onChange={(e) => setCustomOption(prev => ({ ...prev, [dim]: e.target.value }))}
                                        size='small'
                                        prefix={dim}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Space>

                            </div>
                        ))}
                    </div>
                </Space.Compact>
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={addCustomOption}
                    disabled={readOnly}
                    style={{ width: 70, padding: '0 8px' }}
                >
                    Apply {label}
                </Button>
            </Space>
        </>
    );

    return (
        <Select
            value={value}
            disabled={readOnly}
            size={size}
            onChange={onChange}
            dropdownRender={(menu) => (
                <>
                    {menu}
                    {renderCustomOptionInput()}
                </>
            )}
            options={customOptions.map((item) => typeof item === 'string' ? { label: item, value: item } : item)}
        />
    );
};

export default CustomDropdown;
