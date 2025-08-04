import React, { useState } from 'react';

interface BasicComponentProps {
  title?: string;
  initialCount?: number;
  readonly?: boolean;
  onChange?: (e) => void;
  value?: any;
}

const BasicComponent: React.FC<BasicComponentProps> = ({ 
  title = 'Basic Component', 
  initialCount = 2,
  onChange,
  value
}) => {
  const [count, setCount] = useState<number>(initialCount);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    onChange(count)
  };

  const handleDecrement = () => {
    setCount(prev => prev - 1);
    onChange(count)
  };

  const handleReset = () => {
    setCount(initialCount);

  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <div onClick={handleDecrement}>-</div>
        <div onClick={handleReset}>Reset</div>
        <div onClick={handleIncrement}>+</div>
      </div>
    </div>
    
  );
};

export default BasicComponent;