import React, { FC, MutableRefObject, PropsWithChildren, useState, useEffect, useCallback } from 'react';
import { useForm } from '@/providers/form';
import { FormMarkupWithSettings, useFormDesignerComponents, useMetadata } from '@/providers';
import { Tooltip, Dropdown, Menu, message } from 'antd';
import { useFormDesigner } from '@/providers/formDesigner';
import { useDataContext } from '@/providers/dataContextProvider/contexts';
import { DeleteFilled, FunctionOutlined, CopyOutlined } from '@ant-design/icons';
import { useStyles } from '../styles/styles';
import { componentsFlatStructureToTree } from '@/index';
import { useFormPersister } from '@/providers/formPersisterProvider';
import './Shake.css'; // Import the CSS file for shake effect

interface IDragWrapperProps {
  componentId: string;
  componentRef: MutableRefObject<any>;
  readOnly?: boolean;
}

export const DragWrapper: FC<PropsWithChildren<IDragWrapperProps>> = (props) => {
  const { styles } = useStyles();
  const { getComponentModel } = useForm();
  const { saveForm } = useFormPersister();
  const { selectedComponentId, setSelectedComponent, isDebug, deleteComponent, duplicateComponent, readOnly, undo, redo, canRedo, canUndo } = useFormDesigner();
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false); // State for shake effect

  const metadata = useMetadata(false);
  const dataContext = useDataContext(false);

  const componentModel = getComponentModel(props.componentId);
  const { allComponents, componentRelations, formSettings } = useFormDesigner();
  const toolboxComponents = useFormDesignerComponents();

  const saveFormInternal = (): Promise<void> => {
    const payload: FormMarkupWithSettings = {
      components: componentsFlatStructureToTree(toolboxComponents, { allComponents, componentRelations }),
      formSettings: formSettings,
    };
    return saveForm(payload);
  };

  const tooltip = (
    <div>
      {isDebug && (
        <div>
          <strong>Id:</strong> {componentModel.id}
        </div>
      )}
      <div>
        <strong>Type:</strong> {componentModel.type}
      </div>
      {Boolean(componentModel.propertyName) && (
        <div>
          <strong>Property name: </strong> 
          {typeof(componentModel.propertyName) === 'string' ? componentModel.propertyName : ''}
          {typeof(componentModel.propertyName) === 'object' && <FunctionOutlined />}
        </div>
      )}
      {Boolean(componentModel.componentName) && (
        <div><strong>Component name: </strong>{componentModel.componentName}</div>
      )}
    </div>
  );

  const undoFunction = () => {
    if (canUndo) {
      undo();
    } else {
      setShake(true);
    }
  };

  const redoFunction = () => {
    if (canRedo) {
      redo();
    } else {
      setShake(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undoFunction();
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        redoFunction();
      } else if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        message.info("Saving...");
        saveFormInternal().then(() => {
          message.success("Form saved!");
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undoFunction, redoFunction]);

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (selectedComponentId !== props.componentId)
      setSelectedComponent(
        props.componentId,
        metadata?.id,
        dataContext,
        props.componentRef
      );
  };

  const onMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  const onMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsOpen(false);
  };

  const onDeleteClick = () => {
    deleteComponent({ componentId: componentModel.id });
  };

  const onDuplicateClick = () => {
    if (!readOnly)
      duplicateComponent({ componentId: selectedComponentId });
  };

  const menu = (
    <Menu>
      <Menu.Item key="duplicate" onClick={onDuplicateClick} icon={<CopyOutlined />}>
        Duplicate
      </Menu.Item>
      <Menu.Item key="delete" onClick={onDeleteClick} style={{ color: "red" }} icon={<DeleteFilled style={{ color: "red" }} />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <div
        className={`${styles.componentDragHandle} ${shake ? 'shake' : ''}`} // Apply shake class conditionally
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onContextMenu={onContextMenu}
      >
        <Tooltip title={tooltip} placement="right" open={isOpen}>
          {props.children}
        </Tooltip>
      </div>
    </Dropdown>
  );
};

export default DragWrapper;
