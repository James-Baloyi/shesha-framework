import React from 'react';
import classNames from 'classnames';
import { Select } from 'antd';
import { EXPRESSION_FIELD, findField, getFieldKind } from '../catalogue/fields';
import { getOperator, getOperatorsForExpression, getOperatorsForKind } from '../catalogue/operators';
import { RuleNode } from '../model/types';
import { SourceItem, SourceSelector } from '../sourceSelector';
import { useBuilder } from './context';
import { ExpressionValueEditor } from './expressionValueEditor';
import { FieldPicker } from './fieldPicker';
import { RuleValueEditor } from './ruleValueEditor';

/** The left side is a property, or a function over the record that the browser applies after the fetch. */
const FIELD_SOURCES: SourceItem[] = [['func', { label: 'Function' }], ['field', { label: 'Field' }]];
const FIELD_EXPRESSION_PLACEHOLDER = 'Function over the row, e.g. {{UPPER(row.country)}}';

const stopPointerPropagation = (event: React.MouseEvent | React.PointerEvent): void => {
  event.stopPropagation();
};

interface RuleRowProps {
  rule: RuleNode;
}

export const RuleRow: React.FC<RuleRowProps> = ({ rule }) => {
  const { dispatch, fields, readOnly } = useBuilder();
  const isFunction = rule.fieldExpression !== undefined;
  const field = isFunction ? EXPRESSION_FIELD : findField(fields, rule.field);
  const operators = isFunction ? getOperatorsForExpression() : getOperatorsForKind(field?.kind);
  const operator = getOperator(rule.operator);
  const operatorOptions = React.useMemo(() => operators.map((op) => ({ value: op.key, label: op.label })), [operators]);
  const isUnary = operator?.cardinality === 0;

  const onFieldChange = (path: string | undefined): void => {
    const nextKind = getFieldKind(findField(fields, path)?.property.dataType);
    const keepOperator = operator !== undefined && operator.kinds.includes(nextKind);
    dispatch({ type: 'setField', id: rule.id, field: path, resetOperator: !keepOperator });
  };

  return (
    <div className={classNames('sha-query-builder-rule-row', isUnary && 'is-unary')}>
      <div className={classNames('sha-query-builder-packed-control', 'sha-query-builder-packed-control--field', isFunction && 'is-function')}>
        <div className="sha-query-builder-source-slot">
          <SourceSelector
            variant="field"
            valueSources={FIELD_SOURCES}
            valueSrc={isFunction ? 'func' : 'field'}
            setValueSrc={(key) => dispatch({ type: 'setFieldSource', id: rule.id, source: key === 'func' ? 'expression' : 'field' })}
            readonly={readOnly}
          />
        </div>
        <div className="sha-query-builder-field-slot sha-query-builder-control-slot">
          {rule.fieldExpression
            ? (
              <ExpressionValueEditor
                value={rule.fieldExpression}
                onChange={(value) => dispatch({ type: 'setFieldExpression', id: rule.id, value })}
                readOnly={readOnly}
                showRequiredToggle
                placeholder={FIELD_EXPRESSION_PLACEHOLDER}
              />
            )
            : <FieldPicker value={rule.field} onChange={onFieldChange} readOnly={readOnly} placeholder="Select field" />}
        </div>
      </div>

      <div className="sha-query-builder-operator-slot" title={operator?.label}>
        <div
          className="sha-query-builder-operator-select sha-query-builder-control-slot"
          onMouseDown={stopPointerPropagation}
          onPointerDown={stopPointerPropagation}
        >
          <Select
            value={rule.operator}
            options={operatorOptions}
            variant="borderless"
            placeholder="Select operator"
            onChange={(next) => dispatch({ type: 'setOperator', id: rule.id, operator: next })}
            disabled={readOnly || field === undefined}
            popupMatchSelectWidth={false}
            size="small"
          />
        </div>
      </div>

      <RuleValueEditor rule={rule} field={field} operator={operator} />
    </div>
  );
};
